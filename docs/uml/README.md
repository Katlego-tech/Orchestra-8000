# Orchestra 8000 - UML Diagrams

This directory contains comprehensive UML diagrams documenting the Orchestra 8000 AI orchestration platform architecture, design, and workflows.

## 📊 Available Diagrams

### 1. [Class Diagram](./class-diagram.md)
**Purpose**: Shows the static structure of the system  
**Includes**:
- Core data models (TriageRequest, TriageResponse, SeverityEnum)
- Abstract provider interface (LLMProvider)
- Concrete provider implementations (WatsonxAI, Groq, Ollama)
- Factory pattern for provider instantiation
- FastAPI application structure
- Enterprise orchestration service

**Use When**: Understanding code structure, class relationships, and inheritance hierarchy

---

### 2. [Sequence Diagram - Triage Flow](./sequence-diagram-triage-flow.md)
**Purpose**: Illustrates the complete triage request processing flow  
**Includes**:
- Client request initiation
- Provider selection via factory pattern
- AI model interaction
- Response parsing and validation
- Connection cleanup
- Enterprise workflow triggers (Jira, Slack)
- Error handling paths

**Use When**: Understanding request flow, timing, and component interactions

---

### 3. [Component Diagram](./component-diagram.md)
**Purpose**: Shows high-level system components and their relationships  
**Includes**:
- Frontend layer (Web UI, Interactive Demo)
- API layer (FastAPI, CORS, Lifespan)
- Core business logic (Models, Factory, Providers)
- AI provider implementations
- External AI services
- Enterprise integration (Jira, Slack)
- Configuration management

**Use When**: Understanding system architecture, component boundaries, and dependencies

---

### 4. [Deployment Diagram](./deployment-diagram.md)
**Purpose**: Illustrates physical deployment architecture  
**Includes**:
- Client devices and browsers
- Frontend server deployment
- Backend server with containers
- Cloud AI services (IBM watsonx, Groq)
- Local infrastructure (Ollama)
- Enterprise tool integration
- Monitoring and logging infrastructure
- Deployment options (Cloud, On-Premises, Hybrid)

**Use When**: Planning deployment, infrastructure setup, or understanding production architecture

---

### 5. [Use Case Diagram](./use-case-diagram.md)
**Purpose**: Documents system functionality from user perspective  
**Includes**:
- Triage operations (submit, analyze, view results)
- Enterprise workflows (Jira tickets, Slack alerts)
- System management (configuration, monitoring, logs)
- Demo and testing capabilities
- Actor descriptions (End User, Admin, Developer)
- External system interactions

**Use When**: Understanding user requirements, system capabilities, and actor interactions

---

## 🎯 Diagram Usage Guide

### For Developers
- **Start with**: Class Diagram → Sequence Diagram
- **Purpose**: Understand code structure and request flow
- **Focus**: Implementation details, patterns, and interactions

### For System Architects
- **Start with**: Component Diagram → Deployment Diagram
- **Purpose**: Understand system architecture and deployment
- **Focus**: Component boundaries, scalability, and infrastructure

### For Product Managers
- **Start with**: Use Case Diagram → Sequence Diagram
- **Purpose**: Understand features and user workflows
- **Focus**: Capabilities, user interactions, and business value

### For DevOps Engineers
- **Start with**: Deployment Diagram → Component Diagram
- **Purpose**: Understand infrastructure and dependencies
- **Focus**: Deployment options, monitoring, and operations

---

## 🔧 Viewing the Diagrams

All diagrams are written in **Mermaid** syntax and can be viewed in:

1. **GitHub**: Automatically rendered in markdown files
2. **VS Code**: Install "Markdown Preview Mermaid Support" extension
3. **Mermaid Live Editor**: Copy diagram code to https://mermaid.live
4. **Documentation Sites**: Rendered in MkDocs, Docusaurus, etc.

---

## 📝 Diagram Maintenance

### When to Update Diagrams

- **Class Diagram**: When adding/modifying classes, interfaces, or relationships
- **Sequence Diagram**: When changing request flow or adding new interactions
- **Component Diagram**: When adding/removing components or changing dependencies
- **Deployment Diagram**: When changing infrastructure or deployment strategy
- **Use Case Diagram**: When adding features or modifying user workflows

### Update Process

1. Modify the relevant `.md` file in this directory
2. Validate Mermaid syntax using Mermaid Live Editor
3. Update the diagram description if needed
4. Commit changes with descriptive message
5. Notify team of significant architectural changes

---

## 🏗️ System Overview

Orchestra 8000 is an intelligent AI orchestration platform that:

- **Routes tasks** to optimal AI models (IBM watsonx, Groq, Ollama)
- **Analyzes issues** and determines severity levels
- **Triggers workflows** for critical issues (Jira, Slack)
- **Provides transparency** with full traceability
- **Optimizes costs** through intelligent provider selection

### Key Design Patterns

- **Factory Pattern**: Dynamic provider instantiation
- **Strategy Pattern**: Interchangeable AI providers
- **Abstract Base Class**: Common provider interface
- **Dependency Injection**: Configuration management
- **Async/Await**: Non-blocking I/O operations

### Technology Stack

- **Backend**: Python, FastAPI, Pydantic, httpx
- **Frontend**: HTML, CSS, JavaScript
- **AI Providers**: IBM watsonx.ai, Groq, Ollama
- **Enterprise Tools**: Jira API, Slack API
- **Deployment**: Docker, Uvicorn, ASGI

---

## 📚 Additional Resources

- [Architecture Diagrams](../architecture-diagrams.md)
- [Setup Guide](../../SETUP_GUIDE.md)
- [Frontend Documentation](../../frontend/README.md)
- [Backend README](../../backend/README.md)

---

## 👥 Team

- **Katlego Tlhapiso** - Team Lead & Software Engineer
- **Kimberley Bezuidenhout** - DevOps Engineer

---

## 📄 License

Copyright © 2026 Orchestra 8000. All rights reserved.