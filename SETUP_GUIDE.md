# Orchestra 8000 - Setup & Usage Guide

## 🎯 Overview
Orchestra 8000 is an enterprise AI orchestration platform that intelligently routes IT support requests to the most appropriate AI model (IBM watsonx.ai, Groq, or Ollama).

## 📋 Prerequisites

### Backend Requirements
- Python 3.11+
- uv (Python package manager)
- IBM Cloud API key with watsonx.ai access
- IBM watsonx.ai Project ID

### Frontend Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (or use Python's built-in server)

## 🚀 Quick Start

### Step 1: Configure API Keys

Your IBM watsonx.ai API key has been configured in `backend/.env`:
```env
WATSONX_API_KEY=HKseSwqbSJTEdl0izTBGP_zeh5AFxMIHNoBZeFyzv30R
```

**⚠️ IMPORTANT:** You still need to add your `WATSONX_PROJECT_ID`:

1. Log in to [IBM Cloud](https://cloud.ibm.com)
2. Navigate to your watsonx.ai project
3. Copy the Project ID from the project settings
4. Edit `backend/.env` and replace `your_watsonx_project_id` with your actual Project ID

### Step 2: Start the Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies (first time only)
uv sync

# Start the FastAPI server
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at: `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

### Step 3: Start the Frontend

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Option 1: Using Python's built-in server
python -m http.server 3000

# Option 2: Using Node.js http-server (if installed)
npx http-server -p 3000

# Option 3: Using VS Code Live Server extension
# Right-click on index.html and select "Open with Live Server"
```

The frontend will be available at: `http://localhost:3000`

### Step 4: Test the Integration

1. Open your browser to `http://localhost:3000`
2. Click the blue **+** button (Floating Action Button) in the bottom-right corner
3. Fill in the triage form:
   - **Workstation ID**: e.g., `WS-001`
   - **Issue Description**: e.g., `Computer won't boot, showing blue screen error`
   - **AI Provider**: Select `IBM watsonx.ai (Bob)`
4. Click **Analyze Issue**
5. View the AI-generated triage response with severity level and action plan

## 🔧 Configuration Options

### Backend Configuration (`backend/.env`)

```env
# Orchestration Settings
AI_PROVIDER=watsonx              # Default provider: watsonx, groq, or ollama
PORT=8000                        # Backend server port

# IBM watsonx.ai
WATSONX_API_KEY=your_api_key     # ✅ Already configured
WATSONX_PROJECT_ID=your_project_id  # ⚠️ NEEDS TO BE ADDED
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Groq (Optional - for faster inference)
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

# Ollama (Optional - for local/private deployment)
OLLAMA_BASE_URL=http://localhost:11434
```

### Frontend Configuration (`frontend/js/api.js`)

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:8000',  // Backend API URL
    TIMEOUT: 30000,                      // Request timeout (30s)
    RETRY_ATTEMPTS: 3,                   // Number of retry attempts
    RETRY_DELAY: 1000                    // Delay between retries (1s)
};
```

## 📊 API Endpoints

### POST /triage
Perform IT issue triage analysis

**Request Body:**
```json
{
  "workstation_id": "WS-001",
  "issue_description": "Computer won't boot, showing blue screen error",
  "provider": "watsonx"
}
```

**Response:**
```json
{
  "workstation_id": "WS-001",
  "issue_summary": "Hardware failure - potential RAM or disk issue",
  "severity": "high",
  "provider_used": "IBM watsonx.ai",
  "reasoning_plan": "1. Check RAM modules 2. Run disk diagnostics 3. Review system logs"
}
```

## 🎨 Features

### Frontend Features
- ✅ Real-time backend API integration
- ✅ Interactive triage request form
- ✅ Live execution logs and traceability
- ✅ Model selection (watsonx, Groq, Ollama)
- ✅ Severity-based color coding
- ✅ Harmonic AI assistant with insights
- ✅ Responsive design with IBM Carbon styling
- ✅ Error handling and retry logic
- ✅ Backend health monitoring

### Backend Features
- ✅ FastAPI REST API
- ✅ Multi-provider support (watsonx, Groq, Ollama)
- ✅ Automatic model routing
- ✅ CORS enabled for frontend access
- ✅ Structured response format
- ✅ Error handling and validation

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError` or import errors
```bash
# Solution: Reinstall dependencies
cd backend
uv sync --reinstall
```

**Problem:** `WATSONX_API_KEY not found`
```bash
# Solution: Check .env file exists and has correct format
cat backend/.env
```

**Problem:** `401 Unauthorized` from watsonx.ai
```bash
# Solution: Verify your API key and Project ID are correct
# Check IBM Cloud console for valid credentials
```

### Frontend Issues

**Problem:** "Backend API not responding"
```bash
# Solution: Ensure backend is running
cd backend
uv run uvicorn main:app --reload
```

**Problem:** CORS errors in browser console
```bash
# Solution: Backend already has CORS enabled
# Ensure you're accessing frontend via http://localhost (not file://)
```

**Problem:** Modal doesn't open
```bash
# Solution: Check browser console for JavaScript errors
# Ensure api.js is loaded before app.js in index.html
```

## 📁 Project Structure

```
Orchestra-8000/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── .env                    # Environment variables (API keys)
│   ├── .env.example           # Template for .env
│   ├── pyproject.toml         # Python dependencies
│   └── core/
│       ├── factory.py         # Provider factory
│       ├── models/
│       │   └── triage.py      # Request/Response models
│       └── providers/
│           ├── base.py        # Base provider class
│           ├── watsonx_provider.py
│           ├── groq_api.py
│           └── ollama_api.py
├── frontend/
│   ├── index.html             # Main dashboard
│   ├── login.html             # Login page
│   ├── css/
│   │   └── styles.css         # Main styles + modal styles
│   └── js/
│       ├── api.js             # API integration module ✨ NEW
│       ├── app.js             # Dashboard logic + triage handler ✨ UPDATED
│       └── login.js           # Login logic
├── apikey.json                # Your API key (can be deleted)
└── SETUP_GUIDE.md            # This file
```

## 🔐 Security Notes

1. **Never commit `.env` files** - They contain sensitive API keys
2. **Add to .gitignore:**
   ```
   backend/.env
   apikey.json
   apikey (1).json
   ```
3. **Rotate API keys** if accidentally exposed
4. **Use environment-specific configs** for production

## 🎓 Usage Examples

### Example 1: Basic Triage
```
Workstation ID: WS-001
Issue: Laptop won't connect to WiFi
Provider: IBM watsonx.ai (Bob)

Result:
- Severity: Medium
- Summary: Network connectivity issue
- Plan: 1. Check WiFi adapter 2. Update drivers 3. Reset network settings
```

### Example 2: Critical Issue
```
Workstation ID: SERVER-PROD-01
Issue: Database server crashed, all services down
Provider: Groq (Fast response needed)

Result:
- Severity: Critical
- Summary: Database service failure
- Plan: 1. Check logs 2. Restart service 3. Verify data integrity
```

## 📞 Support

- **Backend Issues:** Check `backend/README.md`
- **Frontend Issues:** Check `frontend/README.md`
- **API Documentation:** http://localhost:8000/docs (when backend is running)

## 🎉 Success Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads in browser
- [ ] Can open triage modal with + button
- [ ] Can submit triage request
- [ ] Receives response from backend
- [ ] Logs appear in terminal panel
- [ ] Harmonic assistant shows insights

---

**Made with ❤️ by Bob (IBM watsonx.ai)**