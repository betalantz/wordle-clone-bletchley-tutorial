import "./style.css";

// *******************
// Constants
const WORD_LENGTH = 5
const keyboard = document.querySelector('[data-keyboard]')
const guessGrid = document.querySelector('[data-guess-grid]')

let targetWord;

// ******************
// Utility Functions

function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]')
}

// **********************
// Game logic functions

async function getRandomWord() {
  const response = await fetch(`/api/randomWord?api_key=${import.meta.env.VITE_WORDNIK_KEY}&minLength=${WORD_LENGTH}&maxLength=${WORD_LENGTH}`)
  const wordJSON = await response.json()
  targetWord = wordJSON.word
  console.log("🚀 ~ getRandomWord ~ targetWord:", targetWord)
}

// ***************************
// Game Interaction Functions

function pressKey(key) {
  const activeTiles = getActiveTiles();
  if (activeTiles.length >= 5) return;
  const nextTile = guessGrid.querySelector(":not([data-letter])")
  nextTile.textContent = key;
  nextTile.dataset.letter = key.toLowerCase();
  nextTile.dataset.state = "active"
  }
  
function deleteKey() {
  const activeTiles = getActiveTiles();
  const lastTile = activeTiles[activeTiles.length - 1];
  if (lastTile == null) return;
  lastTile.textContent = ""
  delete lastTile.dataset.letter
  delete lastTile.dataset.state
}

function submitGuess() {
  const activeTiles = [...getActiveTiles()];
  const guess = activeTiles.reduce((word, tile) => {
      return word + tile.dataset.letter
  }, "")
  console.log("🚀 ~ guess ~ guess:", guess)
  
}

// **************************
// Event handlers

function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
     pressKey(e.target.dataset.key)
     return;
  }
  // console.log(e.target)
  if (e.target.matches("[data-delete]")) {
    console.log('delete pressed')
    deleteKey()
    return;
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess()
    return;
  }
}

function handleKeyPress(e){
  console.log(e.key)
  if (e.key.match(/^[a-z]$/)) {
    pressKey(e.key)
    return
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey()
  }
}


document.addEventListener('click', handleMouseClick)
document.addEventListener('keydown', handleKeyPress)

getRandomWord()