import httpx
import os
from core.providers.base import LLMProvider
from core.models.triage import TriageRequest, TriageResponse, SeverityEnum

class OllamaProvider(LLMProvider):
    def __init__(self):
        super().__init__()
        self.base_url = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")

    async def close(self):
        # Implementation of the abstract method
        pass

    async def process_request(self, request: TriageRequest) -> TriageResponse:
        prompt = (
            f"Analyze: {request.issue_description}\n"
            f"Respond strictly in this format:\n"
            f"SUMMARY: [Concise description]\n"
            f"SEVERITY: [low, medium, high, or critical]\n"
            f"PLAN: [3-step technical fix]\n"
        )
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.base_url}/api/generate", 
                json={"model": "llama3", "prompt": prompt, "stream": False}, 
                timeout=60.0
            )
            return self._parse_response(resp.json().get("response", ""), request.workstation_id, "Local Ollama")

    def _parse_response(self, text, ws_id, p_name):
        summary, severity, plan = "N/A", SeverityEnum.medium, "No plan"
        for line in text.split('\n'):
            if "SUMMARY:" in line: summary = line.split("SUMMARY:")[1].strip()
            elif "SEVERITY:" in line:
                sev = line.split("SEVERITY:")[1].strip().lower()
                if "critical" in sev: severity = SeverityEnum.critical
                elif "high" in sev: severity = SeverityEnum.high
            elif "PLAN:" in line: plan = line.split("PLAN:")[1].strip()
        return TriageResponse(workstation_id=ws_id, issue_summary=summary, severity=severity, provider_used=p_name, reasoning_plan=plan)