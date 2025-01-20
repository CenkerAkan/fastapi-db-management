from fastapi import APIRouter
from app.api.endpoints import db_manager

api_router = APIRouter()
api_router.include_router(db_manager.router, prefix="/db", tags=["Database Management"])