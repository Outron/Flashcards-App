FROM python:3.12.2-slim
ADD ./application /flashcards
WORKDIR /flashcards
RUN pip install -r requirements.txt
CMD docpython main.py
