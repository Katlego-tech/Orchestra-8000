import os
import json
from ibm_watsonx_ai import APIClient
from core.providers.base import LLMProvider
from core.models.triage import TriageRequest, TriageResponse, SeverityEnum

class WatsonxAIProvider(LLMProvider):
    def __init__(self):
        super().__init__()
        credentials = {
            "url": os.environ.get("WATSONX_URL", "https://us-south.ml.cloud.ibm.com"),
            "apikey": os.environ.get("WATSONX_API_KEY")
        }
        self.client = APIClient(credentials)
        self.project_id = os.environ.get("WATSONX_PROJECT_ID")
        self.model_id = "ibm/granite-4-0-8b-instruct"

    async def close(self):
        pass

    async def process_request(self, request: TriageRequest) -> TriageResponse:
        # Optimization for Enterprise Triage
        params = {
            "decoding_method": "greedy",
            "max_new_tokens": 300,
            "min_new_tokens": 1
        }
        
        prompt = (
            f"Triage this IT issue. Respond ONLY in JSON with keys 'summary' and 'severity' (low, medium, high, critical).\n"
            f"Workstation: {request.workstation_id}\n"
            f"Issue: {request.issue_description}"
        )
        
        response = self.client.foundation_models.generate_text(
            model_id=self.model_id,
            prompt=prompt,
            params=params,
            project_id=self.project_id
        )
        
        # In a production scenario, add robust JSON parsing logic here
        return TriageResponse(
            workstation_id=request.workstation_id,
            issue_summary=response.strip(),
            severity=SeverityEnum.medium,
            provider_used="IBM watsonx.ai (Granite 4.0)",
            reasoning_plan="Step 1: Check hardware logs. Step 2: Consult watsonx knowledge base."
        )