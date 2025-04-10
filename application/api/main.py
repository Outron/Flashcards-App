from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from pydantic import BaseModel
from db_config import db, collection
import uvicorn


app = FastAPI()
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


class Question(BaseModel):
    question: str
    answer: str


@app.get("/")
async def root():
    return JSONResponse(content={"message": "Flashcards API Alive!"})


@app.get("/questions")
async def get_questions():
    questions = list(collection.find({}, {"_id": 1, "question": 1, "answer": 1}))
    for question in questions:
        question["_id"] = str(question["_id"])
    return JSONResponse(content={"questions": questions})


@app.post("/add_question")
async def add_question(data: Question):
    result = collection.insert_one(data.dict())
    return JSONResponse(content={"inserted_id": str(result.inserted_id)})


@app.delete("/delete_question")
async def delete_question(question_id: str = Form(...)):
    collection.delete_one({'_id': ObjectId(question_id)})
    return JSONResponse(content={"status": "success"})


@app.get("/sets")
async def get_sets():
    sets = db.list_collection_names()
    return JSONResponse(content={"sets": sets})


@app.post("/change_set")
async def change_set(set_name: str = Form(...)):
    global collection
    collection = db[set_name]
    return JSONResponse(content={"current_set": set_name})


@app.post("/add_set")
async def add_set(set_name: str = Form(...)):
    db.create_collection(set_name)
    return JSONResponse(content={"status": "set_created", "set_name": set_name})


@app.delete("/delete_set")
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


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
