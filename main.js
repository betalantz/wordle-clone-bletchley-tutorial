import "./style.css";

// *******************
// Constants
const keyboard = document.querySelector('[data-keyboard]')
const guessGrid = document.querySelector('[data-guess-grid]')

// ******************
// Utility Functions

function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]')
}

// **********************
// Game logic functions



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

// **************************
// Event handlers

function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
     pressKey(e.target.dataset.key)
     return;
  }
  console.log(e.target)
  if (e.target.matches("[data-delete]")) {
    console.log('delete pressed')
    deleteKey()
    return;
  }
}


document.addEventListener('click', handleMouseClick)
