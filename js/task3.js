/*~~~~~$ Selectors $~~~~~*/
const container = document.querySelector(".container");
const basket = document.getElementById("basket");
const scoreDisplay = document.getElementById("score");
const gameOverDisplay = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");
const playAgainButton = document.getElementById("play-again");
const startGameButton = document.getElementById("start-game");
const moveLeftButton = document.getElementById("move-left");
const moveRightButton = document.getElementById("move-right");
const controls = document.getElementById("controls");
const scoreboard = document.getElementById("scoreboard");

/*~~~~~$ Global Variables $~~~~~*/
let score = 0;
let eggInterval;
let isGameOver = false;

/*~~~~~$ Handlers $~~~~~*/
playAgainButton.addEventListener("click", startGame);
startGameButton.addEventListener("click", startGame);
moveLeftButton.addEventListener("click", moveBasketLeft);
moveRightButton.addEventListener("click", moveBasketRight);

window.addEventListener("keydown", handleKeydown);

/*~~~~~$ Utility $~~~~~*/
// ? Function to start the game
function startGame() {
  score = 0;
  isGameOver = false;
  scoreDisplay.textContent = `Score: ${score}`;
  gameOverDisplay.style.display = "none";
  container.style.display = "block";
  controls.style.display = "flex";
  scoreboard.style.display = "block";
  eggInterval = setInterval(dropEgg, 1000);
  startGameButton.style.display = "none";
}

// ? Function to end the game
function endGame() {
  isGameOver = true;
  clearInterval(eggInterval);
  finalScoreDisplay.textContent = `Game Over! Your Score: ${score}`;
  gameOverDisplay.style.display = "block";
  startGameButton.style.display = "block";
  controls.style.display = "none";
  scoreboard.style.display = "none";
}

// ? Function to drop an egg
function dropEgg() {
  if (isGameOver) return;

  const egg = document.createElement("div");
  egg.classList.add("egg");
  egg.style.left = `${Math.random() * (window.innerWidth - 30)}px`; // ? Adjust egg spawning to avoid screen overflow
  container.appendChild(egg);

  const fallDuration = 3; // ? Duration of the fall animation in seconds
  egg.style.animationDuration = `${fallDuration}s`;

  egg.addEventListener("animationend", () => {
    const eggRect = egg.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();

    if (
      eggRect.bottom >= basketRect.top &&
      eggRect.left < basketRect.right &&
      eggRect.right > basketRect.left
    ) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    } else if (eggRect.bottom >= window.innerHeight - 20) {
      // ? Adjusted for ground height
      endGame();
    }

    egg.remove();
  });
}

// ? Function to move the basket left
function moveBasketLeft() {
  if (isGameOver) return;

  const basketRect = basket.getBoundingClientRect();
  const moveDistance = 20; // ? Adjust move distance as needed

  if (basketRect.left > 0) {
    basket.style.left = `${basketRect.left - moveDistance}px`;
  }
}

// Function to move the basket right
function moveBasketRight() {
  if (isGameOver) return;

  const basketRect = basket.getBoundingClientRect();
  const moveDistance = 20; // Adjust move distance as needed

  if (basketRect.right < window.innerWidth) {
    basket.style.left = `${basketRect.left + moveDistance}px`;
  }
}

// Function to handle keydown events
function handleKeydown(e) {
  if (isGameOver) return;
  if (e.key === "ArrowLeft") {
    moveBasketLeft();
  } else if (e.key === "ArrowRight") {
    moveBasketRight();
  }
}

/*~~~~~$ Initial Setup $~~~~~*/
container.style.display = "none";
startGameButton.style.display = "block";
controls.style.display = "none";
scoreboard.style.display = "none";

startGameButton.addEventListener("click", () => {
  controls.style.display = "flex";
  scoreboard.style.display = "block";
});
