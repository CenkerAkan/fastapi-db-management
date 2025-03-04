from fastapi import FastAPI
from pydantic import BaseModel
import os
import shutil
import asyncio
import redis
from fastapi import FastAPI, BackgroundTasks, Query
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware


#app = FastAPI()

WATCH_FOLDER = "./images"
DEST_FOLDER = "./old_images"
current_queue_name = "default_queue"

# Ensure destination folder exists
os.makedirs(DEST_FOLDER, exist_ok=True)

# Initialize Redis client
redis_client = redis.Redis(host="localhost", port=6379, decode_responses=True)

# Global variables to control the watcher
observer = None
stop_event = asyncio.Event()





# Define a data model for the POST request
class Item(BaseModel):
    name: str
    value: int


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        yield
    finally:
        if observer and observer.is_alive():
            stop_event.set()
            observer.stop()
            observer.join()
            print("Watcher stopped on shutdown.")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # important: I must replace "*" with specific frontend domains for security later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#app = FastAPI()



@app.get("/")
def home():
    return {"message": "Hello from FastAPI on Raspberry Pi!"}

@app.post("/items/")
def create_item(item: Item):
    return {"message": f"Received item: {item.name} with value {item.value}"}




def dummy_function(image_path: str) -> str:
    """Dummy function that returns a predefined image path."""
    return "./assets/default.jpg"

class FileWatcher(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory:  # Ignore directories
            file_name = os.path.basename(event.src_path)
            file_path = event.src_path
            print(f"Detected file: {file_name}")

            # Call dummy function to get second image path
            result_image_path = dummy_function(file_path)

            # Attempt to push structured data to Redis queue
            try:
                redis_entry = {
                    "image_1_path": file_path,
                    "image_2_path": result_image_path
                }
                redis_client.lpush(current_queue_name, str(redis_entry))  # Push to the selected Redis list (queue)
                print(f"Added to Redis queue {current_queue_name}: {redis_entry}")
                
                # Move file only after successful Redis operation
                dest_path = os.path.join(DEST_FOLDER, file_name)
                shutil.move(file_path, dest_path)
                print(f"Moved {file_name} to {DEST_FOLDER}")

            except Exception as e:
                print(f"Redis error: {e}")
                print(f"Skipping move for {file_name}")



async def watch_folder():
    global observer
    event_handler = FileWatcher()
    observer = Observer()
    observer.schedule(event_handler, WATCH_FOLDER, recursive=False)
    observer.start()
    print("Watcher started.")
    
    try:
        while not stop_event.is_set():
            await asyncio.sleep(1)  # Prevents high CPU usage
    finally:
        observer.stop()
        observer.join()
        print("Watcher stopped.")



@app.post("/start-watcher")
async def start_watcher(queue_name: str, background_tasks: BackgroundTasks):
    global current_queue_name
    
    if observer and observer.is_alive():
        return {"message": "Watcher is already running."}
    
    # Set the queue name and create if it doesn't exist
    current_queue_name = queue_name
    #redis_client.lpush(current_queue_name, "queue_initialized")  # Ensure queue exists
    
    stop_event.clear()
    background_tasks.add_task(watch_folder)
    return {"message": f"Watcher started with queue: {current_queue_name}"}


"""
@app.post("/stop-watcher")
async def stop_watcher():
    if observer and observer.is_alive():
        stop_event.set()
        return {"message": "Stopping watcher..."}
    return {"message": "Watcher is not running."}
"""

@app.post("/stop-watcher")
async def stop_watcher():
    if observer and observer.is_alive():
        stop_event.set()
        observer.stop()
        observer.join()
        return {"message": "Stopping watcher..."}
    return {"message": "Watcher is not running."}


@app.get("/redis-queue")
async def get_queue(queue_name: str = Query(None)):
    """Returns all items in a specified Redis queue without removing them."""
    target_queue = queue_name if queue_name else current_queue_name
    items = redis_client.lrange(target_queue, 0, -1)
    return {"queue": target_queue, "items": items}

@app.post("/process-next-file")
async def process_next_file(queue_name: str = Query(None)):
    """Retrieves the next file from the specified Redis queue and removes it."""
    target_queue = queue_name if queue_name else current_queue_name
    file_name = redis_client.rpop(target_queue)  # Remove from queue (FIFO)
    if file_name:
        return {"message": f"Processing file: {file_name}", "queue": target_queue}
    return {"message": "No files in queue", "queue": target_queue}




from fastapi.responses import JSONResponse

@app.get("/results")
async def get_results(queue_name: str, top_n: int):
    items = [redis_client.rpop(queue_name) for _ in range(top_n)]
    items = [item for item in items if item]  # Remove None values
    
    # Ensure a proper JSON response even if the queue is empty
    return JSONResponse(content={"queue": queue_name, "top_results": items or [], "message": "not empty"})

