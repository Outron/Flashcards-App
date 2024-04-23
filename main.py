from bson import ObjectId
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from pymongo import MongoClient
import os

app = Flask(__name__)
client = MongoClient("mongodb://flashcards-server:5lYtc7GKitIaokdIlxSG8WNtgMKxQAbdzOGQXCjGssJHGMkry4GDuTV0HvNz26EM9hMzrg6lYoUDACDb77v0jQ==@flashcards-server.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@flashcards-server@")
db = client.flashcards_db
flashcards = db.flashcards
app.secret_key = 'super secret key'


@app.route("/", methods=['GET', 'POST'])
def home():
    if request.method == 'GET':
        questions = list(flashcards.find({}, {"_id": 1, "question": 1, "answer": 1}))
        sets = db.list_collection_names()
        return render_template('index.html', questions=questions, sets=sets)
    elif request.method == 'POST':
        questions = list(flashcards.find({}, {"_id": 0, "question": 1, "answer": 1}))
        return jsonify({"questions": questions})


@app.route('/add_question', methods=['POST'])
def add_question():
    if request.method == 'POST':
        question = request.form['question']
        answer = request.form['answer']
        result = flashcards.insert_one({'question': question, 'answer': answer})
        session['last_inserted_id'] = str(result.inserted_id)
        return redirect(url_for('home'))
    else:
        return 'Invalid request', 400


@app.route('/delete_question', methods=['POST'])
def delete_question():
    if 'question_id' in request.form:
        question_id = request.form['question_id']
        flashcards.delete_one({'_id': ObjectId(question_id)})
        return redirect(url_for('home'))
    else:
        return 'Invalid request', 400


@app.route('/change_set', methods=['POST'])
def change_set():
    if 'set_name' in request.form:
        set_name = request.form['set_name']
        session['set_name'] = request.form['set_name']
        global flashcards
        flashcards = db[set_name]
        return redirect(url_for('home'))
    else:
        return 'Invalid request', 400


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)
