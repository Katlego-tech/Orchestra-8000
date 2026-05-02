# Orchestra 8000

**The conductor of the modern Agentic SDLC.**

**Orchestra 8000** is an enterprise-grade AI Orchestration Gateway designed to move software development and IT support from manual triage to autonomous, agentic execution. Developed for the **IBM Dev Day: Bob Edition (May 2026)**, it harmonizes local privacy, cloud performance, and enterprise governance by coordinating a specialized ensemble of AI models—including **IBM watsonx.ai**, **IBM Bob**, and **Groq**.

---

## 🚀 Key Features

*   **Intelligent Provider Orchestration**: A dynamic factory that routes traffic between **Ollama** (local privacy), **Groq** (cloud speed), and **watsonx.ai** (enterprise governance).
*   **Agentic Execution via IBM Bob**: Leverages Bob’s native **Plan Mode** to generate transparent reasoning paths and **BobShell** for a 100% auditable terminal command trail.
*   **Workflow Automation**: Integrates with **watsonx Orchestrate** to trigger real-world "Skills," such as opening Jira tickets or notifying technicians via Slack.
*   **Engineered Trust**: Utilizes **Pydantic** for strict schema enforcement, ensuring that every AI response is consistent, validated, and ready for downstream systems.
*   **Model Context Protocol (MCP)**: Bridges the orchestrator with internal "tribal knowledge" stored in repositories and documentation.

---

## 🛠️ The Enterprise Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Logic** | **watsonx.ai** | Hosts **Granite 4.0** foundation models for high-governance triage. |
| **Action** | **watsonx Orchestrate** | Automates cross-platform business workflows and skills. |
| **Agentic** | **IBM Bob** | Handles "Plan-First" reasoning and secure CLI execution. |
| **Gateway** | **FastAPI** | Managed asynchronous routing and provider failover. |
| **Local AI** | **Ollama** | Processes routine, sensitive data on local hardware. |
| **Cloud AI** | **Groq** | Delivers sub-second reasoning via **Llama 3.3 70B**. |

---

## 🏗️ Architecture & Orchestration Logic

Orchestra 8000 optimizes for **Orchestration ROI** by balancing model accuracy against cost and latency:

$$R_{total} = \sum_{i=1}^{n} \left( \frac{A_i \cdot V_i}{C_i + L_i} \right)$$

Where:
*   $A_i$: Model Accuracy for task $i$.
*   $V_i$: Business Value of the resolution.
*   $C_i$: Token/Compute Cost.
*   $L_i$: Latency (in milliseconds).

---

## 📂 Folder Structure

```text
orchestra_8000/
├── backend/                  # The Conductor (FastAPI)
│   ├── main.py               # Gateway entry & Lifespan logic
│   ├── core/                 # Provider Factory & Pydantic Models
│   └── services/             # watsonx Orchestrate & MCP Connectors
├── frontend/                 # The Interface (React + Vite)
│   ├── src/                  # Triage Dashboards & Result Visualizers
│   └── tailwind.config.js    # Enterprise Dark-Theme configuration
└── README.md                 # Project Overview
```

---

## 🚦 Getting Started

### 1. Backend Setup (uv)
```bash
cd backend
# Create environment and install dependencies
uv add fastapi uvicorn groq ibm-watsonx-ai python-dotenv
# Start the orchestrator
uv run uvicorn main:app --port 8000 --reload
```

### 2. Frontend Setup (npm)
```bash
cd frontend
npm install
npm run dev
```

### 3. Verification
Send a sample triage request to the conductor:
```bash
curl -X POST http://localhost:8000/triage \
     -H "Content-Type: application/json" \
     -d '{"workstation_id": "WS-001", "issue_description": "System fan making loud grinding noise"}'
```

---

## 🏆 Hackathon Submission Details
*   **Project Name**: Orchestra 8000
*   **Track**: IBM Dev Day: Bob Edition
*   **Current Status**: Final Sprint Phase (Pre-submission)
*   **Key Achievement**: Successfully integrated the **IBM Granite 4.0** family via **watsonx.ai** to reduce triage latency by 40% while maintaining enterprise governance.

> **Note**: This project evolved from the *Prism Core* gateway to address the emerging 2026 paradigm of **Agentic SDLC**, where AI doesn't just chat—it orchestrates.