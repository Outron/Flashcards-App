from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_HOST = os.getenv("MONGO_HOST", "mongo-service.dev.svc.cluster.local")
MONGO_USER = os.getenv("MONGO_USER", "admin")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD", "password")
MONGO_AUTH_SOURCE = os.getenv("MONGO_AUTH_SOURCE", "admin")

client = MongoClient(
    host=MONGO_HOST,
    port=27017,
    username=MONGO_USER,
    password=MONGO_PASSWORD,
    authSource=MONGO_AUTH_SOURCE
)

db = client.flashcards_db
collection = db.flashcards