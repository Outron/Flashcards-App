const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
});

document.getElementById('flashcard').addEventListener('click', function() {
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

 function toggleCard() {
        var cardInner = document.querySelector('.card-inner');
        cardInner.style.transform = cardInner.style.transform === 'rotateY(180deg)' ? 'rotateY(0)' : 'rotateY(180deg)';

        // Pokaż odpowiedź, jeśli była ukryta, lub ukryj, jeśli była widoczna
        var answer = document.getElementById('answer');
        answer.classList.toggle('hidden');
}

function toggleMenu() {
            var sideMenu = document.querySelector('.side-menu');
            sideMenu.style.left = sideMenu.style.left === '0px' ? '-290px' : '0px';
        }