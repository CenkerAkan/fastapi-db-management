from sqlmodel import SQLModel, Field


class database_names(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(default=None)

class user(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(default=None)
    email: str = Field(default=None)

