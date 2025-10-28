from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")


DB_NAME = os.getenv("DB_NAME", "flashcards_db")

try:
    client = MongoClient(MONGO_URI)
    print("INFO: connection succeed.")
except Exception as e:
    print(f"ERROR {e}")
    client = None

db = client[DB_NAME]
collection = db.flashcards