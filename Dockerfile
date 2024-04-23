FROM python:3.12.2-slim
ADD . /flashcards
WORKDIR /flashcards
RUN pip install -r requirements.txt


