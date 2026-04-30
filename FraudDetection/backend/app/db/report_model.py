from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId

class ReportBase(BaseModel):
    filename: str
    report_hash: str
    fraud_count: int
    normal_count: int
    fraud_percentage: float
    total_transactions: int
    report_data: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Report(ReportBase):
    id: Optional[str] = Field(default=None, alias="_id")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

    @classmethod
    def from_mongo(cls, data: dict):
        if data:
            data["id"] = str(data.get("_id"))
        return cls(**data)
