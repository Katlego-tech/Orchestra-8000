from pydantic import BaseModel
from typing import Optional
from enum import Enum

class SeverityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class TriageRequest(BaseModel):
    workstation_id: str
    issue_description: str
    provider: Optional[str] = "watsonx" # Default instrument

class TriageResponse(BaseModel):
    workstation_id: str
    issue_summary: str
    severity: SeverityEnum
    provider_used: str
    reasoning_plan: Optional[str] = None