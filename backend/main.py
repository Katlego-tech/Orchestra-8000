import os
from dotenv import load_dotenv # Add this import
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Load environment variables IMMEDIATELY
load_dotenv() 

from core.models.triage import TriageRequest, TriageResponse
from core.factory import get_provider

# Global provider instance
active_provider = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize the active provider instrument
    global active_provider
    active_provider = get_provider()
    print(f"Orchestra 8000: {active_provider.provider_name} is tuned and ready.")
    yield
    # Shutdown: Clean up resources
    if active_provider:
        await active_provider.close()

app = FastAPI(title="Orchestra 8000 Gateway", lifespan=lifespan)

# Enable CORS for the React Frontend (Port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/triage", response_model=TriageResponse)
async def perform_triage(request: TriageRequest):
    if not active_provider:
        raise HTTPException(status_code=503, detail="Orchestra not ready")
    
    try:
        return await active_provider.process_request(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)