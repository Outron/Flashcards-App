import pytest
from httpx import AsyncClient
question_id = None


@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(base_url="http://127.0.0.1:8000") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "API Alive"}


@pytest.mark.asyncio
async def test_get_questions():
    async with AsyncClient(base_url="http://127.0.0.1:8000") as ac:
        response = await ac.get("/questions")
    assert response.status_code == 200
    assert "questions" in response.json()


@pytest.mark.asyncio
async def test_add_question():
    global question_id
    question_data = {"question": "What is Python?", "answer": "A programming language"}
    async with AsyncClient(base_url="http://127.0.0.1:8000") as ac:
        response = await ac.post("/add_question", json=question_data)
    assert response.status_code == 200
    question_id = response.json()["inserted_id"]
    assert "inserted_id" in response.json()


@pytest.mark.asyncio
async def test_delete_question():
    global question_id
    assert question_id is not None, "Brak ID pytania do usunięcia"  # Upewnij się, że ID istnieje
    async with AsyncClient(base_url="http://127.0.0.1:8000") as ac:
        delete_response = await ac.request("DELETE", "/delete_question", data={"question_id": question_id})
    assert delete_response.status_code == 200
    assert delete_response.json() == {"status": "success"}


@pytest.mark.asyncio
async def test_get_sets():
    async with AsyncClient(base_url="http://127.0.0.1:8000") as ac:
        response = await ac.get("/sets")
    assert response.status_code == 200
    assert "sets" in response.json()


@pytest.mark.asyncio
async def test_add_set():
    set_name = "test_set"
    async with AsyncClient(base_url="http://127.0.0.1:8000") as ac:
        response = await ac.post("/add_set", data={"set_name": set_name})
    assert response.status_code == 200
    assert response.json() == {"status": "set_created", "set_name": set_name}


@pytest.mark.asyncio
async def test_change_set():
    set_name = "test_set"
    async with AsyncClient(base_url="http://127.0.0.1:8000") as ac:
        response = await ac.post("/change_set", data={"set_name": set_name})
    assert response.status_code == 200
    assert response.json() == {"current_set": set_name}


@pytest.mark.asyncio
async def test_delete_set():
    set_name = "test_set"
    async with AsyncClient(base_url="http://127.0.0.1:8000") as ac:
        response = await ac.request("DELETE", "/delete_set", data={"set_name": set_name})
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["status"] == "set_deleted"
    assert "current_set" in response_data

