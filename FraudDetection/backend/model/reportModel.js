import mongoose from "mongoose";
const ReportSchema = new mongoose.Schema({
    reportData: Object,           // The actual forensic info
    reportHash: String,           // The SHA-256 "Digital Fingerprint"
    blockchainTxHash: String,     // The "Receipt" from the blockchain transaction
    status: {
        type: String, 
        enum: ['Pending', 'Anchored', 'Tampered'],
        default: 'Pending'
    }
});
const Report = mongoose.model('Report', ReportSchema);
export default Report;