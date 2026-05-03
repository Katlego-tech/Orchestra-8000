# Orchestra 8000 - Triage Request Flow Sequence Diagram

```mermaid
sequenceDiagram
    participant Client as Client/Frontend
    participant API as FastAPI App
    participant Factory as ProviderFactory
    participant Provider as LLMProvider
    participant AI as AI Model (watsonx/Groq/Ollama)
    participant Orchestrate as OrchestrateService

    Client->>+API: POST /triage
    Note over Client,API: TriageRequest<br/>{workstation_id, issue_description, provider}

    API->>+Factory: get_provider(requested_provider)
    
    alt Provider is watsonx
        Factory->>Provider: WatsonxAIProvider()
    else Provider is groq
        Factory->>Provider: GroqProvider()
    else Provider is ollama
        Factory->>Provider: OllamaProvider()
    end
    
    Factory-->>-API: LLMProvider instance
    
    API->>+Provider: process_request(request)
    
    Provider->>Provider: Build prompt from request
    Note over Provider: Format issue description<br/>with system instructions
    
    Provider->>+AI: Send API request
    Note over Provider,AI: Async HTTP call with<br/>prompt and parameters
    
    AI->>AI: Process request
    Note over AI: Analyze issue<br/>Determine severity<br/>Generate summary
    
    AI-->>-Provider: AI Response
    
    Provider->>Provider: Parse response
    Note over Provider: Extract severity<br/>Extract summary<br/>Extract reasoning
    
    Provider-->>-API: TriageResponse
    Note over Provider,API: {workstation_id, issue_summary,<br/>severity, provider_used, reasoning_plan}
    
    API->>+Provider: close()
    Provider->>Provider: Cleanup connections
    Provider-->>-API: Connection closed
    
    opt High/Critical Severity
        API->>+Orchestrate: run_enterprise_workflow(triage)
        
        alt Severity is critical
            Orchestrate->>Orchestrate: trigger_skill("jira_create_incident")
            Note over Orchestrate: Create Jira ticket<br/>with issue details
        end
        
        alt Severity is high or critical
            Orchestrate->>Orchestrate: trigger_skill("slack_send_message")
            Note over Orchestrate: Send Slack alert<br/>to #it-triage channel
        end
        
        Orchestrate-->>-API: Workflow status
    end
    
    API-->>-Client: TriageResponse (JSON)
    Note over Client,API: 200 OK with triage results

    alt Error occurs
        Provider-->>API: Exception
        API-->>Client: 500 Internal Server Error
        Note over Client,API: {detail: error message}
    end
```

## Flow Description

### 1. Request Initiation
- Client sends POST request to `/triage` endpoint with workstation ID, issue description, and optional provider preference

### 2. Provider Selection
- Factory pattern determines which AI provider to use based on request or environment configuration
- Instantiates appropriate provider (WatsonxAI, Groq, or Ollama)

### 3. Request Processing
- Provider builds a formatted prompt from the issue description
- Sends async request to the AI model API
- AI model analyzes the issue and generates structured response

### 4. Response Parsing
- Provider extracts severity level, issue summary, and reasoning from AI response
- Constructs TriageResponse object with all relevant data

### 5. Connection Cleanup
- Provider closes any persistent connections or clients
- Ensures proper resource management

### 6. Enterprise Workflow (Conditional)
- For high/critical severity issues, triggers enterprise workflows
- Creates Jira tickets for critical issues
- Sends Slack notifications for high/critical issues

### 7. Response Return
- API returns structured TriageResponse to client
- Includes all triage details and metadata

### Error Handling
- Any exceptions during processing result in 500 error
- Error details are logged and returned to client