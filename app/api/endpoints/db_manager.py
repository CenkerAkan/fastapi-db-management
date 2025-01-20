from fastapi import APIRouter, HTTPException
from app.db.base import get_engine
from app.db.utils import delete_database
from pydantic import BaseModel
import os
from app.config import settings
from sqlalchemy import text, MetaData, Table
from sqlmodel import Field, Session, SQLModel, create_engine, select
from app.db import base

router = APIRouter()

class CreateDatabaseRequest(BaseModel):
    db_name: str


class DbTableRequest(BaseModel):
    db_name: str
    table_name: str
    
    
@router.post("/create/")
async def create_database(request: CreateDatabaseRequest):
    """Create a new SQLite database."""
    db_name = request.db_name
    db_path = os.path.join(settings.DB_PATH, f"{db_name}.db")
    if os.path.exists(db_path):
        raise HTTPException(status_code=400, detail="Database already exists.")

    # Initialize the database engine
    engine = get_engine(db_name)
     # Force the creation of the .db file by executing a valid SQL statement
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))  # Valid SQL statement to force database creation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error initializing database: {str(e)}")
    
    return {"message": f"Database '{db_name}' created successfully at {db_path}."}


@router.post("/fetch/")
async def fetch_table_data(request: DbTableRequest):
    """
    Fetch all rows from the specified table in the given database.
    """
    db_name = request.db_name
    table_name = request.table_name

    # Construct the database path
    db_path = os.path.join(settings.DB_PATH, f"{db_name}.db")

    # Check if the database exists
    if not os.path.exists(db_path):
        raise HTTPException(status_code=400, detail="Database not found.")

    # Get the database engine
    engine = get_engine(db_name)

    # Reflect table metadata
    metadata = MetaData()
    metadata.reflect(bind=engine)

    # Check if the table exists
    if table_name not in metadata.tables:
        raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found in database '{db_name}'.")

    # Query the table
    table = Table(table_name, metadata, autoload_with=engine)
    with Session(engine) as session:
        query = session.execute(table.select()).mappings().all()  # Fetch all rows as mappings
        results = [dict(row) for row in query]  # Convert rows to dictionaries

    return {"database": db_name, "table": table_name, "data": results}
        

@router.delete("/delete/")
async def delete_database_endpoint(db_name: str):
    """Delete a specified SQLite database."""
    if delete_database(db_name):
        return {"message": f"Database '{db_name}' deleted successfully."}
    raise HTTPException(status_code=404, detail="Database not found.")
