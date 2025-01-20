import os
from pydantic_settings  import BaseSettings

class Settings(BaseSettings):
    DB_PATH: str = os.path.join(os.getcwd(), "app", "db_files")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Create the directory if it doesn't exist
        os.makedirs(self.DB_PATH, exist_ok=True)

settings = Settings()
