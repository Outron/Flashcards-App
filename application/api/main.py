from fastapi import FastAPI, Form, APIRouter
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from pydantic import BaseModel
from db_config import db, collection
import uvicorn

app = FastAPI()

api_router = APIRouter(prefix="/api")

origins = [
    "http://frontend-service:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Question(BaseModel):
    question: str
    answer: str


@api_router.get("/")
async def root():
    return JSONResponse(content={"message": "Flashcards API Alive!"})


@api_router.get("/questions")
async def get_questions():
    questions = list(collection.find({}, {"_id": 1, "question": 1, "answer": 1}))
    for question in questions:
        question["_id"] = str(question["_id"])
    return JSONResponse(content={"questions": questions})


@api_router.post("/add_question")
async def add_question(data: Question):
    result = collection.insert_one(data.dict())
    return JSONResponse(content={"inserted_id": str(result.inserted_id)})


@api_router.delete("/delete_question")
async def delete_question(question_id: str = Form(...)):
    collection.delete_one({'_id': ObjectId(question_id)})
    return JSONResponse(content={"status": "success"})


@api_router.get("/sets")
async def get_sets():
    sets = db.list_collection_names()
    return JSONResponse(content={"sets": sets})


@api_router.post("/change_set")
async def change_set(set_name: str = Form(...)):
    global collection
    collection = db[set_name]
    return JSONResponse(content={"current_set": set_name})


@api_router.post("/add_set")
async def add_set(set_name: str = Form(...)):
    db.create_collection(set_name)
    return JSONResponse(content={"status": "set_created", "set_name": set_name})


@api_router.delete("/delete_set")
async def delete_set(set_name: str = Form(...)):
    db.drop_collection(set_name)
    sets = db.list_collection_names()
    global collection
    if sets:
        default_set = sets[0]
    else:
        default_set = None
    collection = db[default_set] if default_set else None
    return JSONResponse(content={"status": "set_deleted", "current_set": default_set})


app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)