import subprocess

# Define the path to the SQLite database
db_path = r"C:\Users\User\Documents\GitHub\fastapi-db-management\app\db_files\users.db"

# Run the SQLite Web command to serve the database
def start_sqlite_web():
    try:
        subprocess.run(["sqlite_web", db_path], check=True)
    except Exception as e:
        print(f"Error starting SQLite Web: {e}")

if __name__ == "__main__":
    start_sqlite_web()
