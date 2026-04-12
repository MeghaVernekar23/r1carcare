from fastapi import APIRouter

health_router = APIRouter(prefix="/health", tags=["Health"])


@health_router.get("/", description="Check if the API is running.")
def health_check():
    return {"status": "ok", "service": "R1 Car Care API"}
