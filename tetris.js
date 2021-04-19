const elements = {
  gameScreen: document.querySelector('#game-screen'),
  score: document.querySelector('#score'),
  level: document.querySelector('#level'),
  next: document.querySelector('#next-tetromino'),
}

class Tetromino {
  constructor(shape, color) {
    this.width = shape.length
    this.shape = shape
    this.color = color
    this.x = 3
    this.y = 0 - this.width
  }

  display() {
    this.shape.forEach((e, i) => e.forEach((e2, j) => {
      if (e2 && (this.y + i >= 0)) {
        cells[this.x + j][this.y + i].color = this.color
        cells[this.x + j][this.y + i].div.style = 'background-color: ' + this.color
      } else if (!(this.y + i > 19) && (this.y + i >= 0) && cells[this.x + j] && !cells[this.x + j][this.y + i].hasTetromino) {
        cells[this.x + j][this.y + i].div.style = 'background-color: black'
      }
    }))
  }
  
  displayNext() {
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (x < this.width && y < this.width && this.shape[x][y]) {
          nextCells[x][y].color = this.color
          nextCells[x][y].div.style = 'background-color: ' + this.color
        } else {
          nextCells[x][y].div.style = 'background-color: black'
        }
      }
    }
  }

  drop() {
    if (this.collisionDetection()) {
      return true
    }
    this.shape.forEach((e, i) => e.forEach((e2, j) => {
      if (!e2 && (!cells[this.x + j])) {
        console.log(cells[this.x + j])
      } else if ((this.y + i >= 0) && !cells[this.x + j][this.y + i].hasTetromino) {
        cells[this.x + j][this.y + i].div.style = 'background-color: black'
      }
    }))
    this.y++
    this.display()
    return false
  }

  moveSideways(direction) {
    let canMove = true
    this.shape.forEach((e, i) => e.forEach((e2, j) => {
      if ((e2 && (!cells[this.x + j + direction][this.y + i + direction] || 
        cells[this.x + j + direction][this.y + i + direction].hasTetromino) )) {
        canMove = false
      } 
    }))
    if (canMove) {
      this.shape.forEach((e, i) => e.forEach((e2, j) => {
        if (cells[this.x + j] && !cells[this.x + j][this.y + i].hasTetromino) {
          cells[this.x + j][this.y + i].div.style = 'background-color: black'
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
      this.shape.forEach((e, i) => e.forEach((e2, j) => {
        if (i + this.x >= 10) {
          this.moveSideways(-1)
        } else if (i + this.x <= 0) {
          this.moveSideways(1)
        }
        newShape[j].unshift(this.shape[i][j])
      }))
    } else {
      this.shape.forEach((e, i) => e.forEach((e2, j) => {
        if (e2 && i + this.x >= 10) {
          this.moveSideways(-1)
        } else if (e2 && i + this.x < 0) {
          this.moveSideways(1)
        }
        newShape[this.width - 1 - j].push(this.shape[i][j])
      }))
    }
    this.shape = newShape
  }

  collisionDetection() {
    let hasCollided = false
    this.shape.forEach((e, i) => {
      e.forEach((e2, j) => {
        if (!(!e2 || this.y + i < 0) && (e2 === true && (this.y + i === 19 || cells[this.x + j][this.y + i + 1].hasTetromino))) {
          hasCollided = true 
          hardFall = false
        }
      })
    })
    if (hasCollided) {
      if (this.y < 0) {
        this.gameOver()
      } else {
        updateScore(18)
      }
      this.shape.forEach((e, i) => {
        e.forEach((e2, j) => {
          if (e2) {
            cells[this.x + j][this.y + i].hasTetromino = true
          }
        })
      })
    }
    return hasCollided
  }

  gameOver() {
    gameOver = true
    alert(`GAME OVER!\nYou scored ${score} points`)
  }
}

const tetrominoChoices = [
  { shape: [[false, false, false], [true, true, true], [false, true, false]], color: '#ff00ff' },
  { shape: [[false, false, false], [true, true, true], [false, false, true]], color: '#00ff00' },
  { shape: [[false, false, false], [true, true, true], [true, false, false]], color: '#0066ff' },
  { shape: [[false, false, false], [true, true, false], [false, true, true]], color: '#ff0000' },
  { shape: [[false, false, false], [false, true, true], [true, true, false]], color: '#ff9900' },
  { shape: [[false, false, false, false], [false, false, false, false], [true, true, true, true], [false, false, false, false]], color: '#66ffff' },
  { shape: [[true, true], [true, true]], color: '#9900cc' }
]

const cells = []
const nextCells = []
let level = 0
let score = 0
let linesCleared = 0
let gameOver = false
let r = Math.floor(Math.random() * 7)
const r2 = Math.floor(Math.random() * 7)
const tetrominos = [new Tetromino(tetrominoChoices[r].shape, tetrominoChoices[r].color), new Tetromino(tetrominoChoices[r2].shape, tetrominoChoices[r2].color)]
let currentTetromino = 0
let speed = 750
let softFall = false
let hardFall = false

for (let x = 0; x < 10; x++) {
  const tempArray = []
  for (let y = 0; y < 20; y++) {
    const cellDiv = document.createElement('div')
    cellDiv.classList.add('cell')
    elements.gameScreen.appendChild(cellDiv)
    const cell = {
      hasTetromino: false,
      div: cellDiv,
      color: 'black',
    }
    tempArray.push(cell)
  }
  cells.push(tempArray)
}

for (let x = 0; x < 4; x++) {
  const tempArray = []
  for (let y = 0; y < 4; y++) {
    const cellDiv = document.createElement('div')
    cellDiv.classList.add('next-cell')
    elements.next.appendChild(cellDiv)
    const cell = {
      div: cellDiv,
      color: 'black',
    }
    tempArray.push(cell)
  }
  nextCells.push(tempArray)
}

function playGame() {
  if (!gameOver) {
    const newTet = tetrominos[currentTetromino].drop()
    if (newTet) {
      r = Math.floor(Math.random() * 7)
      tetrominos.push(new Tetromino(tetrominoChoices[r].shape, tetrominoChoices[r].color))
      checkTetris()
      currentTetromino++
    }
    tetrominos[currentTetromino + 1].displayNext()
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
        cells[x][i].div.style = 'background-color: ' + tempCell.color
      } else {
        cells[x][i].color = 'black'
        cells[x][i].div.style = 'background-color: black'
      }
    }
  }
}

function updateScore(points) {
  score += (level + 1) * points
  elements.score.innerHTML = score
}

function levelCheck() {
  console.log(linesCleared)
  if (linesCleared >= ((level + 1) * 10)) {
    level++
    //linesCleared -= (level * 10)
    elements.level.innerHTML = level
    speed *= 0.8
  }
}

playGame()