import os
from core.providers.watsonx_provider import WatsonxAIProvider
from core.providers.groq_api import GroqProvider

def get_provider():
    provider_type = os.environ.get("AI_PROVIDER", "watsonx").lower()
    
    if provider_type == "watsonx":
        return WatsonxAIProvider()
    elif provider_type == "groq":
        return GroqProvider()
    else:
        # Fallback logic could go here
        raise ValueError(f"Unsupported provider: {provider_type}")