from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select
import os
from app.config import settings
from app.models import Models

connect_args = {"check_same_thread": False}

sqlite_db_name = "database"
db_path = os.path.join(settings.DB_PATH, f"{sqlite_db_name}.db")
sqlite_url = f"sqlite:///{db_path}"
connect_args = {"check_same_thread": False}
database = create_engine(sqlite_url, connect_args=connect_args)

sqlite_users_name = "users"
db_path = os.path.join(settings.DB_PATH, f"{sqlite_users_name}.db")
sqlite_url = f"sqlite:///{db_path}"
connect_args = {"check_same_thread": False}
users = create_engine(sqlite_url, connect_args=connect_args)   


Models.database_names.__table__.create(database, checkfirst=True)
Models.user.__table__.create(users, checkfirst=True)

"""
with Session(database) as session:
    session.add(Models.database_names(name="abc"))
    session.commit()

with Session(users) as session:
    session.add(Models.user(name="xyz", email="example@example.com")) 
    session.commit()
"""

engine_registry = {
    "database": database,
    "users": users
}

def get_engine(db_name: str):
    """Get or create an engine for a given database name."""
    global engine_registry
    db_path = os.path.join(settings.DB_PATH, f"{db_name}.db")
    print("db_path: ", db_path)
    if db_name not in engine_registry:
        print("not in engine registry")
        sqlite_url = f"sqlite:///{db_path}"
        engine_registry[db_name] = create_engine(sqlite_url, connect_args=connect_args)
    return engine_registry[db_name]

def get_session(engine):
    """Create a session for a given engine."""
    return Session(engine)