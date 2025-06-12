import pytest
from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from bson import ObjectId
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))


@pytest.fixture(autouse=True)
def mock_db(monkeypatch):
    mock_id = ObjectId("1" * 24)
    mock_collection = MagicMock()
    mock_collection.find.return_value = [
        {"_id": mock_id, "question": "Q", "answer": "A"}
    ]
    mock_collection.insert_one.return_value.inserted_id = mock_id
    mock_collection.delete_one.return_value.deleted_count = 1

    mock_db = MagicMock()
    mock_db.list_collection_names.return_value = ["set1", "set2"]
    mock_db.create_collection.return_value = None
    mock_db.drop_collection.return_value = None
    mock_db.__getitem__.return_value = mock_collection

    monkeypatch.setattr("application.api.main.db", mock_db)
    monkeypatch.setattr("application.api.main.DatabaseContext.get_collection", lambda self: mock_collection)
    yield


def test_root():
    from application.api.main import app
    with TestClient(app) as client:
        response = client.get("/api")
    assert response.status_code == 200
    assert response.json() == {"message": "Flashcards API Alive!"}


def test_get_questions():
    from application.api.main import app
    with TestClient(app) as client:
        response = client.get("/api/questions")
    assert response.status_code == 200
    assert "questions" in response.json()


def test_add_question():
    from application.api.main import app
    question_data = {"question": "What is Python?", "answer": "A programming language"}
    with TestClient(app) as client:
        response = client.post("/api/add_question", json=question_data)
    assert response.status_code == 200
    assert "inserted_id" in response.json()


def test_delete_question():
    from application.api.main import app
    mock_id = str(ObjectId("1" * 24))
    with TestClient(app) as client:
        response = client.request(
            "DELETE",
            "/api/delete_question",
            data=f"question_id={mock_id}",
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
    assert response.status_code == 200
    assert response.json() == {"status": "success"}


def test_get_sets():
    from application.api.main import app
    with TestClient(app) as client:
        response = client.get("/api/sets")
    assert response.status_code == 200
    assert "sets" in response.json()


def test_add_set():
    from application.api.main import app
    with TestClient(app) as client:
        response = client.post("/api/add_set", data={"set_name": "test_set"})
    assert response.status_code == 200
    assert response.json()["status"] == "set_created"


def test_change_set():
    from application.api.main import app
    with TestClient(app) as client:
        response = client.post("/api/change_set", data={"set_name": "set1"})
    assert response.status_code == 200
    assert response.json()["current_set"] == "set1"


def test_delete_set():
    from application.api.main import app
    with TestClient(app) as client:
        response = client.request(
            "DELETE",
            "/api/delete_set",
            data={"set_name": "set1"},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
    assert response.status_code == 200
    assert response.json()["status"] == "set_deleted"
