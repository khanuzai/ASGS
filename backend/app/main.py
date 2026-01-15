from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import init_db
from .routers import models, simulate, assessments

app = FastAPI(
    title="Attack Surface Growth Simulator API",
    description="API for modeling cybersecurity risk growth as system complexity increases",
    version="1.0.0"
)

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

# Mount routers
app.include_router(models.router)
app.include_router(simulate.router)
app.include_router(assessments.router)

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Attack Surface Growth Simulator API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}