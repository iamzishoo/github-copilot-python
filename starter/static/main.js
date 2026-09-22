const API_URL = "/api/new";
const STORAGE_KEY = "sudoku-top10";
const THEME_KEY = "sudoku-dark";

const state = {
  puzzle: [],
  solution: [],
  difficulty: "medium",
  startTime: null,
  timerId: null,
  hints: 0,
  solved: false,
};

const boardEl = document.getElementById("board");
const timerEl = document.getElementById("timer");
const messageEl = document.getElementById("message");
const difficultyEl = document.getElementById("difficulty");
const themeToggle = document.getElementById("theme-toggle");

function getCell(row, col) {
  return boardEl.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function updateTimer() {
  if (state.solved || !state.startTime) return;
  const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
  timerEl.textContent = `Time: ${formatTime(elapsed)}`;
}

function renderBoard() {
  boardEl.innerHTML = "";
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const input = document.createElement("input");
      input.type = "text";
      input.inputMode = "numeric";
      input.maxLength = 1;
      input.dataset.row = r;
      input.dataset.col = c;
      input.classList.add("cell");
      input.setAttribute("aria-label", `Row ${r + 1} column ${c + 1}`);

      if ((Math.floor(r / 3) + Math.floor(c / 3)) % 2 === 1) {
        input.classList.add("box-alt");
      }

      if (state.puzzle[r][c] !== 0) {
        input.value = state.puzzle[r][c];
        input.readOnly = true;
        input.classList.add("prefilled");
      } else {
        input.addEventListener("input", handleInput);
      }

      boardEl.appendChild(input);
    }
  }
}

function hasConflict(row, col, value) {
  for (let i = 0; i < 9; i++) {
    if (i !== col && getCell(row, i).value === value) return true;
    if (i !== row && getCell(i, col).value === value) return true;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && getCell(r, c).value === value) return true;
    }
  }
  return false;
}

function validateConflicts() {
  boardEl.querySelectorAll(".cell").forEach((cell) => cell.classList.remove("conflict"));
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const input = getCell(r, c);
      const value = input.value;
      if (value && hasConflict(r, c, value)) input.classList.add("conflict");
    }
  }
}

function checkCompletion() {
  if (state.solved) return;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (getCell(r, c).value !== String(state.solution[r][c])) return;
    }
  }
  state.solved = true;
  clearInterval(state.timerId);
  const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
  messageEl.textContent = `Congratulations! You solved it in ${formatTime(elapsed)}.`;

  const name = prompt("You made the Top 10! Enter your name:", "Player");
  if (name) {
    saveScore(name, elapsed, state.difficulty, state.hints);
    renderLeaderboard();
  }
}

function handleInput(event) {
  const input = event.target;
  input.value = input.value.replace(/[^1-9]/g, "");
  input.classList.remove("incorrect");
  validateConflicts();
  checkCompletion();
}

function checkPuzzle() {
  boardEl.querySelectorAll(".incorrect").forEach((cell) => cell.classList.remove("incorrect"));
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const input = getCell(r, c);
      if (input.readOnly) continue;
      const value = Number(input.value);
      if (value && value !== state.solution[r][c]) input.classList.add("incorrect");
    }
  }
}

function hint() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const input = getCell(r, c);
      if (!input.readOnly && !input.value) {
        input.value = state.solution[r][c];
        input.readOnly = true;
        input.classList.add("hint");
        state.hints += 1;
        checkCompletion();
        return;
      }
    }
  }
}

function loadScores() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveScore(name, seconds, difficulty, hints) {
  const scores = loadScores();
  scores.push({
    name, time: seconds, timeLabel: formatTime(seconds),
    difficulty, hints, date: Date.now(),
  });
  scores.sort((a, b) => a.time - b.time);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores.slice(0, 10)));
}

function renderLeaderboard() {
  const tbody = document.querySelector("#leaderboard tbody");
  tbody.innerHTML = "";
  loadScores().forEach((entry, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.timeLabel}</td>
      <td>${entry.difficulty}</td>
      <td>${entry.hints}</td>
    `;
    tbody.appendChild(tr);
  });
}

function setTheme(dark) {
  document.body.classList.toggle("dark", dark);
  localStorage.setItem(THEME_KEY, dark ? "1" : "0");
  themeToggle.textContent = dark ? "Light Mode" : "Dark Mode";
}

async function newGame() {
  const difficulty = difficultyEl.value;
  const response = await fetch(`${API_URL}?difficulty=${difficulty}`);
  const data = await response.json();

  if (!response.ok) {
    messageEl.textContent = data.error || "Could not start a new game.";
    return;
  }

  state.puzzle = data.puzzle;
  state.solution = data.solution;
  state.difficulty = data.difficulty;
  state.hints = 0;
  state.solved = false;
  state.startTime = Date.now();

  clearInterval(state.timerId);
  state.timerId = setInterval(updateTimer, 1000);

  messageEl.textContent = "";
  timerEl.textContent = "Time: 0:00";
  renderBoard();
}

document.getElementById("new-game").addEventListener("click", newGame);
document.getElementById("check").addEventListener("click", checkPuzzle);
document.getElementById("hint").addEventListener("click", hint);
difficultyEl.addEventListener("change", newGame);
themeToggle.addEventListener("click", () => {
  setTheme(!document.body.classList.contains("dark"));
});

setTheme(localStorage.getItem(THEME_KEY) === "1");
renderLeaderboard();
newGame();