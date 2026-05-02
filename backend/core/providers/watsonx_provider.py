import os
from ibm_watsonx_ai.foundation_models import ModelInference
from core.providers.base import LLMProvider
from core.models.triage import TriageRequest, TriageResponse, SeverityEnum

class WatsonxAIProvider(LLMProvider):
    def __init__(self):
        super().__init__()
        credentials = {
            "url": os.environ.get("WATSONX_URL", "https://us-south.ml.cloud.ibm.com"),
            "apikey": os.environ.get("WATSONX_API_KEY")
        }
        self.project_id = os.environ.get("WATSONX_PROJECT_ID")
        params = {"decoding_method": "greedy", "max_new_tokens": 400}
        
        self.model = ModelInference(
            model_id="ibm/granite-4-h-small",
            params=params,
            credentials=credentials,
            project_id=self.project_id
        )

    async def close(self):
        # Implementation of the abstract method
        pass

    async def process_request(self, request: TriageRequest) -> TriageResponse:
        prompt = (
            f"Analyze this IT issue: {request.issue_description}\n"
            f"Respond strictly in this format:\n"
            f"SUMMARY: [Concise description]\n"
            f"SEVERITY: [low, medium, high, or critical]\n"
            f"PLAN: [3-step technical fix]\n"
        )
        response_text = self.model.generate_text(prompt=prompt)
        return self._parse_response(response_text, request.workstation_id, "IBM watsonx.ai")

    def _parse_response(self, text, ws_id, p_name):
        summary, severity, plan = "N/A", SeverityEnum.medium, "No plan generated"
        for line in text.split('\n'):
            if "SUMMARY:" in line: summary = line.split("SUMMARY:")[1].strip()
            elif "SEVERITY:" in line:
                sev = line.split("SEVERITY:")[1].strip().lower()
                if "critical" in sev: severity = SeverityEnum.critical
                elif "high" in sev: severity = SeverityEnum.high
            elif "PLAN:" in line: plan = line.split("PLAN:")[1].strip()
        return TriageResponse(workstation_id=ws_id, issue_summary=summary, severity=severity, provider_used=p_name, reasoning_plan=plan)