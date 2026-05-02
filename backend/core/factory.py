import os
from core.providers.watsonx_provider import WatsonxAIProvider
from core.providers.groq_api import GroqProvider
from core.providers.ollama_api import OllamaProvider

def get_provider(requested_provider: str = None):
    # Use the requested provider if provided, otherwise fall back to .env
    provider_type = (requested_provider or os.environ.get("AI_PROVIDER", "watsonx")).lower()
    
    if provider_type == "watsonx":
        return WatsonxAIProvider()
    elif provider_type == "groq":
        return GroqProvider()
    elif provider_type == "ollama":
        return OllamaProvider()
    else:
        raise ValueError(f"Unsupported provider: {provider_type}")