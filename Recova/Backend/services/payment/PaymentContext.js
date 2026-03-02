import StripePaymentStrategy from './StripePaymentStrategy.js';
import PayPalPaymentStrategy from './PayFastPaymentStrategy.js';

class PaymentContext {
    constructor() {
        this.strategy = null;
        this.strategies = {
            stripe: new StripePaymentStrategy(),
            payfast: new PayPalPaymentStrategy()
        };
    }

    // Set payment strategy dynamically
    setStrategy(paymentMethod) {
        const strategy = this.strategies[paymentMethod.toLowerCase()];
        
        if (!strategy) {
            throw new Error(`Payment method '${paymentMethod}' is not supported`);
        }
        
        this.strategy = strategy;
        return this;
    }

    // Process payment using selected strategy
    async processPayment(amount, customerData) {
        if (!this.strategy) {
            throw new Error('Payment strategy not set');
        }
        return await this.strategy.processPayment(amount, customerData);
    }

}

export default PaymentContext;
