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
    this.shapeArray.nestedForEach((cell, i, j) => {
      if (cell && (this.y + i >= 0)) {
        cells[this.x + j][this.y + i].color = this.color
        cells[this.x + j][this.y + i].element.style = `background-color: ${this.color};`
      } else if (!(this.y + i > 19) && (this.y + i >= 0) && cells[this.x + j] && !cells[this.x + j][this.y + i].hasTetromino) {
        cells[this.x + j][this.y + i].element.style = 'background-color: black'
      }
    })
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
    this.shapeArray.nestedForEach((cell, i, j) => {
      if (!cell && (this.x + j > 9 || this.x + j < 0)) {
        //console.log(cells[this.x + j])
      } else if ((this.y + i >= 0) && !cells[this.x + j][this.y + i].hasTetromino) {
        cells[this.x + j][this.y + i].element.style = 'background-color: black'
      }
    })
    this.y++
    this.display()
    return false
  }
  //Moves Tetromino left or right is possible
  moveSideways(direction) {
    let canMove = true
    this.shapeArray.nestedForEach((cell, i, j) => {
      if (cell && (this.y + i > 0 && !cells[this.x + j + direction] || 
        (!cells[this.x + j + direction][this.y + i] || 
          cells[this.x + j + direction][this.y + i].hasTetromino) )) {
        canMove = false
      } 
      if (cell && this.y + i < 0) {
        canMove = true
      }
    })
    
    if (canMove) {
      this.shapeArray.nestedForEach((cell, i, j) => {
        if (this.y + i >= 0 && cell && cells[this.x + j] && !cells[this.x + j][this.y + i].hasTetromino) {
          cells[this.x + j][this.y + i].element.style = 'background-color: black'
        }
      })
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
      this.shapeArray.nestedForEach((cell, i, j) => {
        if (cell && j + this.y >= 19 || (this.y + (this.width - 1 - i) > 0 && cells[this.x + j] && cells[this.x + j][this.y + (this.width - 1 - i)].hasTetromino)) {
          canRotate = false
        } else if (cell && i + this.x >= 10) {
          this.moveSideways(-1)
        } else if (cell && i + this.x < 0) {
          this.moveSideways(1)
        }
        newShape[j].unshift(this.shapeArray[i][j])
      })
    } else {
      this.shapeArray.nestedForEach((cell, i, j) => {
        if (cell && j + this.y >= 19 || (this.y + i > 0 && cells[this.width - 1 - j + this.x] && cells[this.width - 1 - j + this.x][this.y + i].hasTetromino)) {
          canRotate = false
        } else if (cell && i + this.x >= 10) {
          this.moveSideways(-1)
        } else if (cell && i + this.x < 0) {
          this.moveSideways(1)
        }
        newShape[this.width - 1 - j].push(this.shapeArray[i][j])
      })
    }
    if (canRotate) {
      this.shapeArray = newShape
    }
  }
  //Checks for a collision
  collisionDetection() {
    let hasCollided = false
    this.shapeArray.nestedForEach((cell, i, j) => {
      if (!(!cell || this.y + i < 0) && (cell === true && (this.y + i === 19 || cells[this.x + j][this.y + i + 1].hasTetromino))) {
        hasCollided = true 
        gameData.hardFall = false
      }
    })
    if (hasCollided) {
      elements.collision.play()
      if (this.y < 0) {
        gameOver()
      } else {
        updateScore(18)
      }
      this.shapeArray.nestedForEach((cell, i, j) => {
        if (cell) cells[this.x + j][this.y + i].hasTetromino = true
      })
    }
    return hasCollided
  }

  //removes the tetromino from view
  remove() {
    this.shapeArray.nestedForEach((cell, i, j) => {
      if (cell && cells[this.x + j][this.y + i]) {
        cells[this.x + j][this.y + i].element.style = 'background-color: black'
      }
    })
  }
}

//Array callback function - A double forEach loop for nested arrays
Array.prototype.nestedForEach = function(callback) {
  this.forEach((e, i) => e.forEach((e2, j) => {
    return callback(this[i][j], i, j)
  }))
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
const gameData = {}
let atMainMenu = true
elements.song.loop = true

smallDisplay(elements.next, nextCells)
smallDisplay(elements.hold, holdCells)

//resets and/or starts a new game
function newGame() {
  gameData.level = 0
  gameData.score = 0
  if (localStorage) {
    gameData.highScores = JSON.parse(localStorage.getItem('highScores')) || []
  } 
  gameData.highScore = gameData.highScores[0] || 0
  gameData.linesCleared = 0
  gameData.isGameOver = false
  gameData.isPaused = false
  gameData.r = Math.floor(Math.random() * 7)
  const r2 = Math.floor(Math.random() * 7)
  gameData.tetrominos = [new Tetromino(tetrominoChoices[gameData.r].shapeArray, tetrominoChoices[gameData.r].color), new Tetromino(tetrominoChoices[r2].shapeArray, tetrominoChoices[r2].color)]
  gameData.currentTetromino = 0
  gameData.speed = 750
  gameData.softFall = false
  gameData.hardFall = false
  gameData.heldT = undefined
  gameData.songPlaying = elements.musicOnOff.checked
  elements.score.innerHTML = gameData.score 
  elements.linesCleared.innerHTML = gameData.linesCleared
  atMainMenu = false
  if (gameData.songPlaying) {
    elements.song.play()
  }

  cells.nestedForEach(cell => {
    cell.hasTetromino = false
    cell.element.style = 'background-color: black'
    cell.color = 'black'
  })
  nextCells.nestedForEach(cell => {
    cell.element.style = 'background-color: black'
    cell.color = 'black'
  })
  holdCells.nestedForEach(cell => {
    cell.element.style = 'background-color: black'
    cell.color = 'black'
  })
  playGame()
}

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
  if (!gameData.isGameOver && !gameData.isPaused) {
    const newTet = gameData.tetrominos[gameData.currentTetromino].drop()
    if (newTet) {
      gameData.r = Math.floor(Math.random() * 7)
      gameData.tetrominos.push(new Tetromino(tetrominoChoices[gameData.r].shapeArray, tetrominoChoices[gameData.r].color))
      checkTetris()
      gameData.currentTetromino++
    }
    gameData.tetrominos[gameData.currentTetromino + 1].displaySmall(nextCells)
    if (gameData.hardFall) {
      playGame() 
    } else if (gameData.softFall) {
      setTimeout(() => {
        playGame()
      }, 50) 
    } else {
      setTimeout(() => {
        playGame()
      }, gameData.speed) 
    }
  }
}

//key Bindings
document.addEventListener('keydown', e => {
  const key = e.key
  if (!gameData.isGameOver && !gameData.isPaused) {
    if (key === 'x') {
      gameData.tetrominos[gameData.currentTetromino].rotate(true)
      gameData.tetrominos[gameData.currentTetromino].display()
    } else if (key === 'z') {
      gameData.tetrominos[gameData.currentTetromino].rotate(false)
      gameData.tetrominos[gameData.currentTetromino].display()
    } else if (key === 'ArrowLeft') {
      gameData.tetrominos[gameData.currentTetromino].moveSideways(-1)
      gameData.tetrominos[gameData.currentTetromino].display()
    } else if (key === 'ArrowRight') {
      gameData.tetrominos[gameData.currentTetromino].moveSideways(1)
      gameData.tetrominos[gameData.currentTetromino].display()
    } else if (key === 'ArrowDown') {
      gameData.softFall = true
    } else if (key === ' ') {
      if (!gameData.hardFall) gameData.hardFall = true
    } else if (key === 'ArrowUp') {
      holdTetromino()
    }
  }
  if (key === 'p') {
    if (gameData.isPaused || atMainMenu) {
      gameData.isPaused = false
      elements.pauseOverlay.style.display = 'none'
      elements.settingsOverlay.style.display = 'none'
      playGame()
    } else {
      elements.pauseOverlay.style.display = 'flex'
      gameData.isPaused = true
    }
  } 
})

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowDown') {
    gameData.softFall = false
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
  gameData.linesCleared += tetrisCount
  elements.linesCleared.innerHTML = gameData.linesCleared
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
  gameData.score += (gameData.level + 1) * points
  elements.score.innerHTML = gameData.score
}

function levelCheck() {
  if (gameData.linesCleared >= ((gameData.level + 1) * 10)) {
    gameData.level++
    elements.level.innerHTML = gameData.level
    gameData.speed *= 0.8
  }
}

function addNewScore(name) {
  const newScore = { name: name, score: gameData.score }
  gameData.highScores.push(newScore)
  gameData.highScores.sort((playerA, playerB) => playerB.score - playerA.score)
  if (localStorage) {
    localStorage.setItem('highScores', JSON.stringify(gameData.highScores))
  }
  const output = gameData.highScores.map((player, i) => {
    if (i < 5) return `<li>${i + 1}.<span>${player.name}</span><span>${player.score}</span></li>`
  })
  elements.highScoresList.innerHTML = output.join('')
}

function holdTetromino() {
  if (gameData.heldT) {
    const tempT = gameData.tetrominos[gameData.currentTetromino]
    gameData.tetrominos[gameData.currentTetromino] = gameData.heldT
    gameData.heldT = tempT
  } else {
    gameData.heldT = gameData.tetrominos[gameData.currentTetromino]
    gameData.tetrominos[gameData.currentTetromino] = gameData.tetrominos[gameData.currentTetromino + 1]
    const r = Math.floor(Math.random() * 7)
    gameData.tetrominos[gameData.currentTetromino + 1] = new Tetromino(tetrominoChoices[r].shapeArray, tetrominoChoices[r].color)
    gameData.tetrominos[gameData.currentTetromino + 1].displaySmall(nextCells)
  }
  gameData.heldT.remove()
  gameData.heldT.x === 2 ? gameData.heldT.x = 4 : gameData.heldT.x = 3
  gameData.heldT.y = 0 - gameData.heldT.width
  gameData.heldT.displaySmall(holdCells)
  
}

function gameOver() {
  gameData.isGameOver = true
  elements.enterNameOverlay.style.display = 'flex'
  elements.song.pause()
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
  gameData.isPaused = false
  atMainMenu = true
})

elements.settingsButtons.forEach(e => e.addEventListener('click', () => {
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
  gameData.songPlaying = elements.musicOnOff.checked
  if (gameData.songPlaying) {
    elements.song.play()
  } else {
    elements.song.pause()
  }
})

elements.exitSettingButton.addEventListener('click', () => {
  elements.settingsOverlay.style.display = 'none'
  if (gameData.isPaused) {
    elements.pauseOverlay.style.display = 'flex'
  }
})