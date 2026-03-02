// Base Payment Strategy Interface
class PaymentStrategy {
    async processPayment(amount, customerData) {
        throw new Error("processPayment() must be implemented");
    }
}

export default PaymentStrategy;
