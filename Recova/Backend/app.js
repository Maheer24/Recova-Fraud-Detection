import express from 'express';
import connectDB from './db/db.js';
import userRouter from './routes/userrouter.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import cors from 'cors';
import Stripe from 'stripe';






const stripe = new Stripe(process.env.STRIPE_API_KEY)
const app = express();
connectDB();
app.use(cors({
  origin: "http://localhost:5173", // ✅ Set this to your frontend URL
  credentials: true,  // ✅ Allows cookies to be sent

}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Set to true in production with HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  (accessToken, refreshToken, profile, done) => {
    console.log("✅ Google Access Token:", accessToken); // Debugging
    profile.accessToken = accessToken; // ✅ Store token inside profile object
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});


//creat user restapi
app.use('/api/user', userRouter);
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })

);

// Google OAuth callback URL
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:5173/profile"); // Redirect after successful login
  }
);
app.get("/auth/logout", (req, res) => {

});


app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Test Product',
          },
          unit_amount: 5000, // $50.00
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,

    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.log("error creating checkout session", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/success', async (req, res) => {
  const sessionid = req.query.session_id;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionid);
    if (session.payment_status === 'paid') {
      res.redirect('http://localhost:5173/success');
      res.json({ message: 'Payment successful', session });
    }
    else {
      res.redirect('http://localhost:5173/cancel');
      res.status(400).json({ message: 'Payment not completed.' });
    }

  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).send('Internal Server Error');

  }
})

export default app;