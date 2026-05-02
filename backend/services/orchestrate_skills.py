import os
import httpx
import logging
from typing import Dict, Any
from core.models.triage import TriageResponse

logger = logging.getLogger("Orchestra8000.Skills")

class OrchestrateService:
    def __init__(self):
        self.api_key = os.environ.get("WATSONX_ORCHESTRATE_API_KEY")
        self.base_url = os.environ.get("WATSONX_ORCHESTRATE_URL", "https://api.ibm.com/orchestrate")
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

    async def trigger_skill(self, skill_id: str, payload: Dict[str, Any]):
        """Executes a specific enterprise skill in watsonx Orchestrate."""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/v1/skills/{skill_id}/execute",
                    headers=self.headers,
                    json=payload
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                logger.error(f"Orchestrate Skill Error: {e.response.text}")
                return None

    async def run_enterprise_workflow(self, triage: TriageResponse):
        """Automatically determines which skills to trigger based on triage data."""
        
        # Scenario A: Critical hardware failure triggers a Jira ticket
        if triage.severity == "critical":
            logger.info(f"Triggering Critical Repair Skill for {triage.workstation_id}")
            await self.trigger_skill("jira_create_incident", {
                "summary": f"CRITICAL: {triage.issue_summary}",
                "description": f"Agentic Plan: {triage.reasoning_plan}",
                "labels": ["Orchestra8000", "Automated"]
            })

        # Scenario B: Notify the team via Slack for any High severity issues
        if triage.severity in ["high", "critical"]:
            logger.info("Sending Slack alert via watsonx Orchestrate")
            await self.trigger_skill("slack_send_message", {
                "channel": "#it-triage",
                "text": f"*Alert:* {triage.severity.upper()} severity issue on {triage.workstation_id}.\n"
                        f"Details: {triage.issue_summary}"
            })

        return {"status": "Workflows Triggered", "severity": triage.severity}