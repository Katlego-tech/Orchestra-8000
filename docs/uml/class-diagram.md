# Orchestra 8000 - Class Diagram

```mermaid
classDiagram
    %% Core Models
    class SeverityEnum {
        <<enumeration>>
        +low
        +medium
        +high
        +critical
    }

    class TriageRequest {
        +str workstation_id
        +str issue_description
        +Optional~str~ provider
    }

    class TriageResponse {
        +str workstation_id
        +str issue_summary
        +SeverityEnum severity
        +str provider_used
        +Optional~str~ reasoning_plan
    }

    %% Abstract Base Provider
    class LLMProvider {
        <<abstract>>
        +str provider_name
        +__init__()
        +process_request(request: TriageRequest)* TriageResponse
        +close()*
    }

    %% Concrete Providers
    class WatsonxAIProvider {
        -str api_key
        -str project_id
        -str model_id
        -AsyncClient client
        +__init__()
        +process_request(request: TriageRequest) TriageResponse
        +close()
        -_build_prompt(request: TriageRequest) str
        -_parse_response(content: str) dict
    }

    class GroqProvider {
        -str api_key
        -str model
        -AsyncGroq client
        +__init__()
        +process_request(request: TriageRequest) TriageResponse
        +close()
    }

    class OllamaProvider {
        -str base_url
        -str model
        -AsyncClient client
        +__init__()
        +process_request(request: TriageRequest) TriageResponse
        +close()
    }

    %% Factory
    class ProviderFactory {
        <<factory>>
        +get_provider(requested_provider: str) LLMProvider
    }

    %% FastAPI Application
    class FastAPIApp {
        +FastAPI app
        +lifespan(app: FastAPI)
        +perform_triage(request: TriageRequest) TriageResponse
    }

    %% Orchestration Service
    class OrchestrateService {
        -str api_key
        -str base_url
        -dict headers
        +__init__()
        +trigger_skill(skill_id: str, payload: dict) dict
        +run_enterprise_workflow(triage: TriageResponse) dict
    }

    %% Relationships
    TriageRequest --> SeverityEnum : uses
    TriageResponse --> SeverityEnum : contains
    
    LLMProvider <|-- WatsonxAIProvider : implements
    LLMProvider <|-- GroqProvider : implements
    LLMProvider <|-- OllamaProvider : implements
    
    LLMProvider ..> TriageRequest : processes
    LLMProvider ..> TriageResponse : returns
    
    ProviderFactory ..> LLMProvider : creates
    ProviderFactory ..> WatsonxAIProvider : instantiates
    ProviderFactory ..> GroqProvider : instantiates
    ProviderFactory ..> OllamaProvider : instantiates
    
    FastAPIApp ..> TriageRequest : receives
    FastAPIApp ..> TriageResponse : returns
    FastAPIApp ..> ProviderFactory : uses
    FastAPIApp ..> LLMProvider : delegates to
    
    OrchestrateService ..> TriageResponse : processes
```

## Class Descriptions

### Core Models
- **SeverityEnum**: Enumeration defining issue severity levels (low, medium, high, critical)
- **TriageRequest**: Input model containing workstation ID, issue description, and optional provider selection
- **TriageResponse**: Output model with triage results including severity, summary, and reasoning

### Provider Architecture
- **LLMProvider**: Abstract base class defining the interface for all AI providers
- **WatsonxAIProvider**: IBM watsonx.ai implementation for enterprise-grade AI
- **GroqProvider**: Groq LPU implementation for ultra-fast inference
- **OllamaProvider**: Local Ollama implementation for privacy-focused deployments

### Factory Pattern
- **ProviderFactory**: Factory class that instantiates the appropriate provider based on configuration

### Application Layer
- **FastAPIApp**: Main application handling HTTP requests and orchestrating the triage process
- **OrchestrateService**: Service for triggering enterprise workflows based on triage results