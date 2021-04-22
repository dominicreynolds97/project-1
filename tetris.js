const elements = {
  gameScreen: document.querySelector('#game-screen'),
  score: document.querySelector('#score'),
  highScore: document.querySelector('#high-score'),
  level: document.querySelector('#level'),
  next: document.querySelector('#next-tetromino'),
  hold: document.querySelector('#hold-tetromino'),
  song: document.querySelector('#song'),
  collision: document.querySelector('#collision'),
  removeRow: document.querySelector('#remove-row'),
  highScoresOverlay: document.querySelector('#high-scores-overlay'),
  highScoresList: document.querySelector('#high-scores'),
  enterNameOverlay: document.querySelector('#enter-name-overlay'),
  enterNameInput: document.querySelector('#name'),
  enterNameForm: document.querySelector('form'),
  newGameButtons: document.querySelectorAll('.new-game'),
  pauseOverlay: document.querySelector('#pause-overlay'),
  linesCleared: document.querySelector('#lines-cleared'),
  mainMenuOverlay: document.querySelector('#main-menu-overlay'),
  mainMenuButton: document.querySelector('#main-menu-button'),
  settingsButtons: document.querySelectorAll('.settings-button'),
  settingsOverlay: document.querySelector('#settings-overlay'),
  musicOnOff: document.querySelector('#music-on-off'),
  musicVolume: document.querySelector('#music-volume'),
  sfxVolume: document.querySelector('#sfx-volume'),
  exitSettingButton: document.querySelector('#exit-settings'),
}

class Tetromino {
  constructor(shape, color) {
    this.width = shape.length
    this.shapeArray = shape
    this.color = color
    this.width === 2 ? this.x = 4 : this.x = 3
    this.y = 0 - this.width
  }
  //Display Tetrimino on game screen
  display() {
    this.shapeArray.forEach((shapeArray, i) => shapeArray.forEach((cell, j) => {
      if (cell && (this.y + i >= 0)) {
        cells[this.x + j][this.y + i].color = this.color
        cells[this.x + j][this.y + i].element.style = `background-color: ${this.color};`
      } else if (!(this.y + i > 19) && (this.y + i >= 0) && cells[this.x + j] && !cells[this.x + j][this.y + i].hasTetromino) {
        cells[this.x + j][this.y + i].element.style = 'background-color: black'
      }
    }))
  }
  //Display Tetrimino for either next or hold 
  displaySmall(array) {
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (x < this.width && y < this.width && this.shapeArray[x][y]) {
          array[x][y].color = this.color
          array[x][y].element.style = `background-color: ${this.color};`
        } else {
          array[x][y].element.style = 'background-color: black'
        }
      }
    }
  }
  //moves Tetrimino down one cell if possible
  drop() {
    if (this.collisionDetection()) {
      return true
    }
    this.shapeArray.forEach((xCells, i) => xCells.forEach((cell, j) => {
      if (!cell && (this.x + j > 9 || this.x + j < 0)) {
        //console.log(cells[this.x + j])
      } else if ((this.y + i >= 0) && !cells[this.x + j][this.y + i].hasTetromino) {
        cells[this.x + j][this.y + i].element.style = 'background-color: black'
      }
    }))
    this.y++
    this.display()
    return false
  }
  //Moves Tetromino left or right is possible
  moveSideways(direction) {
    let canMove = true
    this.shapeArray.forEach((xCells, i) => xCells.forEach((cell, j) => {
      if (cell && (this.y + i > 0 && !cells[this.x + j + direction] || 
        (!cells[this.x + j + direction][this.y + i] || 
          cells[this.x + j + direction][this.y + i].hasTetromino) )) {
        canMove = false
      } 
      if (cell && this.y + i < 0) {
        canMove = true
      }
    }))
    
    if (canMove) {
      this.shapeArray.forEach((xCells, i) => xCells.forEach((cell, j) => {
        if (this.y + i >= 0 && cell && cells[this.x + j] && !cells[this.x + j][this.y + i].hasTetromino) {
          cells[this.x + j][this.y + i].element.style = 'background-color: black'
        }
      }))
      this.x += direction
      this.display()
    }
  }
  //rotates the tetromino if possible
  rotate(isClockwise) {
    const newShape = []
    let canRotate = true
    for (let i = 0; i < this.width; i++) {
      newShape.push([])
    }
    if (isClockwise) {
      this.shapeArray.forEach((xCells, i) => xCells.forEach((cell, j) => {
        if (cell && j + this.y >= 19 || (this.y + (this.width - 1 - i) > 0 && cells[this.x + j] && cells[this.x + j][this.y + (this.width - 1 - i)].hasTetromino)) {
          canRotate = false
        } else if (cell && i + this.x >= 10) {
          this.moveSideways(-1)
        } else if (cell && i + this.x < 0) {
          this.moveSideways(1)
        }
        newShape[j].unshift(this.shapeArray[i][j])
      }))
    } else {
      this.shapeArray.forEach((xCells, i) => xCells.forEach((cell, j) => {
        if (cell && j + this.y >= 19 || (this.y + i > 0 && cells[this.width - 1 - j + this.x] && cells[this.width - 1 - j + this.x][this.y + i].hasTetromino)) {
          canRotate = false
        } else if (cell && i + this.x >= 10) {
          this.moveSideways(-1)
        } else if (cell && i + this.x < 0) {
          this.moveSideways(1)
        }
        newShape[this.width - 1 - j].push(this.shapeArray[i][j])
      }))
    }
    if (canRotate) {
      this.shapeArray = newShape
    }
  }
  //Checks for a collision
  collisionDetection() {
    let hasCollided = false
    this.shapeArray.forEach((xCells, i) => xCells.forEach((cell, j) => {
      if (!(!cell || this.y + i < 0) && (cell === true && (this.y + i === 19 || cells[this.x + j][this.y + i + 1].hasTetromino))) {
        hasCollided = true 
        hardFall = false
      }
    }))
    if (hasCollided) {
      elements.collision.play()
      if (this.y < 0) {
        gameOver()
      } else {
        updateScore(18)
      }
      this.shapeArray.forEach((xCells, i) => xCells.forEach((cell, j) => {
        if (cell) cells[this.x + j][this.y + i].hasTetromino = true
      }))
    }
    return hasCollided
  }

  //removes the tetromino from view
  remove() {
    this.shapeArray.forEach((xCells, i) => xCells.forEach((cell, j) => {
      if (cell && cells[this.x + j][this.y + i]) {
        cells[this.x + j][this.y + i].element.style = 'background-color: black'
      }
    }))
  }
}

const tetrominoChoices = [
  { shapeArray: [[false, false, false], [true, true, true], [false, true, false]], color: '#ff00ff' },
  { shapeArray: [[false, false, false], [true, true, true], [false, false, true]], color: '#00ff00' },
  { shapeArray: [[false, false, false], [true, true, true], [true, false, false]], color: '#0066ff' },
  { shapeArray: [[false, false, false], [true, true, false], [false, true, true]], color: '#ff0000' },
  { shapeArray: [[false, false, false], [false, true, true], [true, true, false]], color: '#ff9900' },
  { shapeArray: [[false, false, false, false], [false, false, false, false], [true, true, true, true], [false, false, false, false]], color: '#66ffff' },
  { shapeArray: [[true, true], [true, true]], color: '#9900cc' }
]

const cells = []
const nextCells = []
const holdCells = []
let level = 0
let score = 0
let highScores = JSON.parse(localStorage.getItem('highScores')) || []
let highScore
let linesCleared = 0
let isGameOver = false
let r = Math.floor(Math.random() * 7)
let r2 = Math.floor(Math.random() * 7)
let tetrominos = [new Tetromino(tetrominoChoices[r].shapeArray, tetrominoChoices[r].color), new Tetromino(tetrominoChoices[r2].shapeArray, tetrominoChoices[r2].color)]
let currentTetromino = 0
let speed = 750
let softFall = false
let hardFall = false
let heldT
let isPaused = false
let songPlaying = true


smallDisplay(elements.next, nextCells)
smallDisplay(elements.hold, holdCells)

if (highScores[0].score) {
  highScore = highScores[0].score
} else {
  highScore = 0
}
elements.highScore.innerHTML = highScore

for (let x = 0; x < 10; x++) {
  const tempArray = []
  for (let y = 0; y < 20; y++) {
    const cellDiv = document.createElement('div')
    cellDiv.classList.add('cell')
    elements.gameScreen.appendChild(cellDiv)
    const cell = {
      hasTetromino: false,
      element: cellDiv,
      color: 'black',
    }
    tempArray.push(cell)
  }
  cells.push(tempArray)
}
elements.song.loop = true

function smallDisplay(div, array) { 
  for (let x = 0; x < 4; x++) {
    const tempArray = []
    for (let y = 0; y < 4; y++) {
      const cellDiv = document.createElement('div')
      cellDiv.classList.add('small-display-cell')
      div.appendChild(cellDiv)
      const cell = {
        element: cellDiv,
        color: 'black',
      }
      tempArray.push(cell)
    }
    array.push(tempArray)
  }
}

function playGame() {
  if (!isGameOver && !isPaused) {
    const newTet = tetrominos[currentTetromino].drop()
    if (newTet) {
      r = Math.floor(Math.random() * 7)
      tetrominos.push(new Tetromino(tetrominoChoices[r].shapeArray, tetrominoChoices[r].color))
      checkTetris()
      currentTetromino++
    }
    tetrominos[currentTetromino + 1].displaySmall(nextCells)
    if (hardFall) {
      playGame() 
    } else if (softFall) {
      setTimeout(() => {
        playGame()
      }, 50) 
    } else {
      setTimeout(() => {
        playGame()
      }, speed) 
    }
  }
}

//key Bindings
document.addEventListener('keydown', e => {
  const key = e.key
  if (!isGameOver && !isPaused) {
    if (key === 'x') {
      tetrominos[currentTetromino].rotate(true)
      tetrominos[currentTetromino].display()
    } else if (key === 'z') {
      tetrominos[currentTetromino].rotate(false)
      tetrominos[currentTetromino].display()
    } else if (key === 'ArrowLeft') {
      tetrominos[currentTetromino].moveSideways(-1)
      tetrominos[currentTetromino].display()
    } else if (key === 'ArrowRight') {
      tetrominos[currentTetromino].moveSideways(1)
      tetrominos[currentTetromino].display()
    } else if (key === 'ArrowDown') {
      softFall = true
    } else if (key === ' ') {
      if (!hardFall) hardFall = true
    } else if (key === 'ArrowUp') {
      holdTetromino()
    }
  }
  if (key === 'p') {
    if (isPaused) {
      isPaused = false
      elements.pauseOverlay.style.display = 'none'
      elements.settingsOverlay.style.display = 'none'
      playGame()
    } else {
      elements.pauseOverlay.style.display = 'flex'
      isPaused = true
    }
  } 
})

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowDown') {
    softFall = false
  } 
})

function checkTetris() {
  let tetrisCount = 0
  for (let y = 0; y < 20; y++) {
    const row = []
    for (let x = 0; x < 10; x++) {
      if (cells[x][y].hasTetromino) {
        row.push(true)
      } else {
        row.push(false)
      }
    } 
    if (row.every(e => e === true)) {
      tetrisCount++
      removeRow(y)
    }
  }
  switch (tetrisCount) {
    case 1: updateScore(40); break
    case 2: updateScore(100); break
    case 3: updateScore(300); break
    case 4: updateScore(1200); break
  }
  if (tetrisCount > 0) {
    elements.removeRow.play()
  }
  linesCleared += tetrisCount
  elements.linesCleared.innerHTML = linesCleared
  levelCheck()
}

function removeRow(y) {
  for (let x = 0; x < 10; x++) {
    for (let i = y; i > 0; i--) {
      const tempCell = cells[x][i - 1]
      cells[x][i].hasTetromino = tempCell.hasTetromino
      if (tempCell.hasTetromino) {
        cells[x][i].color = tempCell.color
        cells[x][i].element.style = `background-color: ${tempCell.color};`
      } else {
        cells[x][i].color = 'black'
        cells[x][i].element.style = 'background-color: black'
      }
    }
  }
}

function updateScore(points) {
  score += (level + 1) * points
  elements.score.innerHTML = score
}

function levelCheck() {
  if (linesCleared >= ((level + 1) * 10)) {
    level++
    elements.level.innerHTML = level
    speed *= 0.8
  }
}

function addNewScore(name) {
  const newScore = { name: name, score: score }
  highScores.push(newScore)
  highScores.sort((a, b) => b.score - a.score)
  localStorage.setItem('highScores', JSON.stringify(highScores))
  for (let i = 0; i < 5; i++) {
    if (highScores[i]) {
      let whiteSpace = ' '
      for (let j = 0; j < (20 - highScores[i].length); j++) {
        whiteSpace = whiteSpace + ' '
      }
      const element = document.getElementById(i + 1).children
      element[1].innerHTML = highScores[i].name
      element[2].innerHTML = highScores[i].score
    }
  }
}

function holdTetromino() {
  if (heldT) {
    const tempT = tetrominos[currentTetromino]
    tetrominos[currentTetromino] = heldT
    heldT = tempT
  } else {
    heldT = tetrominos[currentTetromino]
    tetrominos[currentTetromino] = tetrominos[currentTetromino + 1]
    const r = Math.floor(Math.random() * 7)
    tetrominos[currentTetromino + 1] = new Tetromino(tetrominoChoices[r].shapeArray, tetrominoChoices[r].color)
    tetrominos[currentTetromino + 1].displaySmall(nextCells)
  }
  heldT.remove()
  heldT.x === 2 ? heldT.x = 4 : heldT.x = 3
  heldT.y = 0 - heldT.width
  heldT.displaySmall(holdCells)
  
}

function gameOver() {
  isGameOver = true
  elements.enterNameOverlay.style.display = 'flex'
  elements.song.pause()
}



//resets and/or starts a new game
function newGame() {
  level = 0
  score = 0
  highScores = JSON.parse(localStorage.getItem('highScores')) || []
  highScore
  linesCleared = 0
  isGameOver = false
  isPaused = false
  r = Math.floor(Math.random() * 7)
  r2 = Math.floor(Math.random() * 7)
  tetrominos = [new Tetromino(tetrominoChoices[r].shapeArray, tetrominoChoices[r].color), new Tetromino(tetrominoChoices[r2].shapeArray, tetrominoChoices[r2].color)]
  currentTetromino = 0
  speed = 750
  softFall = false
  hardFall = false
  heldT = undefined
  songPlaying = elements.musicOnOff.checked
  elements.score.innerHTML = score 
  elements.linesCleared.innerHTML = linesCleared
  if (songPlaying) {
    elements.song.play()
  }

  cells.forEach((xCells) => xCells.forEach((cell) => {
    cell.hasTetromino = false
    cell.element.style = 'background-color: black'
    cell.color = 'black'
  }))
  nextCells.forEach((xCells) => xCells.forEach(cell => {
    cell.element.style = 'background-color: black'
    cell.color = 'black'
  }))
  holdCells.forEach(xCells => xCells.forEach(cell => {
    cell.element.style = 'background-color: black'
    cell.color = 'black'
  }))
  playGame()
}

//All event listeners
elements.enterNameForm.onsubmit = (event) => {
  event.preventDefault()
  addNewScore(elements.enterNameInput.value)
  elements.enterNameOverlay.style.display = 'none'
  elements.highScoresOverlay.style.display = 'flex'
}

elements.newGameButtons.forEach(e => e.addEventListener('click', () => {
  newGame()
  elements.highScoresOverlay.style.display = 'none'
  elements.mainMenuOverlay.style.display = 'none'
}))

elements.mainMenuButton.addEventListener('click', () => {
  elements.pauseOverlay.style.display = 'none'
  elements.mainMenuOverlay.style.display = 'flex'
  elements.song.pause()
  isPaused = false
})

elements.settingsButtons.forEach(e => e.addEventListener('click', () => {
  console.log('clicked')
  elements.settingsOverlay.style.display = 'flex'
  elements.pauseOverlay.style.display = 'none'
}))

elements.musicVolume.addEventListener('change', () => {
  elements.song.volume = elements.musicVolume.value
})

elements.sfxVolume.addEventListener('change', () => {
  elements.collision.volume = elements.sfxVolume.value
  elements.removeRow.volume = elements.sfxVolume.value
})

elements.musicOnOff.addEventListener('change', () => {
  songPlaying = elements.musicOnOff.checked
  if (songPlaying) {
    elements.song.play()
  } else {
    elements.song.pause()
  }
})

elements.exitSettingButton.addEventListener('click', () => {
  elements.settingsOverlay.style.display = 'none'
  if (isPaused) {
    elements.pauseOverlay.style.display = 'flex'
  }
})