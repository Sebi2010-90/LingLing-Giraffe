// Kleine Interaktionen: Menü, Formular-Feedback, Datum
// Initialize games when page loads
document.addEventListener('DOMContentLoaded', function(){
  // Jahr im Footer
  const year = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = year;

  // Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  if(navToggle && navList){
    navToggle.addEventListener('click', function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      if(expanded){
        navList.hidden = true;
      } else {
        navList.hidden = false;
      }
    });
  }

  // Leichte 'Wink'-Animation der SVG beim Laden
  const logoImg = document.querySelector('.logo-img');
  if(logoImg){
    logoImg.classList.add('wave');
    setTimeout(()=> logoImg.classList.remove('wave'), 1200);
  }
  
  // Initialize Memory Game
  if(document.getElementById('memoryGame')){
    initMemoryGame();
  }
});

// Formular: keine echte Übertragung, nur Bestätigung
function submitForm(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim() || 'Freund';
  alert(`Danke, ${name}! Maxi LingLing hat deine Nachricht erhalten ❤️`);
  e.target.reset?.();
}

// ===== MEMORY GAME =====
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;

function initMemoryGame(){
  const cards = document.querySelectorAll('.memory-card');
  memoryCards = Array.from(cards);
  
  // Shuffle cards
  memoryCards.sort(() => Math.random() - 0.5);
  memoryCards.forEach((card, index) => {
    card.style.order = index;
    card.addEventListener('click', flipCard);
  });
}

function flipCard(){
  if(flippedCards.length >= 2) return;
  if(this.classList.contains('flipped') || this.classList.contains('matched')) return;
  
  this.classList.add('flipped');
  flippedCards.push(this);
  
  if(flippedCards.length === 2){
    moves++;
    document.getElementById('memoryMoves').textContent = moves;
    checkMatch();
  }
}

function checkMatch(){
  const [card1, card2] = flippedCards;
  const match = card1.dataset.card === card2.dataset.card;
  
  if(match){
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    document.getElementById('memoryPairs').textContent = matchedPairs;
    flippedCards = [];
    
    if(matchedPairs === 4){
      setTimeout(() => {
        alert(`🎉 Gewonnen! Du hast alle Paare in ${moves} Zügen gefunden!`);
      }, 500);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}

function resetMemoryGame(){
  memoryCards.forEach(card => {
    card.classList.remove('flipped', 'matched');
  });
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  document.getElementById('memoryMoves').textContent = '0';
  document.getElementById('memoryPairs').textContent = '0';
  initMemoryGame();
}

// ===== CLICK GAME =====
let clickScore = 0;
let clickTimeLeft = 30;
let clickTimer = null;
let clickGameActive = false;

function startClickGame(){
  if(clickGameActive) return;
  
  clickScore = 0;
  clickTimeLeft = 30;
  clickGameActive = true;
  
  document.getElementById('clickScore').textContent = '0';
  document.getElementById('clickTime').textContent = '30';
  
  const giraffe = document.getElementById('clickableGiraffe');
  giraffe.style.display = 'block';
  moveGiraffe();
  
  clickTimer = setInterval(() => {
    clickTimeLeft--;
    document.getElementById('clickTime').textContent = clickTimeLeft;
    
    if(clickTimeLeft <= 0){
      endClickGame();
    }
  }, 1000);
  
  giraffe.onclick = () => {
    if(!clickGameActive) return;
    clickScore++;
    document.getElementById('clickScore').textContent = clickScore;
    giraffe.classList.add('clicked');
    setTimeout(() => giraffe.classList.remove('clicked'), 500);
    moveGiraffe();
  };
}

function moveGiraffe(){
  const giraffe = document.getElementById('clickableGiraffe');
  const gameArea = document.querySelector('.click-game-area');
  const maxX = gameArea.offsetWidth - 80;
  const maxY = gameArea.offsetHeight - 120;
  
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  
  giraffe.style.left = x + 'px';
  giraffe.style.top = y + 'px';
}

function endClickGame(){
  clearInterval(clickTimer);
  clickGameActive = false;
  document.getElementById('clickableGiraffe').style.display = 'none';
  alert(`🎮 Spiel beendet! Du hast ${clickScore} Giraffen gefangen!`);
}

// ===== QUIZ GAME =====
const quizQuestions = [
  {
    question: "Wie lang ist Maxi LingLings Hals?",
    options: ["10 Zentimeter", "20 Zentimeter", "30 Zentimeter", "40 Zentimeter"],
    correct: 1
  },
  {
    question: "Was frisst Maxi am liebsten?",
    options: ["Gras", "Schokolade", "Früchte", "Insekten"],
    correct: 1
  },
  {
    question: "Wie viele GFs hat Maxi?",
    options: ["1 (Jenni)", "2 (Jenni + Schlachter)", "3 (Jenni + Schlacheter + Sebastian Bucher)", "4 (Jenni + Schlachter + S.B. + S.L.)"],
    correct: 1
  },
  {
    question: "Wie schnell kann Maxi laufen, wenn man JENNIFFER ruft?",
    options: ["20 km/h", "35 km/h", "50 km/h", "60 km/h"],
    correct: 2
  },
  {
    question: "Welche Farbe bekommt Maxi, wenn Jenni in der Nähe ist?",
    options: ["Rosa", "Rot", "Blau-schwarz", "Grün"],
    correct: 1
  }
];

let currentQuizQuestion = 0;
let quizScore = 0;

function startQuiz(){
  currentQuizQuestion = 0;
  quizScore = 0;
  document.getElementById('quizScore').textContent = '0';
  showQuizQuestion();
}

function showQuizQuestion(){
  if(currentQuizQuestion >= quizQuestions.length){
    endQuiz();
    return;
  }
  
  const q = quizQuestions[currentQuizQuestion];
  const questionEl = document.getElementById('quizQuestion');
  const optionsEl = document.getElementById('quizOptions');
  
  questionEl.innerHTML = `<p><strong>Frage ${currentQuizQuestion + 1}:</strong> ${q.question}</p>`;
  optionsEl.innerHTML = '';
  
  q.options.forEach((option, index) => {
    const btn = document.createElement('div');
    btn.className = 'quiz-option';
    btn.textContent = option;
    btn.onclick = () => selectQuizAnswer(index);
    optionsEl.appendChild(btn);
  });
}

function selectQuizAnswer(selected){
  const q = quizQuestions[currentQuizQuestion];
  const options = document.querySelectorAll('.quiz-option');
  
  options.forEach(opt => opt.classList.add('disabled'));
  
  if(selected === q.correct){
    options[selected].classList.add('correct');
    quizScore++;
    document.getElementById('quizScore').textContent = quizScore;
  } else {
    options[selected].classList.add('wrong');
    options[q.correct].classList.add('correct');
  }
  
  setTimeout(() => {
    currentQuizQuestion++;
    showQuizQuestion();
  }, 1500);
}

function endQuiz(){
  const questionEl = document.getElementById('quizQuestion');
  const optionsEl = document.getElementById('quizOptions');
  
  questionEl.innerHTML = `<p>🎉 Quiz beendet! Du hast ${quizScore} von ${quizQuestions.length} Fragen richtig beantwortet!</p>`;
  optionsEl.innerHTML = '';
  
  if(quizScore === quizQuestions.length){
    questionEl.innerHTML += '<p>Perfekt! Du bist ein echter Giraffen-Experte! 🦒</p>';
  } else if(quizScore >= 3){
    questionEl.innerHTML += '<p>Sehr gut! Du weißt schon viel über Giraffen! 👏</p>';
  } else {
    questionEl.innerHTML += '<p>Nicht schlecht! Lerne mehr über Giraffen und versuche es nochmal! 📚</p>';
  }
}
