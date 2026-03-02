import PaymentStrategy from './PaymentStrategy.js';
import Stripe from 'stripe';

class StripePaymentStrategy extends PaymentStrategy {
    constructor() {
        super();
        this.stripe = new Stripe(process.env.STRIPE_API_KEY);
    }

    async processPayment(amount, customerData) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amount * 100, // Stripe uses cents
                currency: 'usd',
                description: customerData.description || 'Consultation Payment',
                metadata: {
                    email: customerData.email,
                    name: customerData.name
                }
            });

            return {
                success: true,
                transactionId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
                status: paymentIntent.status,
                provider: 'stripe',
                amount: amount,
                data: paymentIntent
            };
        } catch (error) {
            console.error("Stripe payment error:", error);
            return {
                success: false,
                error: error.message,
                provider: 'stripe'
            };
        }
    }


}
export default StripePaymentStrategy;
