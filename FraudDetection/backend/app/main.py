from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers.prediction_router import router as prediction_router
from .routers.charts_router import router as chart_router
from fastapi.responses import JSONResponse
from .services.blockchain_service import blockchain_service
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

app = FastAPI(
    title="Fraudulent Transaction Detection"
)
app.include_router(prediction_router)
app.include_router(chart_router)

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://recova.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=origins,
    expose_headers=[
        "X-Report-Id",
        "X-Report-Hash",
        "X-Blockchain-Status",
        "X-Blockchain-Tx-Hash",
        "X-Blockchain-Error",
    ],
)


@app.get("/")


def root():
    return {"message": "Fraud detection API running."}


@app.post("/anchor-report/{report_id}")
async def anchor_report(report_id: str, report_hash: str):
	result = blockchain_service.anchor_report(report_id, report_hash)
	if not result.get("success"):
		return JSONResponse(result, status_code=500)
	return result
