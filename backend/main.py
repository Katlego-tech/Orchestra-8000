import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Load environment variables for credentials
load_dotenv()

from core.models.triage import TriageRequest, TriageResponse
from core.factory import get_provider

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Orchestra 8000: Conductor is taking the stage...")
    yield
    print("Orchestra 8000: Curtains closing.")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/triage", response_model=TriageResponse)
async def perform_triage(request: TriageRequest):
    try:
        provider = get_provider(request.provider)
        result = await provider.process_request(request)
        await provider.close() # Clean up the provider session
        return result
    except Exception as e:
        print(f"Orchestra Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)