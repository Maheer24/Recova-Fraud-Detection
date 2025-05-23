import express from 'express';
import connectDB from './db/db.js';
import userRouter from './routes/userrouter.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import cors from 'cors';
import Stripe from 'stripe';
import * as  auth from './middleware/authmiddleware.js';
import qs from 'qs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';







const stripe = new Stripe(process.env.STRIPE_API_KEY)
const app = express();
connectDB();
app.use(cors({
  origin: "http://localhost:5173", // ✅ Set this to your frontend URL
  credentials: true,  // ✅ Allows cookies to be sent

}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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



app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // ✅ Create token with user info
    const token = jwt.sign(
      {
        name: req.user.displayName,
        email: req.user.emails[0].value,
        profilePic: req.user.photos[0].value,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Set token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "lax",
    });
   

    // ✅ Now redirect to frontend
  
    res.redirect("http://localhost:5173/pricing");
  }
);

// Google OAuth callback URL
// app.get("/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     res.redirect("http://localhost:5173/profile"); // Redirect after successful login
//   }
// );
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
          unit_amount: 2000, // $50.00
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,

    });

    res.json({ sessionId: session.id });
    
  } catch (err) {
    console.log("error creating checkout session", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/success', async (req, res) => {
 console.log("Request received at /success");
  // console.log('Request Query:', req.query); // Log the query parameters
  // console.log('Session ID from query:', req.query.session_id);
  const sessionid = req.query.session_id;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionid);

    if (session.payment_status === 'paid') {
      // Log the Stripe transaction ID (payment_intent)
      console.log('Stripe Transaction ID:', session.payment_intent);

      // Optionally, retrieve more details of the PaymentIntent (if needed)
      // const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
      // console.log('Payment Intent details:', paymentIntent);

      // Redirect to the success page
      res.redirect('http://localhost:5173/success');
    } else {
      res.redirect('http://localhost:5173/cancel');
    }

  } catch (error) {
    console.error('Error retrieving session:', error);
    return res.redirect('http://localhost:5173/login');
  }
});

// app.get('/success', auth.authuser,async (req, res) => {
//   const sessionid = req.query.session_id;
//   try {
//     const session = await stripe.checkout.sessions.retrieve(sessionid);
//     if (session.payment_status === 'paid') {
//       res.redirect('http://localhost:5173/success');
//       res.json({ message: 'Payment successful', session });
//       console.log('Stripe Transaction ID:', session.payment_intent);

//          const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
//       console.log('Payment Intent details:', paymentIntent);


//     }

//     else {
//       res.redirect('http://localhost:5173/cancel');
//       res.status(400).json({ message: 'Payment not completed.' });
//     }

//   } catch (error) {
//     console.error('Error retrieving session:', error);
//     return res.redirect('http://localhost:5173/login');

//   }
// })


// app.post('/ask', async (req, res) => {
//   const userQuestion = req.body.message;

//   const response = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Put your key in .env file
//     },
//     body: JSON.stringify({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         {
//           role: 'system',
//           content: `You are an assistant for the website BookARide.com. This website allows users to easily book rides at affordable prices. Answer based on this information only.`
//         },
//         {
//           role: 'user',
//           content: userQuestion
//         }
//       ]
//     })
//   });
//  const data = await response.json();
//     console.log('OpenAI API response:', data); // See the full response

//     if (data.choices && data.choices.length > 0) {
//       res.json({ reply: data.choices[0].message.content });
//     } else {
//       res.status(500).json({
//         error: 'No valid response from OpenAI',
//         fullResponse: data
//       });
//     } 
// });



app.post('/payfast/pay', (req, res) => {
  console.log("its running");
  const { amount, name, email } = req.body;


  const MERCHANT_ID = process.env.MERCHANT_ID;
  const MERCHANT_KEY = process.env.MERCHANT_KEY;
  const RETURN_URL = process.env.RETURN_URL;
  const CANCEL_URL = process.env.CANCEL_URL;
  const NOTIFY_URL = process.env.NOTIFY_URL;
  const data = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    return_url: RETURN_URL,
    cancel_url: CANCEL_URL,
    notify_url: NOTIFY_URL,
    amount,
    item_name: 'Purchase',
    name_first: name,
    email_address: email,
  };

  const queryString = qs.stringify(data);
  const redirectUrl = `	https://sandbox.payfast.co.za/eng/process?${queryString}`;

  res.json({ redirectUrl });
});

app.post('/notify', (req, res) => {
  const pfPaymentId = req.body.pf_payment_id;     
  console.log('Payment notification received');
  console.log('PayFast Transaction ID (pf_payment_id):', pfPaymentId);
  // Respond to PayFast
  res.status(200).send('OK');
});


export default app;


