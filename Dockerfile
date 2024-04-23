FROM python:3.12.2-slim
ADD . /flashcards
WORKDIR /flashcards
RUN pip install -r requirements.txt
EXPOSE 8000
ENTRYPOINT ["python", "main.py"]

