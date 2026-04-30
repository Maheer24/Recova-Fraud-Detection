from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "recova_fraud_detection"

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Verify connection
    client.admin.command('ping')
    db = client[DB_NAME]
    reports_collection = db["reports"]
    print("✅ Connected to MongoDB")
except ServerSelectionTimeoutError:
    print("⚠️ MongoDB connection failed. Make sure MongoDB is running.")
    db = None
    reports_collection = None
except Exception as e:
    print(f"❌ MongoDB connection error: {e}")
    db = None
    reports_collection = None
