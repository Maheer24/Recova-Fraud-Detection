import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

class MongoService {
    static instance = null;

    constructor() {
        if (MongoService.instance) {
            return MongoService.instance;
        }

        this.connectionPromise = null;
        MongoService.instance = this;
    }

    async connect() {
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }

        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        this.connectionPromise = mongoose
            .connect(process.env.MONGO_URI)
            .then((connection) => {
                console.log("MongoDB connected");
                return connection;
            })
            .catch((err) => {
                this.connectionPromise = null;
                console.error(err.message);
                throw err;
            });

        return this.connectionPromise;
    }
}

export default new MongoService();