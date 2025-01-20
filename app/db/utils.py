import os

def delete_database(db_name: str):
    """Delete the SQLite database."""
    if os.path.exists(f"../db_files/{db_name}.db"):
        os.remove(f"{db_name}.db")
        return True
    return False