const board = document.querySelector(".board");
const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset");
const statusText = document.getElementById("status");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");
const clickSound = document.getElementById("clickSound"); // New click sound
let currentPlayer = "X";
let gameActive = true;
let boardState = Array(9).fill(null);
let winningLine = null;

// Winning combinations
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Handle cell clicks
function handleCellClick(e) {
  const cellIndex = e.target.getAttribute("data-index");

  if (boardState[cellIndex] || !gameActive) return;

  // Play click sound for both players
  clickSound.currentTime = 0; // Reset sound to start
  clickSound.play();

  boardState[cellIndex] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin()) {
    gameActive = false;
    statusText.textContent = `Player ${currentPlayer} wins!`;
    highlightWinningCells();
    winSound.play();
  } else if (boardState.every((cell) => cell !== null)) {
    gameActive = false;
    statusText.textContent = "It's a draw!";
    drawSound.play();
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

// Check for winning conditions
function checkWin() {
  return winningCombinations.some((combination) => {
    if (combination.every((index) => boardState[index] === currentPlayer)) {
      winningLine = combination;
      return true;
    }
    return false;
  });
}

function highlightWinningCells() {
  if (!winningLine) return;

  winningLine.forEach((index) => {
    cells[index].classList.add("highlight");
  });

  // Draw the winning line
  const line = document.createElement("div");
  line.className = "winning-line active"; // Add active class here
  document.body.appendChild(line);

  const [firstIndex, secondIndex, thirdIndex] = winningLine;

  const startX = cells[firstIndex].getBoundingClientRect().left + 50;
  const startY = cells[firstIndex].getBoundingClientRect().top + 50;
  const endX = cells[thirdIndex].getBoundingClientRect().left + 50;
  const endY = cells[thirdIndex].getBoundingClientRect().top + 50;

  line.style.left = `${Math.min(startX, endX)}px`;
  line.style.top = `${Math.min(startY, endY)}px`;
  line.style.width = `${Math.sqrt(
    (endX - startX) ** 2 + (endY - startY) ** 2
  )}px`;
  line.style.transform = `rotate(${
    (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI
  }deg)`;
}

// Reset the game
function resetGame() {
  boardState = Array(9).fill(null);
  currentPlayer = "X";
  gameActive = true;
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("highlight");
  });
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  winningLine = null;

  // Remove any existing winning line
  const existingLine = document.querySelector(".winning-line");
  if (existingLine) existingLine.remove();
}

// Event listeners
cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);
statusText.textContent = `Player ${currentPlayer}'s turn`;

// Preload audio
document.body.addEventListener(
  "click",
  () => {
    winSound.load();
    drawSound.load();
    clickSound.load(); // Load the click sound
  },
  { once: true }
);
