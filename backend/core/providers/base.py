from abc import ABC, abstractmethod
from core.models.triage import TriageRequest, TriageResponse

class LLMProvider(ABC):
    def __init__(self):
        self.provider_name = self.__class__.__name__

    @abstractmethod
    async def process_request(self, request: TriageRequest) -> TriageResponse:
        """Process the triage request and return a structured response."""
        pass

    @abstractmethod
    async def close(self):
        """Cleanup any persistent connections or clients."""
        pass