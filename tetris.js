const elements = {
  gameScreen: document.querySelector('#game-screen'),
  score: document.querySelector('#score'),
  highScore: document.querySelector('#high-score'),
  level: document.querySelector('#level'),
  next: document.querySelector('#next-tetromino'),
  hold: document.querySelector('#hold-tetromino'),
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
        cells[this.x + j][this.y + i].element.style = `background-color: ${this.color}; box-shadow: inset 0 0 0px 1px darkgrey;`
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
          array[x][y].element.style = `background-color: ${this.color}; box-shadow: inset 0 0 0px 1px darkgrey;`
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
      if (!cell && (!cells[this.x + j])) {
        console.log(cells[this.x + j])
      } else if ((this.y + i >= 0) && !cells[this.x + j][this.y + i].hasTetromino) {
        cells[this.x + j][this.y + i].element.style = 'background-color: black'
      }
    }))
    this.y++
    this.display()
    return false
  }

  moveSideways(direction) {
    let canMove = true
    this.shapeArray.forEach((xCells, i) => xCells.forEach((cell, j) => {
      if (this.y + i <= 0 && this.x + j > 0 && this.x + j < 9) {
        canMove = true
      } else if ((cell && (!cells[this.x + j + direction][this.y + i + direction] || 
        cells[this.x + j + direction][this.y + i + direction].hasTetromino) )) {
        canMove = false
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

  rotate(isClockwise) {
    const newShape = []
    for (let i = 0; i < this.width; i++) {
      newShape.push([])
    }
    if (isClockwise) {
      this.shapeArray.forEach((xCells, i) => xCells.forEach((cell, j) => {
        if (i + this.x >= 10) {
          this.moveSideways(-1)
        } else if (i + this.x <= 0) {
          this.moveSideways(1)
        }
        newShape[j].unshift(this.shapeArray[i][j])
      }))
    } else {
      this.shapeArray.forEach((xCells, i) => xCells.forEach((cell, j) => {
        if (cell && i + this.x >= 10) {
          this.moveSideways(-1)
        } else if (cell && i + this.x < 0) {
          this.moveSideways(1)
        }
        newShape[this.width - 1 - j].push(this.shapeArray[i][j])
      }))
    }
    this.shapeArray = newShape
  }

  collisionDetection() {
    let hasCollided = false
    this.shapeArray.forEach((xCells, i) => xCells.forEach((cell, j) => {
      if (!(!cell || this.y + i < 0) && (cell === true && (this.y + i === 19 || cells[this.x + j][this.y + i + 1].hasTetromino))) {
        hasCollided = true 
        hardFall = false
      }
    }))
    if (hasCollided) {
      if (this.y < 0) {
        this.gameOver()
      } else {
        updateScore(18)
      }
      this.shapeArray.forEach((xCells, i) => xCells.forEach((cell, j) => {
        if (cell) cells[this.x + j][this.y + i].hasTetromino = true
      }))
    }
    return hasCollided
  }

  gameOver() {
    gameOver = true
    if (checkHighScore()) {
      alert(`You beat the high score!\nYou scored ${score} points`)
    } else {
      alert(`GAME OVER!\nYou scored ${score} points`)
    }
  }

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
let highScore = localStorage.getItem('highScore')
let linesCleared = 0
let gameOver = false
let r = Math.floor(Math.random() * 7)
const r2 = Math.floor(Math.random() * 7)
const tetrominos = [new Tetromino(tetrominoChoices[r].shapeArray, tetrominoChoices[r].color), new Tetromino(tetrominoChoices[r2].shapeArray, tetrominoChoices[r2].color)]
let currentTetromino = 0
let speed = 750
let softFall = false
let hardFall = false
let heldT

smallDisplay(elements.next, nextCells)
smallDisplay(elements.hold, holdCells)

if (!highScore) {
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
  if (!gameOver) {
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


document.addEventListener('keydown', e => {
  const key = e.key
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
  linesCleared += tetrisCount
  levelCheck()
}

function removeRow(y) {
  for (let x = 0; x < 10; x++) {
    for (let i = y; i > 0; i--) {
      const tempCell = cells[x][i - 1]
      cells[x][i].hasTetromino = tempCell.hasTetromino
      if (tempCell.hasTetromino) {
        cells[x][i].color = tempCell.color
        cells[x][i].element.style = `background-color: ${tempCell.color}; box-shadow: inset 0 0 0px 1px darkgrey;`
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

function checkHighScore() {
  if (score > highScore) {
    highScore = score
    localStorage.setItem('highScore', highScore)
    elements.highScore.innerHTML = highScore
    return true
  }
  return false
}

function holdTetromino() {
  if (heldT) {
    const tempT = tetrominos[currentTetromino]
    tetrominos[currentTetromino] = heldT
    heldT = tempT
    console.log('held')
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

playGame()