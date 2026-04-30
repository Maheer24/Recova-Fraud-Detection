import hashlib
import json
from datetime import datetime
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "recova_fraud_detection"

class ReportService:
    def __init__(self):
        try:
            self.client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            self.db = self.client[DB_NAME]
            self.reports_collection = self.db["reports"]
        except Exception as e:
            print(f"MongoDB connection error: {e}")
            self.db = None
            self.reports_collection = None

    def _serialize_report(self, report: dict) -> dict:
        serialized = dict(report)
        if serialized.get("_id") is not None:
            serialized["_id"] = str(serialized["_id"])
        if isinstance(serialized.get("created_at"), datetime):
            serialized["created_at"] = serialized["created_at"].isoformat()
        return serialized
    
    def generate_hash(self, data: dict) -> str:

        json_str = json.dumps(data, sort_keys=True, default=str)
        return hashlib.sha256(json_str.encode()).hexdigest()
    
    def save_report(self, filename: str, report_data: dict, fraud_count: int, normal_count: int) -> dict:

        if self.reports_collection is None:
            return {"error": "MongoDB not connected"}
        
        try:
           
            report_hash = self.generate_hash(report_data)
            
            
            total = fraud_count + normal_count
            fraud_percentage = (fraud_count / total * 100) if total > 0 else 0
            
           
            report_doc = {
                "filename": filename,
                "report_hash": report_hash,
                "fraud_count": fraud_count,
                "normal_count": normal_count,
                "fraud_percentage": fraud_percentage,
                "total_transactions": total,
                "report_data": report_data,
                "created_at": datetime.utcnow()
            }
            
            
            result = self.reports_collection.insert_one(report_doc)
            report_doc["_id"] = str(result.inserted_id)
            
            print(f"✅ Report saved to MongoDB with ID: {result.inserted_id}")
            return {
                "success": True,
                "report_id": str(result.inserted_id),
                "report_hash": report_hash,
                "message": "Report saved successfully"
            }
        
        except Exception as e:
            print(f"❌ Error saving report: {e}")
            return {"error": str(e)}
    
    def get_report(self, report_id: str) -> dict:
        """Retrieve report from MongoDB by ID."""
        if self.reports_collection is None:
            return {"error": "MongoDB not connected"}
        
        try:
            report = self.reports_collection.find_one({"_id": ObjectId(report_id)})
            if report:
                return self._serialize_report(report)
            return {"error": "Report not found"}
        except Exception as e:
            return {"error": str(e)}
    
    def get_all_reports(self, filename: str = None) -> list:
        """Retrieve all reports or reports for specific filename."""
        if self.reports_collection is None:
            return []
        
        try:
            query = {}
            if filename:
                query["filename"] = filename
            
            reports = list(self.reports_collection.find(query).sort("created_at", -1))
            return [self._serialize_report(report) for report in reports]
        except Exception as e:
            print(f"Error retrieving reports: {e}")
            return []

    def verify_report_integrity(self, report_id: str, blockchain_service) -> dict:
        """Compare current MongoDB report hash with the original blockchain hash."""
        if self.reports_collection is None:
            return {"success": False, "error": "MongoDB not connected"}

        try:
            report = self.reports_collection.find_one({"_id": ObjectId(report_id)})
        except Exception:
            return {"success": False, "error": "Invalid report_id"}

        if not report:
            return {"success": False, "error": "Report not found"}

        report_data = report.get("report_data")
        if report_data is None:
            return {"success": False, "error": "Report data missing in MongoDB"}

        current_hash = self.generate_hash(report_data)
        chain_result = blockchain_service.get_report_hash(report_id)
        if not chain_result.get("success"):
            return {
                "success": False,
                "error": chain_result.get("error", "Failed to read blockchain hash"),
                "current_hash": current_hash,
            }

        blockchain_hash = chain_result.get("hash", "")
        is_tamper_free = current_hash == blockchain_hash

        return {
            "success": True,
            "report_id": report_id,
            "is_tamper_free": is_tamper_free,
            "status": "Tamper-Free" if is_tamper_free else "Data Modified!",
            "blockchain_hash": blockchain_hash,
            "current_hash": current_hash,
            "created_at": report.get("created_at").isoformat() if isinstance(report.get("created_at"), datetime) else report.get("created_at"),
        }
