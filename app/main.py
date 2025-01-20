from fastapi import FastAPI
from app.api import api_router
import os
app = FastAPI()

# Include routers from API
app.include_router(api_router)

@app.get("/")
def read_root():
    print("os.getcwd(): ", os.getcwd())
    return {"message": "Welcome to FastAPI with SQLite!"}
