const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const cardInner = document.querySelector('.card-inner');
const sideMenu = document.querySelector('.side-menu');

themeToggle.addEventListener('click', () => body.classList.toggle('dark-theme'));

function toggleCard(transition) {
    cardInner.style.transform = cardInner.style.transform === 'rotateY(180deg)' ? 'rotateY(0)' : 'rotateY(180deg)';
    cardInner.style.transition = transition ? 'transform 0.5s' : 'none';
}

function toggleMenu() {
    sideMenu.style.left = sideMenu.style.left === '0px' ? '-290px' : '0px';
    sideMenu.classList.toggle('show-inputs');
}

$(document).ready(function () {
    let currentIndex = 0;
    let questions = [];

    $.post('/', function (data) {
        questions = data.questions;
        showQuestion(currentIndex);
    }).fail(function (xhr, status, error) {
        console.error("Error retrieving question data:", error);
    });

    function showQuestion(index) {
        const { question, answer } = questions[index];
        $('#question').text(question);
        $('#answer').text(answer);
    }

    $('#button_prev, #button_next').click(function () {
        currentIndex = this.id === 'button_next' ? (currentIndex + 1) % questions.length : (currentIndex - 1 + questions.length) % questions.length;
        if (cardInner.style.transform === 'rotateY(180deg)') toggleCard(false);
        showQuestion(currentIndex);
    });
});