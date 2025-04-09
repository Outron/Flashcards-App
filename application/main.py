from bson import ObjectId
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from pymongo import MongoClient


app = Flask(__name__)
client = MongoClient('localhost', 27017, username='admin', password='password', authSource='admin')
db = client.flashcards_db
flashcards = db.flashcards
app.secret_key = 'super secret key'


@app.route("/", methods=['GET', 'POST'])
def home():
    if request.method == 'GET':
        questions = list(flashcards.find({}, {"_id": 1, "question": 1, "answer": 1}))
        sets = db.list_collection_names()
        set_name = session.get('set_name', 'default')
        return render_template('index.html', questions=questions, sets=sets, set_name=set_name)
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

@app.route('/add_set', methods=['POST'])
def add_set():
    if 'set_name' in request.form:
        set_name = request.form['set_name']
        db.create_collection(set_name)
        return redirect(url_for('home'))
    else:
        return 'Invalid request', 400

@app.route('/delete_set', methods=['POST'])
def delete_set():
    if 'set_name' in request.form:
        set_name = request.form['set_name']
        db.drop_collection(set_name)

        sets = db.list_collection_names()
        if sets:
            default_set = sets[0]
        else:
            default_set = 'empty...'
        session['set_name'] = default_set
        global flashcards
        flashcards = db[default_set]

        return redirect(url_for('home'))
    else:
        return 'Invalid request', 400


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
