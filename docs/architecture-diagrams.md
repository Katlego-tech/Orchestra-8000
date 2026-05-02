# Orchestra 8000 - Architecture Diagrams

This document contains detailed domain and sequence diagrams for the Orchestra 8000 Agentic SDLC Orchestrator.

---

## 1. Domain Diagram

The domain diagram shows the key entities, their attributes, relationships, and responsibilities within the Orchestra 8000 system.

```mermaid
classDiagram
    class FastAPIApplication {
        +port: 8000
        +lifespan_handler: AsyncContextManager
        +startup()
        +shutdown()
    }

    class TriageEndpoint {
        +path: /triage
        +method: POST
        +handle_request(TriageRequest): TriageResponse
    }

    class TriageRequest {
        +workstation_id: str
        +issue_description: str
        +priority: Optional~str~
        +metadata: Optional~dict~
        +validate()
    }

    class TriageResponse {
        +status: str
        +provider_used: str
        +reasoning_steps: List~str~
        +recommended_actions: List~str~
        +execution_plan: Optional~dict~
        +confidence_score: float
        +timestamp: datetime
        +validate()
    }

    class Conductor {
        +analyze_complexity(request): ComplexityScore
        +determine_provider(complexity, security): ProviderType
        +route_request(request, provider): Response
        +orchestrate_execution()
    }

    class ProviderFactory {
        <<abstract>>
        +create_provider(type): AIProvider
        +get_available_providers(): List~str~
    }

    class AIProvider {
        <<interface>>
        +name: str
        +model: str
        +is_available(): bool
        +generate_response(prompt): str
        +validate_output(response): bool
    }

    class OllamaProvider {
        +base_url: str
        +model: llama3.2
        +privacy_mode: true
        +max_tokens: int
        +temperature: float
        +connect()
        +generate_response(prompt): str
        +health_check(): bool
    }

    class GroqProvider {
        +api_key: str
        +model: llama-3.3-70b-versatile
        +async_client: AsyncGroq
        +rate_limit: int
        +connect()
        +generate_response(prompt): str
        +stream_response(prompt): AsyncIterator
    }

    class IBMBobAgent {
        +mode: PlanMode | GovernMode
        +mcp_client: MCPClient
        +bobshell: BobShell
        +execute_plan(steps): ExecutionResult
        +validate_actions(plan): bool
        +audit_log: List~Action~
    }

    class PlanMode {
        +generate_reasoning_steps(issue): List~str~
        +create_execution_plan(steps): Plan
        +transparency_level: high
    }

    class GovernMode {
        +validate_security(action): bool
        +enforce_policies(plan): bool
        +audit_trail: List~AuditEntry~
    }

    class BobShell {
        +execute_command(cmd): CommandResult
        +validate_command(cmd): bool
        +sandbox_mode: bool
        +audit_enabled: true
        +allowed_commands: List~str~
    }

    class MCPClient {
        +protocol_version: str
        +connected_tools: List~Tool~
        +connect_tool(name): Tool
        +execute_tool_action(tool, action): Result
    }

    class Tool {
        <<interface>>
        +name: str
        +capabilities: List~str~
        +execute(action): Result
    }

    class JiraTool {
        +api_endpoint: str
        +auth_token: str
        +create_ticket(data): Ticket
        +update_ticket(id, data): bool
        +query_tickets(filter): List~Ticket~
    }

    class SlackTool {
        +workspace_id: str
        +bot_token: str
        +send_message(channel, msg): bool
        +create_channel(name): Channel
    }

    class GitHubTool {
        +repo_url: str
        +access_token: str
        +create_issue(data): Issue
        +create_pr(data): PullRequest
        +run_workflow(name): WorkflowRun
    }

    class PydanticValidator {
        +schema_version: v2
        +validate_request(data): TriageRequest
        +validate_response(data): TriageResponse
        +strict_mode: true
    }

    class ConfigManager {
        +env_file: .env
        +ai_provider: str
        +groq_api_key: str
        +groq_model: str
        +load_config(): Config
        +validate_config(): bool
    }

    %% Relationships
    FastAPIApplication --> TriageEndpoint: exposes
    TriageEndpoint --> TriageRequest: receives
    TriageEndpoint --> TriageResponse: returns
    TriageEndpoint --> Conductor: delegates to
    
    Conductor --> ProviderFactory: uses
    ProviderFactory --> AIProvider: creates
    AIProvider <|-- OllamaProvider: implements
    AIProvider <|-- GroqProvider: implements
    
    Conductor --> IBMBobAgent: orchestrates
    IBMBobAgent --> PlanMode: uses
    IBMBobAgent --> GovernMode: uses
    IBMBobAgent --> BobShell: executes via
    IBMBobAgent --> MCPClient: integrates with
    
    MCPClient --> Tool: manages
    Tool <|-- JiraTool: implements
    Tool <|-- SlackTool: implements
    Tool <|-- GitHubTool: implements
    
    TriageRequest --> PydanticValidator: validated by
    TriageResponse --> PydanticValidator: validated by
    
    FastAPIApplication --> ConfigManager: configured by
    ProviderFactory --> ConfigManager: reads from
```

---

## 2. Sequence Diagram: Triage Request Flow

This diagram shows the complete flow of a triage request through the Orchestra 8000 system, from initial HTTP request to final response.

```mermaid
sequenceDiagram
    participant Client
    participant FastAPI as FastAPI App
    participant Endpoint as /triage Endpoint
    participant Validator as Pydantic Validator
    participant Conductor
    participant Factory as Provider Factory
    participant Provider as AI Provider
    participant Bob as IBM Bob Agent
    
    Client->>FastAPI: POST /triage
    activate FastAPI
    FastAPI->>Endpoint: route request
    activate Endpoint
    
    Endpoint->>Validator: validate_request(data)
    activate Validator
    Validator->>Validator: check schema compliance
    Validator->>Validator: validate field types
    Validator-->>Endpoint: TriageRequest object
    deactivate Validator
    
    Endpoint->>Conductor: handle_triage(request)
    activate Conductor
    
    Conductor->>Conductor: analyze_complexity(request)
    Note over Conductor: Evaluate issue complexity,<br/>security requirements,<br/>resource needs
    
    Conductor->>Factory: determine_provider(complexity)
    activate Factory
    Factory->>Factory: check provider availability
    Factory->>Factory: apply selection logic
    Factory-->>Conductor: selected_provider_type
    deactivate Factory
    
    Conductor->>Factory: create_provider(type)
    activate Factory
    
    alt Local Provider Selected
        Factory->>Provider: new OllamaProvider()
        Note over Provider: Privacy-focused,<br/>local execution
    else Cloud Provider Selected
        Factory->>Provider: new GroqProvider()
        Note over Provider: High-speed,<br/>cloud reasoning
    end
    
    Factory-->>Conductor: provider_instance
    deactivate Factory
    
    Conductor->>Provider: generate_response(prompt)
    activate Provider
    Provider->>Provider: format prompt
    Provider->>Provider: call AI model
    Provider-->>Conductor: raw_response
    deactivate Provider
    
    Conductor->>Conductor: parse_response(raw_response)
    
    alt Complex Issue Requiring Agentic Execution
        Conductor->>Bob: execute_plan(parsed_response)
        activate Bob
        Note over Bob: IBM Bob takes over<br/>for autonomous execution
        Bob-->>Conductor: execution_result
        deactivate Bob
    end
    
    Conductor->>Validator: validate_response(result)
    activate Validator
    Validator->>Validator: check schema compliance
    Validator->>Validator: validate required fields
    Validator-->>Conductor: TriageResponse object
    deactivate Validator
    
    Conductor-->>Endpoint: validated_response
    deactivate Conductor
    
    Endpoint-->>FastAPI: TriageResponse JSON
    deactivate Endpoint
    FastAPI-->>Client: HTTP 200 + JSON response
    deactivate FastAPI
```

---

## 3. Sequence Diagram: Provider Orchestration

This diagram details how the system dynamically selects and orchestrates between local Ollama and cloud Groq providers.

```mermaid
sequenceDiagram
    participant Conductor
    participant Config as Config Manager
    participant Factory as Provider Factory
    participant Ollama as Ollama Provider
    participant Groq as Groq Provider
    participant Health as Health Check
    
    Conductor->>Conductor: analyze_request_requirements()
    Note over Conductor: Complexity: medium<br/>Security: high<br/>Speed: normal
    
    Conductor->>Config: get_provider_preference()
    activate Config
    Config->>Config: read .env file
    Config-->>Conductor: AI_PROVIDER=groq
    deactivate Config
    
    Conductor->>Factory: create_provider(preferred_type)
    activate Factory
    
    Factory->>Health: check_provider_availability(groq)
    activate Health
    Health->>Groq: health_check()
    activate Groq
    
    alt Groq Available
        Groq-->>Health: status: healthy
        Health-->>Factory: available: true
        Factory->>Groq: initialize(api_key, model)
        Groq->>Groq: create async client
        Groq->>Groq: validate credentials
        Groq-->>Factory: provider_ready
        Factory-->>Conductor: GroqProvider instance
    else Groq Unavailable
        Groq-->>Health: status: error
        deactivate Groq
        Health-->>Factory: available: false
        deactivate Health
        
        Note over Factory: Fallback to local provider
        Factory->>Health: check_provider_availability(ollama)
        activate Health
        Health->>Ollama: health_check()
        activate Ollama
        Ollama-->>Health: status: healthy
        deactivate Ollama
        Health-->>Factory: available: true
        deactivate Health
        
        Factory->>Ollama: initialize(base_url, model)
        activate Ollama
        Ollama->>Ollama: connect to local instance
        Ollama->>Ollama: verify model availability
        Ollama-->>Factory: provider_ready
        deactivate Ollama
        Factory-->>Conductor: OllamaProvider instance
    end
    
    deactivate Factory
    
    Conductor->>Conductor: log_provider_selection()
    Note over Conductor: Provider: Groq<br/>Model: llama-3.3-70b<br/>Reason: cloud speed
```

---

## 4. Sequence Diagram: IBM Bob Agentic Execution

This diagram shows how IBM Bob executes autonomous plans using Plan Mode, BobShell, and MCP tool integrations.

```mermaid
sequenceDiagram
    participant Conductor
    participant Bob as IBM Bob Agent
    participant Plan as Plan Mode
    participant Govern as Govern Mode
    participant Shell as BobShell
    participant MCP as MCP Client
    participant Jira as Jira Tool
    participant GitHub as GitHub Tool
    participant Audit as Audit Logger
    
    Conductor->>Bob: execute_plan(issue_context)
    activate Bob
    
    Bob->>Plan: generate_reasoning_steps(issue)
    activate Plan
    Plan->>Plan: analyze issue description
    Plan->>Plan: identify required actions
    Plan->>Plan: create step-by-step plan
    Plan-->>Bob: reasoning_steps[]
    deactivate Plan
    
    Note over Bob: Steps:<br/>1. Create Jira ticket<br/>2. Clone repository<br/>3. Run diagnostics<br/>4. Create GitHub issue
    
    loop For each step in plan
        Bob->>Govern: validate_action(step)
        activate Govern
        Govern->>Govern: check security policies
        Govern->>Govern: verify permissions
        Govern->>Govern: assess risk level
        
        alt Action Approved
            Govern-->>Bob: validation: approved
            deactivate Govern
            
            alt Step requires MCP tool
                Bob->>MCP: execute_tool_action(tool_name, action)
                activate MCP
                
                alt Jira Action
                    MCP->>Jira: create_ticket(data)
                    activate Jira
                    Jira->>Jira: authenticate
                    Jira->>Jira: validate ticket data
                    Jira->>Jira: create ticket in project
                    Jira-->>MCP: ticket_id: PROJ-123
                    deactivate Jira
                else GitHub Action
                    MCP->>GitHub: create_issue(data)
                    activate GitHub
                    GitHub->>GitHub: authenticate
                    GitHub->>GitHub: validate issue data
                    GitHub->>GitHub: create issue in repo
                    GitHub-->>MCP: issue_number: 456
                    deactivate GitHub
                end
                
                MCP-->>Bob: tool_result
                deactivate MCP
                
            else Step requires shell command
                Bob->>Shell: execute_command(cmd)
                activate Shell
                Shell->>Shell: validate_command(cmd)
                Shell->>Shell: check allowed_commands list
                Shell->>Shell: run in sandbox mode
                Shell->>Shell: capture output
                Shell-->>Bob: command_result
                deactivate Shell
            end
            
            Bob->>Audit: log_action(step, result)
            activate Audit
            Audit->>Audit: record timestamp
            Audit->>Audit: store action details
            Audit->>Audit: save result status
            Audit-->>Bob: logged
            deactivate Audit
            
        else Action Denied
            Govern-->>Bob: validation: denied, reason
            deactivate Govern
            Bob->>Audit: log_denied_action(step, reason)
            activate Audit
            Audit-->>Bob: logged
            deactivate Audit
            Note over Bob: Skip step,<br/>continue with plan
        end
    end
    
    Bob->>Bob: compile_execution_results()
    Bob->>Audit: finalize_audit_trail()
    activate Audit
    Audit-->>Bob: audit_complete
    deactivate Audit
    
    Bob-->>Conductor: ExecutionResult with audit trail
    deactivate Bob
```

---

## 5. Sequence Diagram: Pydantic Validation Flow

This diagram shows how Pydantic v2 ensures strict validation of all requests and responses.

```mermaid
sequenceDiagram
    participant Endpoint as /triage Endpoint
    participant Validator as Pydantic Validator
    participant Schema as Pydantic Schema
    participant Request as TriageRequest Model
    participant Response as TriageResponse Model
    
    Note over Endpoint: Incoming JSON data
    
    Endpoint->>Validator: validate_request(raw_json)
    activate Validator
    
    Validator->>Schema: load TriageRequest schema
    activate Schema
    Schema-->>Validator: schema definition
    deactivate Schema
    
    Validator->>Request: parse_obj(raw_json)
    activate Request
    
    Request->>Request: validate workstation_id: str
    Request->>Request: validate issue_description: str
    Request->>Request: validate priority: Optional[str]
    Request->>Request: validate metadata: Optional[dict]
    
    alt Validation Success
        Request->>Request: apply field validators
        Request->>Request: run model validators
        Request-->>Validator: TriageRequest instance
        deactivate Request
        Validator-->>Endpoint: validated_request
    else Validation Error
        Request-->>Validator: ValidationError
        deactivate Request
        Validator->>Validator: format error details
        Validator-->>Endpoint: HTTP 422 + error details
    end
    
    deactivate Validator
    
    Note over Endpoint: After processing...
    
    Endpoint->>Validator: validate_response(result_dict)
    activate Validator
    
    Validator->>Schema: load TriageResponse schema
    activate Schema
    Schema-->>Validator: schema definition
    deactivate Schema
    
    Validator->>Response: parse_obj(result_dict)
    activate Response
    
    Response->>Response: validate status: str
    Response->>Response: validate provider_used: str
    Response->>Response: validate reasoning_steps: List[str]
    Response->>Response: validate recommended_actions: List[str]
    Response->>Response: validate confidence_score: float
    Response->>Response: validate timestamp: datetime
    
    alt Validation Success
        Response->>Response: ensure strict JSON output
        Response->>Response: apply response validators
        Response-->>Validator: TriageResponse instance
        deactivate Response
        Validator-->>Endpoint: validated_response
    else Validation Error
        Response-->>Validator: ValidationError
        deactivate Response
        Validator->>Validator: log internal error
        Validator-->>Endpoint: HTTP 500 + error
    end
    
    deactivate Validator
```

---

## 6. Component Interaction Overview

```mermaid
graph TB
    subgraph Client Layer
        A[HTTP Client]
    end
    
    subgraph API Layer
        B[FastAPI Application]
        C[/triage Endpoint]
        D[Pydantic Validator]
    end
    
    subgraph Orchestration Layer
        E[Conductor]
        F[Provider Factory]
        G[Config Manager]
    end
    
    subgraph Provider Layer
        H[Ollama Provider<br/>Local Privacy]
        I[Groq Provider<br/>Cloud Speed]
    end
    
    subgraph Agentic Layer
        J[IBM Bob Agent]
        K[Plan Mode]
        L[Govern Mode]
        M[BobShell]
    end
    
    subgraph Integration Layer
        N[MCP Client]
        O[Jira Tool]
        P[Slack Tool]
        Q[GitHub Tool]
    end
    
    A -->|POST /triage| B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    F --> H
    F --> I
    E --> J
    J --> K
    J --> L
    J --> M
    J --> N
    N --> O
    N --> P
    N --> Q
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style E fill:#ffe1f5
    style J fill:#e1ffe1
    style N fill:#f5e1ff
```

---

## Key Design Patterns

### 1. **Factory Pattern**
The `ProviderFactory` dynamically creates AI provider instances based on configuration and availability, enabling seamless switching between Ollama and Groq.

### 2. **Strategy Pattern**
Different AI providers implement the `AIProvider` interface, allowing the Conductor to work with any provider without knowing implementation details.

### 3. **Facade Pattern**
The `Conductor` acts as a facade, simplifying the complex orchestration of provider selection, request routing, and response validation.

### 4. **Observer Pattern**
The `Audit Logger` observes all actions performed by IBM Bob, creating a transparent audit trail for compliance and debugging.

### 5. **Adapter Pattern**
The `MCP Client` adapts various external tools (Jira, Slack, GitHub) to a unified interface for seamless integration.

---

## Data Flow Summary

1. **Request Ingress**: Client sends JSON to `/triage` endpoint
2. **Validation**: Pydantic validates request structure and types
3. **Orchestration**: Conductor analyzes complexity and selects provider
4. **Provider Execution**: Ollama or Groq generates AI response
5. **Agentic Processing**: IBM Bob executes multi-step plans if needed
6. **Tool Integration**: MCP connects to external systems (Jira, GitHub, Slack)
7. **Response Validation**: Pydantic ensures response schema compliance
8. **Response Delivery**: Validated JSON returned to client

---

## Security & Validation Layers

- **Input Validation**: Pydantic v2 strict mode on all requests
- **Command Validation**: BobShell whitelist for allowed commands
- **Action Governance**: Govern Mode validates all autonomous actions
- **Audit Trail**: Complete logging of all operations
- **Provider Isolation**: Local Ollama for sensitive data, Groq for speed

---

## Scalability Considerations

- **Async Architecture**: FastAPI with async/await for high concurrency
- **Provider Pooling**: Multiple provider instances for load distribution
- **Stateless Design**: Each request is independent for horizontal scaling
- **MCP Protocol**: Standardized tool integration for extensibility
- **Lifespan Management**: Proper resource cleanup on startup/shutdown