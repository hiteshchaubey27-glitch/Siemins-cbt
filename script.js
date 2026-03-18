// --- STUDENT DATABASE ---
const students = [
    { name: "Deva", pass: "1371" },
    { name: "Hitesh", pass: "2685" },
    { name: "Saurabh", pass: "3252" },
    { name: "Soham", pass: "3261" },
    { name: "Shreya", pass: "3263" }
];

let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = []; 
let timeLeft = 1800; 
let timerInterval;

// 1. LOGIN FUNCTION
function showInstructions() {
    const enteredNameRaw = document.getElementById('studentName').value.trim();
    const enteredPass = document.getElementById('studentPass').value.trim();
    const errorMsg = document.getElementById('login-error');

    console.log("Attempting login for:", enteredNameRaw, enteredPass);

    const student = students.find(s => 
        s.name.toLowerCase() === enteredNameRaw.toLowerCase() && s.pass === enteredPass
    );

    if (student) {
        console.log("Login Success!");
        loadSelectedQuestions();
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('instruction-section').style.display = 'block';
    } else {
        console.error("Login Failed. Check if name/pass matches the list at the top of script.js");
        errorMsg.innerText = "❌ Invalid Name or TC Number.";
        errorMsg.style.display = 'block';
    }
}

// 2. LOAD QUESTIONS FROM LINK
function loadSelectedQuestions() {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedIds = urlParams.get('ids');
    
    let allQuestionsList = [];
    // masterQuestionBank comes from questions.js
    if (typeof masterQuestionBank !== 'undefined') {
        for (let topic in masterQuestionBank) {
            allQuestionsList = allQuestionsList.concat(masterQuestionBank[topic]);
        }
    }

    if (selectedIds) {
        const idArray = selectedIds.split(',');
        currentQuestions = allQuestionsList.filter(q => idArray.includes(q.id));
    } else {
        // Default to 20 random if no link is used
        currentQuestions = allQuestionsList.sort(() => 0.5 - Math.random()).slice(0, 20);
    }
    
    userAnswers = new Array(currentQuestions.length).fill(null);
}

// 3. START EXAM
function startExam() {
    document.getElementById('instruction-section').style.display = 'none';
    document.getElementById('question-section').style.display = 'block';
    
    timerInterval = setInterval(() => {
        timeLeft--;
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;
        document.getElementById('timer-display').innerText = `Time: ${min}:${sec < 10 ? '0'+sec : sec}`;
        if (timeLeft <= 0) calculateFinalScore();
    }, 1000);
    
    loadQuestion();
}

function loadQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerText = q.q;
    document.getElementById('question-number').innerText = currentQuestionIndex + 1;
    
    const container = document.getElementById('options-container');
    container.innerHTML = ""; 
    q.options.forEach(opt => {
        const checked = userAnswers[currentQuestionIndex] === opt ? "checked" : "";
        container.innerHTML += `<label class="option-label"><input type="radio" name="opt" value="${opt}" ${checked} onchange="userAnswers[${currentQuestionIndex}]='${opt}'"> ${opt}</label>`;
    });

    document.getElementById('prev-btn').style.visibility = currentQuestionIndex === 0 ? "hidden" : "visible";
    document.getElementById('next-btn').innerText = currentQuestionIndex === currentQuestions.length - 1 ? "FINISH" : "NEXT";
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        if(confirm("Submit Exam?")) calculateFinalScore();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function calculateFinalScore() {
    clearInterval(timerInterval);
    let score = 0;
    currentQuestions.forEach((q, i) => { if (userAnswers[i] === q.answer) score++; });
    
    const percent = Math.round((score / currentQuestions.length) * 100);
    document.getElementById('question-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
    document.getElementById('final-score').innerText = score;
    document.getElementById('result-percent').innerText = `Percentage: ${percent}%`;
}
