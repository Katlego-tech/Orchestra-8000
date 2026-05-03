# Orchestra 8000 - Deployment Diagram

```mermaid
graph TB
    subgraph "Client Devices"
        Browser[Web Browser<br/>Chrome/Firefox/Safari]
    end

    subgraph "Frontend Server"
        WebServer[Web Server<br/>Nginx/Apache]
        StaticFiles[Static Files<br/>HTML/CSS/JS]
        WebServer --> StaticFiles
    end

    subgraph "Backend Server"
        subgraph "Application Container"
            FastAPI[FastAPI Application<br/>Port 8000]
            Uvicorn[Uvicorn ASGI Server]
            FastAPI --> Uvicorn
        end
        
        subgraph "Environment"
            EnvVars[Environment Variables<br/>.env file]
            Secrets[API Keys & Credentials]
            EnvVars --> Secrets
        end
        
        FastAPI --> EnvVars
    end

    subgraph "IBM Cloud"
        WatsonxService[IBM watsonx.ai<br/>API Endpoint]
        WatsonxAuth[IAM Authentication]
        WatsonxService --> WatsonxAuth
    end

    subgraph "Groq Cloud"
        GroqService[Groq API<br/>LPU Inference]
        GroqAuth[API Key Auth]
        GroqService --> GroqAuth
    end

    subgraph "Local Infrastructure"
        OllamaServer[Ollama Server<br/>localhost:11434]
        LocalModels[Local AI Models<br/>llama2, mistral, etc.]
        OllamaServer --> LocalModels
    end

    subgraph "Enterprise Tools"
        JiraCloud[Atlassian Jira<br/>Cloud Instance]
        SlackAPI[Slack Workspace<br/>API Endpoint]
    end

    subgraph "Monitoring & Logging"
        Logs[Application Logs<br/>stdout/stderr]
        Metrics[Performance Metrics]
    end

    %% Connections
    Browser -->|HTTPS| WebServer
    Browser -->|HTTPS/HTTP| FastAPI
    
    FastAPI -->|HTTPS| WatsonxService
    FastAPI -->|HTTPS| GroqService
    FastAPI -->|HTTP| OllamaServer
    
    FastAPI -->|HTTPS| JiraCloud
    FastAPI -->|HTTPS| SlackAPI
    
    FastAPI --> Logs
    FastAPI --> Metrics

    %% Styling
    classDef client fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef frontend fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef cloud fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    classDef local fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    classDef enterprise fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef monitoring fill:#e0f2f1,stroke:#00695c,stroke-width:2px

    class Browser client
    class WebServer,StaticFiles frontend
    class FastAPI,Uvicorn,EnvVars,Secrets backend
    class WatsonxService,WatsonxAuth,GroqService,GroqAuth cloud
    class OllamaServer,LocalModels local
    class JiraCloud,SlackAPI enterprise
    class Logs,Metrics monitoring
```

## Deployment Architecture

### Client Layer
- **Web Browser**: User interface accessed via modern web browsers
- **HTTPS Connection**: Secure communication with frontend and backend

### Frontend Deployment
- **Web Server**: Static file server (Nginx/Apache) hosting HTML/CSS/JS
- **Static Files**: Frontend application files served to clients
- **CDN (Optional)**: Content delivery network for global distribution

### Backend Deployment
- **FastAPI Application**: Python-based REST API server
- **Uvicorn ASGI Server**: High-performance async server running on port 8000
- **Environment Variables**: Secure configuration management via .env file
- **Container (Optional)**: Docker container for consistent deployment

### Cloud AI Services
- **IBM watsonx.ai**: Enterprise AI service with IAM authentication
- **Groq Cloud**: Ultra-fast LPU inference service with API key authentication
- **HTTPS Communication**: Secure API calls to cloud providers

### Local Infrastructure
- **Ollama Server**: Self-hosted AI model server on localhost:11434
- **Local Models**: Downloaded AI models (llama2, mistral, etc.)
- **HTTP Communication**: Local network communication

### Enterprise Integration
- **Jira Cloud**: Issue tracking and incident management system
- **Slack API**: Team communication and alerting platform
- **Webhook Support**: Real-time notifications and updates

### Monitoring & Operations
- **Application Logs**: stdout/stderr logging for debugging
- **Performance Metrics**: Request latency, error rates, throughput
- **Health Checks**: Endpoint monitoring and availability

## Deployment Options

### Option 1: Cloud Deployment
- Frontend: Vercel/Netlify/AWS S3 + CloudFront
- Backend: AWS EC2/ECS, Google Cloud Run, or Azure App Service
- Database: PostgreSQL on RDS/Cloud SQL (if needed)

### Option 2: On-Premises Deployment
- Frontend: Internal web server
- Backend: Internal application server
- Ollama: Local GPU server for AI inference
- Network: Internal corporate network with firewall rules

### Option 3: Hybrid Deployment
- Frontend: Cloud CDN for global access
- Backend: On-premises for data security
- AI Services: Mix of cloud (watsonx, Groq) and local (Ollama)

## Security Considerations
- API keys stored in environment variables, never in code
- HTTPS/TLS for all external communications
- CORS configuration for frontend access control
- Rate limiting on API endpoints
- Authentication/authorization for production deployments