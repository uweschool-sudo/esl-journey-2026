const scriptURL = 'https://script.google.com/macros/s/AKfycbxs5Kp52nOe0fQTOxYLdIomHxyA1ZIX7G4_apOYRhrmnkGcMxTz7Hrrs7HkFMdKushr/exec';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Skript gestartet.");

    // --- NAVIGATION LOGIK ---
    const navButtons = document.querySelectorAll('nav button');

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-section');
            
            console.log("Klick auf Button! Ziel-ID: " + targetId);

            if (targetId) {
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    // Scrollt weich zur richtigen Sektion, die jetzt den ganzen Inhalt umschließt
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                } else {
                    console.warn("Konnte Sektion '" + targetId + "' nicht finden.");
                }
            }
        });
    });

    // --- KOMMENTAR SENDEN ---
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const formData = {
                nickname: document.getElementById('comment-nickname').value,
                text: document.getElementById('comment-text').value,
                email: document.getElementById('comment-email').value
            };

            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(() => {
                alert('Danke für deinen Kommentar!');
                commentForm.reset();
                loadComments(); // Lädt die Liste nach dem Senden neu
            })
            .catch(error => console.error('Fehler beim Senden des Kommentars:', error));
        });
    }

    // Starte das Laden der Kommentare direkt beim Seitenaufruf
    loadComments();
});

// --- KOMMENTARE LADEN FUNKTION ---
function loadComments() {
    fetch(scriptURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerk-Antwort war nicht ok');
            }
            return response.json();
        })
        .then(data => {
            const displayArea = document.getElementById('comments-display');
            if (!displayArea) return;

            displayArea.innerHTML = ''; 

            // Prüfen, ob Daten vorhanden und ein Array sind
            if (data && Array.isArray(data)) {
                data.forEach(row => {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'comment-box';
                    commentDiv.style.marginBottom = "20px";
                    commentDiv.innerHTML = `
                        <p><strong>${row[1] || 'Anonymous'}</strong> <small>(${row[0] ? new Date(row[0]).toLocaleDateString() : ''})</small></p>
                        <p>${row[2] || ''}</p>
                        <hr>
                    `;
                    displayArea.appendChild(commentDiv);
                });
            }
        })
        .catch(error => console.error('Fehler beim Laden der Kommentare:', error));
}

// ==========================================================
// INTERAKTIVE QUIZ-LOGIK FÜR ALLE WORKSHEETS
// Unterstützt mehrere Quizze pro Seite über eine Nummer (z.B. '1', '2', '3'),
// die an die IDs "quizForm" + Nummer und "quizResult" + Nummer angehängt wird.
// Beispiel: checkQuizAnswers('2') prüft <form id="quizForm2"> und
// schreibt das Ergebnis nach <div id="quizResult2">.
// ==========================================================

function normalizeAnswer(value) {
    return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function checkQuizAnswers(suffix) {
    const form = document.getElementById('quizForm' + suffix);
    const resultBox = document.getElementById('quizResult' + suffix);
    if (!form || !resultBox) return;

    const inputs = form.querySelectorAll('input[data-answer]');
    let correctCount = 0;

    inputs.forEach(input => {
        const correctAnswer = normalizeAnswer(input.getAttribute('data-answer'));
        const userAnswer = normalizeAnswer(input.value);
        const isCorrect = userAnswer !== '' && userAnswer === correctAnswer;

        if (isCorrect) {
            correctCount++;
            input.style.backgroundColor = '#d4edda';
            input.style.borderColor = '#28a745';
            input.style.color = '#28a745';
        } else {
            input.style.backgroundColor = '#f8d7da';
            input.style.borderColor = '#dc3545';
            input.style.color = '#dc3545';
        }
    });

    const total = inputs.length;
    resultBox.innerHTML = `You got ${correctCount} out of ${total} correct.`;
    resultBox.style.color = correctCount === total ? '#28a745' : '#dc3545';
}

function showQuizSolutions(suffix) {
    const form = document.getElementById('quizForm' + suffix);
    const resultBox = document.getElementById('quizResult' + suffix);
    if (!form || !resultBox) return;

    const inputs = form.querySelectorAll('input[data-answer]');
    inputs.forEach(input => {
        input.value = input.getAttribute('data-answer');
        input.style.backgroundColor = '#e2f0d9';
        input.style.borderColor = '#004a99';
        input.style.color = '#004a99';
    });

    resultBox.innerHTML = 'Solutions shown above.';
    resultBox.style.color = '#004a99';
}

function resetQuiz(suffix) {
    const form = document.getElementById('quizForm' + suffix);
    const resultBox = document.getElementById('quizResult' + suffix);
    if (!form || !resultBox) return;

    const inputs = form.querySelectorAll('input[data-answer]');
    inputs.forEach(input => {
        input.value = '';
        input.style.backgroundColor = '';
        input.style.borderColor = '#ccc';
        input.style.color = '';
    });

    resultBox.innerHTML = '';
}
