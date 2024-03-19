from flask import Flask, render_template, request, jsonify, redirect, url_for
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient('localhost', 27017, username='admin', password='password')

db = client.flashcards_db
flashcards = db.flashcards


@app.route("/", methods=['GET', 'POST'])
def home():
    if request.method == 'GET':
        questions = list(flashcards.find({}, {"_id": 0, "question": 1, "answer": 1}))
        return render_template('index.html', questions=questions)
    elif request.method == 'POST':
        questions = list(flashcards.find({}, {"_id": 0, "question": 1, "answer": 1}))
        return jsonify({"questions": questions})


@app.route('/add_question', methods=['POST'])
def add_question():
    if request.method == 'POST':
        question = request.form['question']
        answer = request.form['answer']
        flashcards.insert_one({'question': question, 'answer': answer})
        return redirect(url_for('home'))


if __name__ == '__main__':
    app.run(debug=True)
