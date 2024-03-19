const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
});

document.getElementById('flashcard').addEventListener('click', function () {
    var question = document.getElementById('question');
    var answer = document.getElementById('answer');

    if (question.classList.contains('visible')) {
        question.classList.remove('visible');
        question.classList.add('hidden');
        answer.classList.remove('hidden');
        answer.classList.add('visible');
    }
    else {
        answer.classList.remove('visible');
        answer.classList.add('hidden');
        question.classList.remove('hidden');
        question.classList.add('visible');
    }
});

function toggleCard(transition) {
    var cardInner = document.querySelector('.card-inner');
    cardInner.style.transform = cardInner.style.transform === 'rotateY(180deg)' ? 'rotateY(0)' : 'rotateY(180deg)';
    if (transition === true) {
        cardInner.style.transition = 'transform 0.5s';
    }
    else {
        cardInner.style.transition = 'none';
    }
}



function toggleMenu() {
    var sideMenu = document.querySelector('.side-menu');
    sideMenu.style.left = sideMenu.style.left === '0px' ? '-290px' : '0px';
}

$(document).ready(function () {
    var currentIndex = 0;
    var questions = [];

    $.ajax({
        url: '/',
        type: 'POST',
        success: function (data) {
            questions = data.questions;
            showQuestion(currentIndex);
        },
        error: function (xhr, status, error) {
            console.error("Błąd pobierania danych o pytaniach:", error);
        }
    });

    function showQuestion(index) {
        var question = questions[index].question;
        var answer = questions[index].answer;
        // Pokaż pytanie
        $('#question').text(question);
        $('#answer').text(answer);

    }

    $('#button_prev').click(function () {
        currentIndex = (currentIndex - 1 + questions.length) % questions.length;
        // if transform is  rotateY(180deg) then toggle
        if (document.querySelector('.card-inner').style.transform === 'rotateY(180deg)') {

            toggleCard(false);
            showQuestion(currentIndex);
        }
        else {
            showQuestion(currentIndex);
        }

    });

    $('#button_next').click(function () {
        currentIndex = (currentIndex + 1) % questions.length;
        if (document.querySelector('.card-inner').style.transform === 'rotateY(180deg)') {
            toggleCard(false);
            showQuestion(currentIndex);
        }
        else {
            showQuestion(currentIndex);
        }

    });
});