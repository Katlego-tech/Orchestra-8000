import os
import json
from groq import AsyncGroq
from core.providers.base import LLMProvider
from core.models.triage import TriageRequest, TriageResponse, SeverityEnum

class GroqProvider(LLMProvider):
    def __init__(self):
        super().__init__()
        self.client = AsyncGroq(api_key=os.environ.get("GROQ_API_KEY"))
        self.model = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")

    async def close(self):
        pass

    async def process_request(self, request: TriageRequest) -> TriageResponse:
        chat_completion = await self.client.chat.completions.create(
            messages=[
                {"role": "system", "content": "Return JSON: {'summary': str, 'severity': 'low'|'medium'|'high'|'critical'}"},
                {"role": "user", "content": request.issue_description}
            ],
            model=self.model,
            response_format={"type": "json_object"}
        )
        
        data = json.loads(chat_completion.choices[0].message.content)
        return TriageResponse(
            workstation_id=request.workstation_id,
            issue_summary=data.get("summary", ""),
            severity=SeverityEnum(data.get("severity", "low")),
            provider_used="Groq Cloud Acceleration"
        )