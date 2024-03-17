from flask import Flask, render_template
from pymongo import MongoClient
import random

app = Flask(__name__)
client = MongoClient('localhost', 27017, username='admin', password='password')

db = client["flashcards_db"]
flashcards = db["flashcards"]


@app.route("/", methods=['GET'])
def home():
    questions = list(flashcards.find({}, {"_id": 0, "question": 1, "answer": 1}))
    question = random.choice(questions)
    return render_template('index.html', question=question['question'], answer=question['answer'])


if __name__ == '__main__':
    app.run(debug=True)
