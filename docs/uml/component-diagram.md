# Orchestra 8000 - Component Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[Web UI<br/>HTML/CSS/JS]
        Demo[Interactive Triage Demo]
        UI --> Demo
    end

    subgraph "API Layer"
        FastAPI[FastAPI Application<br/>main.py]
        CORS[CORS Middleware]
        Lifespan[Lifespan Manager]
        FastAPI --> CORS
        FastAPI --> Lifespan
    end

    subgraph "Core Business Logic"
        Models[Pydantic Models<br/>triage.py]
        Factory[Provider Factory<br/>factory.py]
        
        subgraph "Provider Abstraction"
            Base[LLMProvider Base<br/>base.py]
        end
        
        Models --> Factory
        Factory --> Base
    end

    subgraph "AI Provider Implementations"
        Watsonx[WatsonxAI Provider<br/>watsonx_provider.py]
        Groq[Groq Provider<br/>groq_api.py]
        Ollama[Ollama Provider<br/>ollama_api.py]
        
        Base -.implements.-> Watsonx
        Base -.implements.-> Groq
        Base -.implements.-> Ollama
    end

    subgraph "External AI Services"
        WatsonxAPI[IBM watsonx.ai API]
        GroqAPI[Groq LPU API]
        OllamaAPI[Ollama Local API]
    end

    subgraph "Enterprise Integration"
        Orchestrate[Orchestrate Service<br/>orchestrate_skills.py]
        
        subgraph "Enterprise Tools"
            Jira[Jira API]
            Slack[Slack API]
        end
        
        Orchestrate --> Jira
        Orchestrate --> Slack
    end

    subgraph "Configuration"
        Env[Environment Variables<br/>.env]
        Config[Configuration Manager]
        Env --> Config
    end

    %% Connections
    UI -->|HTTP POST /triage| FastAPI
    FastAPI -->|Uses| Models
    FastAPI -->|Creates| Factory
    Factory -->|Instantiates| Watsonx
    Factory -->|Instantiates| Groq
    Factory -->|Instantiates| Ollama
    
    Watsonx -->|API Calls| WatsonxAPI
    Groq -->|API Calls| GroqAPI
    Ollama -->|API Calls| OllamaAPI
    
    FastAPI -->|Triggers| Orchestrate
    
    Config -->|Provides| FastAPI
    Config -->|Provides| Watsonx
    Config -->|Provides| Groq
    Config -->|Provides| Ollama
    Config -->|Provides| Orchestrate

    %% Styling
    classDef frontend fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    classDef api fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef core fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef provider fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    classDef external fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef enterprise fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    classDef config fill:#e0f2f1,stroke:#004d40,stroke-width:2px

    class UI,Demo frontend
    class FastAPI,CORS,Lifespan api
    class Models,Factory,Base core
    class Watsonx,Groq,Ollama provider
    class WatsonxAPI,GroqAPI,OllamaAPI external
    class Orchestrate,Jira,Slack enterprise
    class Env,Config config
```

## Component Descriptions

### Frontend Layer
- **Web UI**: HTML/CSS/JavaScript interface for user interaction
- **Interactive Triage Demo**: Live demonstration of triage functionality with priority selection

### API Layer
- **FastAPI Application**: Main REST API server handling HTTP requests
- **CORS Middleware**: Cross-Origin Resource Sharing configuration for frontend access
- **Lifespan Manager**: Application startup and shutdown lifecycle management

### Core Business Logic
- **Pydantic Models**: Data validation and serialization models (TriageRequest, TriageResponse, SeverityEnum)
- **Provider Factory**: Factory pattern implementation for dynamic provider instantiation
- **LLMProvider Base**: Abstract base class defining provider interface

### AI Provider Implementations
- **WatsonxAI Provider**: IBM watsonx.ai integration for enterprise-grade AI
- **Groq Provider**: Groq LPU integration for ultra-fast inference
- **Ollama Provider**: Local Ollama integration for privacy-focused deployments

### External AI Services
- **IBM watsonx.ai API**: Cloud-based enterprise AI service
- **Groq LPU API**: High-performance language processing unit API
- **Ollama Local API**: Self-hosted AI model API

### Enterprise Integration
- **Orchestrate Service**: Workflow automation and enterprise tool integration
- **Jira API**: Issue tracking and incident management
- **Slack API**: Team communication and alerting

### Configuration
- **Environment Variables**: Secure storage of API keys and configuration
- **Configuration Manager**: Centralized configuration access and validation

## Data Flow
1. User interacts with Web UI
2. Frontend sends HTTP POST to FastAPI
3. FastAPI validates request using Pydantic models
4. Factory creates appropriate AI provider
5. Provider communicates with external AI service
6. Response is parsed and validated
7. High/critical issues trigger enterprise workflows
8. Structured response returned to frontend