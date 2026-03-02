import PaymentStrategy from './PaymentStrategy.js';
import qs from 'qs';
import crypto from 'crypto';

class PayFastPaymentStrategy extends PaymentStrategy {
    constructor() {
        super();
        // this.merchantId = process.env.MERCHANT_ID;
        // this.merchantKey = process.env.MERCHANT_KEY;
        // this.passphrase = process.env.PAYFAST_PASSPHRASE;
        // this.baseUrl = process.env.NODE_ENV === 'production'
        //     ? 'https://www.payfast.co.za/eng/process'
        //     : 'https://sandbox.payfast.co.za/eng/process';
    }

    // Generate MD5 signature for PayFast
    // generateSignature(data, passphrase = null) {
    //     // Create parameter string
    //     let pfOutput = "";
    //     for (let key in data) {
    //         if (data.hasOwnProperty(key)) {
    //             if (data[key] !== "") {
    //                 pfOutput += `${key}=${encodeURIComponent(data[key].toString().trim()).replace(/%20/g, "+")}&`;
    //             }
    //         }
    //     }

    //     // Remove last ampersand
    //     let getString = pfOutput.slice(0, -1);
    //     if (passphrase !== null) {
    //         getString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`;
    //     }

    //     return crypto.createHash("md5").update(getString).digest("hex");
    // }

    async processPayment(amount, customerData) {
        // try {
        //     const paymentData = {
        //         merchant_id: this.merchantId,
        //         merchant_key: this.merchantKey,
        //         return_url: process.env.RETURN_URL || 'http://localhost:5173/success',
        //         cancel_url: process.env.CANCEL_URL || 'http://localhost:5173/cancel',
        //         notify_url: process.env.NOTIFY_URL || 'http://localhost:3000/notify',
        //         amount: amount.toFixed(2),
        //         item_name: customerData.description || 'Purchase',
        //         name_first: customerData.firstName || customerData.name,
        //         email_address: customerData.email,
        //         m_payment_id: customerData.userId || Date.now().toString(), // Unique payment ID
        //     };

        //     // Generate signature
        //     const signature = this.generateSignature(paymentData, this.passphrase);
        //     paymentData.signature = signature;

        //     const queryString = qs.stringify(paymentData);
        //     const redirectUrl = `${this.baseUrl}?${queryString}`;

        //     return {
        //         success: true,
        //         transactionId: paymentData.m_payment_id,
        //         status: 'pending',
        //         provider: 'payfast',
        //         amount: amount,
        //         redirectUrl: redirectUrl,
        //         data: paymentData
        //     };
        // } catch (error) {
        //     return {
        //         success: false,
        //         error: error.message,
        //         provider: 'payfast'
        //     };
        // }

        try {
             console.log("its running");
              
            
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
                name_first: customerData.name || customerData.firstName,
                email_address: customerData.email,
              };
            
              const queryString = qs.stringify(data);
              const redirectUrl = `https://sandbox.payfast.co.za/eng/process?${queryString}`;
            
            return {
                success: true,
                provider: 'payfast',
                redirectUrl: redirectUrl
            }
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                provider: 'payfast'
            };
                
    }
    }
    // async refund(transactionId, amount) {
    //     // Note: PayFast doesn't have automatic refund API
    //     // Refunds must be done manually through the PayFast merchant portal
    //     return {
    //         success: false,
    //         error: 'PayFast refunds must be processed manually through the merchant portal',
    //         provider: 'payfast',
    //         message: 'Please log in to your PayFast merchant account to process refunds'
    //     };
    // }

    // async verifyPayment(paymentData) {
    //     try {
    //         // Verify PayFast payment using ITN (Instant Transaction Notification) data
    //         const { signature, ...data } = paymentData;

    //         // Generate signature from received data
    //         const generatedSignature = this.generateSignature(data, this.passphrase);

    //         const verified = signature === generatedSignature;

    //         return {
    //             verified: verified,
    //             status: data.payment_status || 'unknown',
    //             amount: parseFloat(data.amount_gross || 0),
    //             provider: 'payfast',
    //             transactionId: data.pf_payment_id
    //         };
    //     } catch (error) {
    //         return {
    //             verified: false,
    //             error: error.message,
    //             provider: 'payfast'
    //         };
    //     }
    // }

    // Additional method for validating PayFast IPN/ITN
    // async validateITN(postData) {
    //     try {
    //         // PayFast server IPs for validation
    //         const validHosts = [
    //             'www.payfast.co.za',
    //             'sandbox.payfast.co.za',
    //             'w1w.payfast.co.za',
    //             'w2w.payfast.co.za',
    //         ];

    //         // Verify the signature
    //         const { signature, ...data } = postData;
    //         const generatedSignature = this.generateSignature(data, this.passphrase);

    //         if (signature !== generatedSignature) {
    //             return { valid: false, error: 'Invalid signature' };
    //         }

    //         return {
    //             valid: true,
    //             paymentStatus: data.payment_status,
    //             transactionId: data.pf_payment_id,
    //             amount: data.amount_gross
    //         };
    //     } catch (error) {
    //         return { valid: false, error: error.message };
    //     }
    // }
}

export default PayFastPaymentStrategy;
