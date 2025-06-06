from fastapi import FastAPI, Form, APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional
from db_config import db

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

# Models
class Question(BaseModel):
    question: str
    answer: str

class DatabaseContext:
    def __init__(self):
        self._current_collection_name: Optional[str] = None

    @property
    def current_collection_name(self) -> Optional[str]:
        if not self._current_collection_name:
            collections = db.list_collection_names()
            self._current_collection_name = collections[0] if collections else None
        return self._current_collection_name

    @current_collection_name.setter
    def current_collection_name(self, name: str):
        self._current_collection_name = name

    def get_collection(self):
        if not self.current_collection_name:
            raise HTTPException(status_code=404, detail="No collection selected")
        return db[self.current_collection_name]

db_context = DatabaseContext()


def get_collection():
    return db_context.get_collection()

def get_db_context():
    return db_context


@api_router.get("/")
async def root():
    return JSONResponse(content={"message": "Flashcards API Alive!"})

@api_router.get("/questions")
async def get_questions(collection = Depends(get_collection)):
    questions = list(collection.find({}, {"_id": 1, "question": 1, "answer": 1}))
    for question in questions:
        question["_id"] = str(question["_id"])
    return JSONResponse(content={"questions": questions})

@api_router.post("/add_question")
async def add_question(data: Question, collection = Depends(get_collection)):
    result = collection.insert_one(data.model_dump())
    return JSONResponse(content={"inserted_id": str(result.inserted_id)})

@api_router.delete("/delete_question")
async def delete_question(
    question_id: str = Form(...),
    collection = Depends(get_collection)
):
    result = collection.delete_one({'_id': ObjectId(question_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Question not found")
    return JSONResponse(content={"status": "success"})

@api_router.get("/sets")
async def get_sets():
    sets = db.list_collection_names()
    return JSONResponse(content={"sets": sets})


@api_router.post("/change_set")
async def change_set(
    set_name: str = Form(..., embed=True),  # embed=True obsługuje również JSON
    db_context: DatabaseContext = Depends(get_db_context)
):
    if set_name not in db.list_collection_names():
        raise HTTPException(status_code=404, detail="Set not found")
    db_context.current_collection_name = set_name
    return JSONResponse(content={"current_set": set_name})

@api_router.post("/add_set")
async def add_set(
    set_name: str = Form(...),
    db_context: DatabaseContext = Depends(get_db_context)
):
    if set_name in db.list_collection_names():
        raise HTTPException(status_code=400, detail="Set already exists")
    db.create_collection(set_name)
    db_context.current_collection_name = set_name
    return JSONResponse(content={"status": "set_created", "set_name": set_name})

@api_router.delete("/delete_set")
async def delete_set(set_name: str = Form(...),db_context: DatabaseContext = Depends(get_db_context)):
    if set_name not in db.list_collection_names():
        raise HTTPException(status_code=404, detail="Set not found")

    db.drop_collection(set_name)
    sets = db.list_collection_names()

    if sets:
        db_context.current_collection_name = sets[0]
    else:
        db_context.current_collection_name = None

    return JSONResponse(content={
        "status": "set_deleted",
        "current_set": db_context.current_collection_name
    })

app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)