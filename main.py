from flask import Flask, render_template, url_for, redirect, request
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


@app.route('/toggle_answer')
def toggle_answer():
    # Pobierz parametr z adresu URL
    show_answer = request.args.get('show_answer')

    # Przekieruj na stronę główną z odpowiednim parametrem w adresie URL
    return redirect('/?show_answer=true' if show_answer != 'true' else '/')


if __name__ == '__main__':
    app.run(debug=True)

