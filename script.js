 // Stores the selected character: "boy" or "girl"
let chosenChar = null;

// Used to create simple sound effects in the browser
let audioCtx;

// These variables store the current game state
let lives;
let score;
let combo;
let currentQ;
let oppHP;
let playerHP;
let timerInterval;
let timeLeft;
let answered;


// Shows one screen and hides all the others
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  document.getElementById(id).classList.add('active');
}


// Runs when the player chooses Cyber Boy or Cyber Girl
function selectChar(char) {
  chosenChar = char;

  // Remove selected styling from both cards first
  document.getElementById('card-boy').classList.remove('selected');
  document.getElementById('card-girl').classList.remove('selected');

  // Add selected styling to the chosen card
  document.getElementById('card-' + char).classList.add('selected');

  // Enable the start button after a fighter is chosen
  const btn = document.getElementById('startBtn');
  btn.disabled = false;
  btn.classList.remove('disabled-btn');
  btn.textContent = 'FIGHT! →';
}


// Question bank for the game
const questions = [
  {
    q: "You receive an email asking you to verify your bank details by clicking a link. What should you do?",
    opts: [
      "Forward it to friends",
      "Delete the email and report it as phishing",
      "Click the link immediately",
      "Reply with your details"
    ],
    ans: 1
  },
  {
    q: "Which of these is the strongest password?",
    opts: [
      "password123",
      "MyDog2010",
      "T$9kL!mX#2qP",
      "qwerty"
    ],
    ans: 2
  },
  {
    q: "What does malware mean?",
    opts: [
      "A slow internet connection",
      "Malicious software designed to harm your system",
      "A type of firewall",
      "An outdated browser"
    ],
    ans: 1
  },
  {
    q: "You get a call from someone claiming to be IT support asking for your password. What do you do?",
    opts: [
      "Give them the password",
      "Give them a fake password",
      "Ask them to email you instead",
      "Hang up and report it"
    ],
    ans: 3
  },
  {
    q: "What is two-factor authentication (2FA)?",
    opts: [
      "Encrypting files twice",
      "Logging in with two passwords",
      "A second verification step after entering your password",
      "Having two different email accounts"
    ],
    ans: 2
  },
  {
    q: "Which of these is a sign that a website is secure?",
    opts: [
      "It loads quickly",
      "It has lots of images",
      "The URL starts with https://",
      "It has a colourful design"
    ],
    ans: 2
  },
  {
    q: "What is phishing?",
    opts: [
      "A type of network cable",
      "Tricking users into giving sensitive information via fake messages",
      "A method of encrypting data",
      "A way to speed up your computer"
    ],
    ans: 1
  },
  {
    q: "How often should you update your passwords?",
    opts: [
      "Never, once set they're fine",
      "Every 10 years",
      "Regularly, and immediately after a suspected breach",
      "Only when you forget them"
    ],
    ans: 2
  },
  {
    q: "What should you do before clicking a link in an email?",
    opts: [
      "Print the email first",
      "Hover over it to check the real URL",
      "Forward it to a colleague",
      "Click it immediately"
    ],
    ans: 1
  },
  {
    q: "What is ransomware?",
    opts: [
      "A type of antivirus",
      "Malware that locks your files and demands payment",
      "A secure cloud backup service",
      "Software that speeds up your PC"
    ],
    ans: 1
  },
  {
    q: "Which action puts your network most at risk?",
    opts: [
      "Connecting to unsecured public Wi-Fi",
      "Using a VPN",
      "Enabling a firewall",
      "Updating your operating system"
    ],
    ans: 0
  },
  {
    q: "What does a firewall do?",
    opts: [
      "Backs up your data",
      "Monitors and controls incoming and outgoing network traffic",
      "Speeds up your internet",
      "Removes viruses from files"
    ],
    ans: 1
  },
  {
    q: "You find a USB drive in a car park. What should you do?",
    opts: [
      "Throw it away",
      "Hand it to IT security without plugging it in",
      "Keep it for personal use",
      "Plug it in to see what's on it"
    ],
    ans: 1
  },
  {
    q: "What is social engineering in cybersecurity?",
    opts: [
      "Coding a new application",
      "Manipulating people into revealing confidential information",
      "Building social media profiles",
      "Setting up a company network"
    ],
    ans: 1
  },
  {
    q: "Which of the following best protects your accounts if a password is stolen?",
    opts: [
      "Using the same password everywhere",
      "Enabling two-factor authentication",
      "Writing passwords on paper",
      "Changing your username"
    ],
    ans: 1
  }
];


// Starts or resets the game values
function initGame() {
  lives = 3;
  score = 0;
  combo = 0;
  currentQ = 0;
  oppHP = 100;
  playerHP = 100;
  answered = false;

  updateHUD();
  setGloveColours();
  loadQuestion();
}


// Sets glove colours based on the selected character
function setGloveColours() {
  const playerColour = chosenChar === 'boy' ? '#4fc3f7' : '#ff6eb4';
  const opponentColour = chosenChar === 'boy' ? '#ff6eb4' : '#4fc3f7';

  document.getElementById('playerGloveL').style.background = playerColour;
  document.getElementById('playerGloveR').style.background = playerColour;

  document.getElementById('oppGloveL').style.background = opponentColour;
  document.getElementById('oppGloveR').style.background = opponentColour;
}


// Updates lives, score, combo and health bars on the screen
function updateHUD() {
  const hearts = ['', '❤️', '❤️❤️', '❤️❤️❤️'];

  document.getElementById('livesDisplay').textContent = hearts[lives] || '';
  document.getElementById('scoreDisplay').textContent = score;

  document.getElementById('comboDisplay').textContent =
    combo >= 2 ? '🔥 COMBO x' + combo + '!' : '';

  document.getElementById('playerHealth').style.width = playerHP + '%';
  document.getElementById('oppHealth').style.width = oppHP + '%';
}


// Loads the current question and creates answer buttons
function loadQuestion() {
  // If all questions are finished, player wins
  if (currentQ >= questions.length) {
    endGame(true);
    return;
  }

  answered = false;

  const q = questions[currentQ];

  document.getElementById('questionNum').textContent =
    'Question ' + (currentQ + 1) + ' of ' + questions.length;

  document.getElementById('questionText').textContent = q.q;

  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';

  const grid = document.getElementById('answersGrid');
  grid.innerHTML = '';

  // Create one button for each answer option
  q.opts.forEach((option, index) => {
    const btn = document.createElement('button');

    btn.className = 'ans-btn';
    btn.textContent = ['A', 'B', 'C', 'D'][index] + '. ' + option;

    // When clicked, this answer is checked
    btn.onclick = () => handleAnswer(index, btn);

    grid.appendChild(btn);
  });

  startTimer();
}


// Starts the 30 second countdown for each question
function startTimer() {
  clearInterval(timerInterval);

  timeLeft = 30;
  updateTimer();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();

    // If time runs out, treat it as a wrong answer
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleAnswer(-1, null);
    }
  }, 1000);
}


// Updates the timer number and timer bar
function updateTimer() {
  document.getElementById('timerCount').textContent = timeLeft;

  const fill = document.getElementById('timerFill');

  fill.style.width = (timeLeft / 30 * 100) + '%';

  // Turns red when time is low
  fill.className = 'timer-fill' + (timeLeft <= 10 ? ' urgent' : '');
}


// Checks if the player selected the correct answer
function handleAnswer(chosen, btn) {
  // Stops double-clicking from answering twice
  if (answered) return;

  answered = true;
  clearInterval(timerInterval);
  disableAnswers();

  const correct = questions[currentQ].ans;
  const buttons = document.querySelectorAll('.ans-btn');

  // Always highlight the correct answer
  buttons[correct].classList.add('correct-ans');

  if (chosen === correct) {
    handleCorrectAnswer();
  } else {
    handleWrongAnswer(chosen, btn);
  }

  updateHUD();

  // End game if player loses all lives
  if (lives <= 0) {
    setTimeout(() => endGame(false), 1200);
    return;
  }

  // Move to the next question after a short delay
  currentQ++;
  setTimeout(loadQuestion, 1400);
}


// Runs when the answer is correct
function handleCorrectAnswer() {
  combo++;

  // Combo gives bonus points
  const bonus = combo >= 3 ? 20 : combo >= 2 ? 15 : 10;

  score += bonus;

  // Opponent loses health after correct answer
  oppHP = Math.max(0, oppHP - Math.round(100 / questions.length));

  showFeedback('✅ CORRECT!' + (combo >= 2 ? ' COMBO x' + combo + '!' : ''), 'correct');

  animatePunch(combo);
}


// Runs when the answer is wrong or time runs out
function handleWrongAnswer(chosen, btn) {
  if (btn) {
    btn.classList.add('wrong-ans');
  }

  combo = 0;
  lives--;

  // Player loses health after wrong answer
  playerHP = Math.max(0, playerHP - 33);

  if (chosen === -1) {
    showFeedback('⏰ TIME UP! -1 LIFE', 'wrong');
  } else {
    showFeedback('❌ WRONG! -1 LIFE', 'wrong');
  }

  animateHit();
}


// Disables all answer buttons after one answer is chosen
function disableAnswers() {
  document.querySelectorAll('.ans-btn').forEach(button => {
    button.disabled = true;
  });
}


// Shows a feedback message under the arena
function showFeedback(message, type) {
  const el = document.getElementById('feedback');

  el.textContent = message;
  el.className = 'feedback ' + type;
}


// Applies a CSS animation to an element
function applyAnim(element, animationName, duration) {
  element.style.animation = 'none';

  // Forces browser to restart the animation
  void element.offsetWidth;

  element.style.animation = animationName + ' ' + duration + 's ease';

  setTimeout(() => {
    element.style.animation = '';
  }, duration * 1000);
}


// Creates simple sound effects using Web Audio API
function playSound(effect) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (effect === 'punch') {
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.1);
  }

  else if (effect === 'combo') {
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.25);
  }

  else if (effect === 'damage') {
    oscillator.frequency.setValueAtTime(500, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.3);
  }
}


// Creates a small emoji impact effect in the arena
function showImpact(x, y, emoji) {
  const arena = document.getElementById('arena');
  const impact = document.createElement('div');

  impact.className = 'impact';
  impact.textContent = emoji;
  impact.style.left = x + 'px';
  impact.style.top = y + 'px';

  arena.appendChild(impact);

  setTimeout(() => {
    impact.remove();
  }, 600);
}


// Runs different punch animations depending on combo count
function animatePunch(comboCount) {
  const gloves = document.getElementById('playerGloves');

  if (comboCount >= 3) {
    applyAnim(gloves, 'uppercut', 0.45);
    setTimeout(() => showImpact(260, 20, '💥'), 250);
    playSound('combo');
  }

  else if (comboCount === 2) {
    applyAnim(gloves, 'jab', 0.35);
    setTimeout(() => showImpact(280, 30, '⚡'), 180);

    setTimeout(() => {
      applyAnim(gloves, 'hook', 0.35);
      setTimeout(() => showImpact(240, 25, '💢'), 180);
    }, 400);

    playSound('combo');
  }

  else {
    applyAnim(gloves, 'jab', 0.35);
    setTimeout(() => showImpact(270, 35, '👊'), 180);
    playSound('punch');
  }
}


// Runs when the player is hit by the opponent
function animateHit() {
  const arena = document.getElementById('arena');

  // Flash the arena red
  arena.classList.remove('hit-anim');
  void arena.offsetWidth;
  arena.classList.add('hit-anim');

  // Opponent glove moves down towards the player
  applyAnim(document.getElementById('oppGloveL'), 'opp-jab', 0.4);

  setTimeout(() => showImpact(250, 100, '😵'), 200);

  playSound('damage');
}


// Shows the final win or game over screen
function endGame(won) {
  clearInterval(timerInterval);

  showScreen('endScreen');

  document.getElementById('endTitle').textContent =
    won ? '🏆 YOU WIN!' : '💀 GAME OVER';

  document.getElementById('endTitle').style.color =
    won ? '#4caf50' : '#e94560';

  document.getElementById('endMsg').textContent =
    won
      ? 'You defeated the opponent! Cybersecurity knowledge: secured.'
      : 'You ran out of lives. Study up and try again!';

  document.getElementById('finalScore').textContent = score;
}


// Restarts the game with the same chosen character
function restartGame() {
  showScreen('gameScreen');
  initGame();
}


// Starts the game only if a character has been selected
function startGame() {
  if (!chosenChar) return;

  showScreen('gameScreen');
  initGame();
}