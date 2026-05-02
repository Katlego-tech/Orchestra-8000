from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional

class SeverityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class TriageRequest(BaseModel):
    workstation_id: str = Field(..., example="WS-001")
    issue_description: str = Field(..., example="System fan making grinding noise")

class TriageResponse(BaseModel):
    workstation_id: str
    issue_summary: str
    severity: SeverityEnum
    provider_used: str
    reasoning_plan: Optional[str] = None # For IBM Bob Agentic Logic