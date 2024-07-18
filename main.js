import "./style.css";

// *******************
// Constants
const WORD_LENGTH = 5;
const keyboard = document.querySelector("[data-keyboard]");
const guessGrid = document.querySelector("[data-guess-grid]");
const alertContainer = document.querySelector("[data-alert-container]");

let targetWord;

// ******************
// Utility Functions

async function getRandomWord() {
  const response = await fetch(
    `/api/words.json/randomWord?api_key=${
      import.meta.env.VITE_WORDNIK_KEY
    }&minLength=${WORD_LENGTH}&maxLength=${WORD_LENGTH}`
  );
  const wordJSON = await response.json();
  if (!(/^[a-z]+$/.test(wordJSON.word))) {
    getRandomWord()
    return;
  }
  targetWord = wordJSON.word;
  console.log("🚀 ~ getRandomWord ~ targetWord:", targetWord);
  startInteraction()
}

async function getDefinition(enteredWord) {
  let url = `/api/word.json/${enteredWord}/definitions?api_key=${import.meta.env.VITE_WORDNIK_KEY}`
  try {
    const response = await fetch(url);
    if (response.ok) {
      const result = await response.json();
     return result
    } else {
      throw new Error("Entry not found")
    }
  } catch (err) {
    console.log(err)
    return;
  }
}

async function validateWord(guess){
  const wordDefinition = await getDefinition(guess)
  // debugger
  return !!wordDefinition[0] && wordDefinition[0].hasOwnProperty('word')
}


function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]');
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div");
  alert.textContent = message;
  alert.classList.add("alert");
  alertContainer.prepend(alert)
  if (duration == null) return;

  setTimeout(() => {
    alert.classList.add("hide")
    alert.addEventListener('transitionend', () => alert.remove())
  }, duration);
}

// **********************
// Game logic functions


function flipTile(tile, index, array, guess) {
  const letter = tile.dataset.letter
  const key = keyboard.querySelector(`[data-key="${letter}"i]`)

  if (targetWord[index] === letter) {
    tile.dataset.state = "correct"
    key.classList.add("correct")
  } else if (targetWord.includes(letter)) {
    tile.dataset.state = 'wrong-location'
    key.classList.add("wrong-location")
  } else {
    tile.dataset.state = "wrong"
    key.classList.add("wrong")
  }
  if (index == array.length - 1) {
    checkWinLose(guess, array)

  }
}

function checkWinLose(guess, tiles) {
  if (guess == targetWord) {
    showAlert("You Win", 5000)
    stopInteraction()
    return
  }
  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
  if (remainingTiles.length === 0) {
    showAlert(targetWord.toUpperCase(), null)
    stopInteraction()
  }
}

// ***************************
// Game Interaction Functions

function pressKey(key) {
  const activeTiles = getActiveTiles();
  if (activeTiles.length >= 5) return;
  const nextTile = guessGrid.querySelector(":not([data-letter])");
  nextTile.textContent = key;
  nextTile.dataset.letter = key.toLowerCase();
  nextTile.dataset.state = "active";
}

function deleteKey() {
  const activeTiles = getActiveTiles();
  const lastTile = activeTiles[activeTiles.length - 1];
  if (lastTile == null) return;
  lastTile.textContent = "";
  delete lastTile.dataset.letter;
  delete lastTile.dataset.state;
}

async function submitGuess() {
  const activeTiles = [...getActiveTiles()];
  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter;
  }, "");
  console.log("🚀 ~ guess ~ guess:", guess);
  if (activeTiles.length !== WORD_LENGTH) {
    showAlert("Not enough letters");
  }
  // add condition that validates guess in dictionary
  
if (!(await validateWord(guess))) {
    showAlert("Not a known word!")
    return;
  }
  activeTiles.forEach((...params) => flipTile(...params, guess))
}

function startInteraction() {
  document.addEventListener("click", handleMouseClick);
  document.addEventListener("keydown", handleKeyPress);

}
function stopInteraction() {
  document.removeEventListener("click", handleMouseClick);
  document.removeEventListener("keydown", handleKeyPress);

}

// **************************
// Event handlers

function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key);
    return;
  }
  // console.log(e.target)
  if (e.target.matches("[data-delete]")) {
    console.log("delete pressed");
    deleteKey();
    return;
  }
  
  if (e.target.matches("[data-enter]")) {
    submitGuess();
    return;
  }
}

function handleKeyPress(e) {
  console.log(e.key);
  if (e.key.match(/^[a-z]$/)) {
    pressKey(e.key);
    return;
  }
  
  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey();
  }

  if (e.key == "Enter") {
    submitGuess();
    return;
  }
}


getRandomWord();
