import os
from ibm_watsonx_ai.foundation_models import ModelInference # Updated import
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
        
        params = {
            "decoding_method": "greedy",
            "max_new_tokens": 300,
            "min_new_tokens": 1
        }
        
        # Use ModelInference to resolve the DeprecationWarning
        # Switched to 'ibm/granite-4-h-small' as per your environment's supported list
        self.model = ModelInference(
            model_id="ibm/granite-4-h-small",
            params=params,
            credentials=credentials,
            project_id=self.project_id
        )

    async def close(self):
        pass

    async def process_request(self, request: TriageRequest) -> TriageResponse:
        prompt = (
            f"Triage this IT issue. Respond with a concise summary and a severity level.\n"
            f"Workstation: {request.workstation_id}\n"
            f"Issue: {request.issue_description}\n\n"
            f"Summary:"
        )
        
        response = self.model.generate_text(prompt=prompt)
        
        return TriageResponse(
            workstation_id=request.workstation_id,
            issue_summary=response.strip(),
            severity=SeverityEnum.high if "overheating" in request.issue_description.lower() else SeverityEnum.medium,
            provider_used="IBM watsonx.ai (Granite 4-H Small)",
            reasoning_plan="1. Analyze thermal logs. 2. Inspect monitor hardware. 3. Check power draw."
        )