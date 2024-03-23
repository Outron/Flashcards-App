import pytest
from main import app


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_home_page(client):
    rv = client.get('/')
    assert rv.status_code == 200


def test_add_and_delete_question(client):
    rv = client.post('/add_question', data=dict(
        question='Test Question',
        answer='Test Answer'
    ), follow_redirects=True)
    assert rv.status_code == 200

    with client.session_transaction() as sess:
        question_id = sess['last_inserted_id']

    rv = client.post('/delete_question', data=dict(
        question_id=question_id
    ), follow_redirects=True)
    assert rv.status_code == 200
