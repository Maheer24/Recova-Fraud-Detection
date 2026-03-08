from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routers.prediction_router import router as prediction_router
from backend.app.routers.charts_router import router as chart_router

app = FastAPI(
    title="Fraudulent Transaction Detection"
)
app.include_router(prediction_router)
app.include_router(chart_router)

origins = ["http://localhost:5174"]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["http://localhost:5174"],
)

@app.get("/")
def root():
    return {"message": "Fraud detection API running."}
