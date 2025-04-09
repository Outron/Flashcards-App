from fastapi import FastAPI, Request, Form
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from pymongo import MongoClient
from bson import ObjectId
from pydantic import BaseModel
import uvicorn

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="super secret key")

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient('localhost', 27017, username='admin', password='password', authSource='admin')
db = client.flashcards_db
flashcards = db.flashcards


class Question(BaseModel):
    question: str
    answer: str


@app.get("/")
async def root():
    return JSONResponse(content={"message": "Flashcards API Alive!"})


@app.get("/questions")
async def get_questions():
    questions = list(flashcards.find({}, {"_id": 1, "question": 1, "answer": 1}))
    for question in questions:
        question["_id"] = str(question["_id"])
    return JSONResponse(content={"questions": questions})


@app.post("/add_question")
async def add_question(data: Question):
    result = flashcards.insert_one(data.dict())
    return JSONResponse(content={"inserted_id": str(result.inserted_id)})


@app.delete("/delete_question")
async def delete_question(question_id: str = Form(...)):
    flashcards.delete_one({'_id': ObjectId(question_id)})
    return JSONResponse(content={"status": "success"})


@app.get("/sets")
async def get_sets():
    sets = db.list_collection_names()
    return JSONResponse(content={"sets": sets})


@app.post("/change_set")
async def change_set(set_name: str = Form(...)):
    global flashcards
    flashcards = db[set_name]
    return JSONResponse(content={"current_set": set_name})


@app.post("/add_set")
async def add_set(set_name: str = Form(...)):
    db.create_collection(set_name)
    return JSONResponse(content={"status": "set_created", "set_name": set_name})


@app.post("/delete_set")
async def delete_set(set_name: str = Form(...)):
    db.drop_collection(set_name)
    sets = db.list_collection_names()
    global flashcards
    if sets:
        default_set = sets[0]
    else:
        default_set = None
    flashcards = db[default_set] if default_set else None
    return JSONResponse(content={"status": "set_deleted", "current_set": default_set})


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
