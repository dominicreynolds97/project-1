const elements = {
  gameScreen: document.querySelector('#game-screen'),
  score: document.querySelector('#score'),
}

class Tetromino {
  constructor(shape, color) {
    this.width = shape.length
    this.shape = shape
    this.color = color
    this.x = 3
    this.y = 0
  }

  display() {
    this.shape.forEach((e, i) => e.forEach((e2, j) => {
      if (e2) {
        cells[this.x + j][this.y + i].color = this.color
        cells[this.x + j][this.y + i].div.style = 'background-color: ' + this.color
      } else if (cells[this.x + j] && !cells[this.x + j][this.y + i].hasTetromino) {
        cells[this.x + j][this.y + i].div.style = 'background-color: black'
      }
    }))
  }
  
  drop() {
    if (this.collisionDetection()) {
      return true
    }
    this.shape.forEach((e, i) => e.forEach((e2, j) => {
      if (!e2 && (!cells[this.x + j])) {
        console.log(cells[this.x + j])
      } else if (!cells[this.x + j][this.y + i].hasTetromino) {
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
    console.log(canMove)
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
        newShape[j].unshift(this.shape[i][j])
      }))
    } else {
      this.shape.forEach((e, i) => e.forEach((e2, j) => {
        newShape[this.width - 1 - j].push(this.shape[i][j])
      }))
    }
    this.shape = newShape
  }

  collisionDetection() {
    let hasCollided = false
    this.shape.forEach((e, i) => {
      e.forEach((e2, j) => {
        if (e2 === true && (this.y + i === 19 || cells[this.x + j][this.y + i + 1].hasTetromino)) {
          hasCollided = true
        }
      })
    })
    if (hasCollided) {
      updateScore(18)
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
const round = 1
let score = 0

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
    cellDiv.addEventListener('click', () => {
      console.dir(cell)
    })
    tempArray.push(cell)
  }
  cells.push(tempArray)
}

let num = Math.floor(Math.random() * 7)
const tetrominos = [new Tetromino(tetrominoChoices[num].shape, tetrominoChoices[num].color)]
let currentTetromino = 0


setInterval(() => {
  const newTet = tetrominos[currentTetromino].drop()
  if (newTet) {
    checkTetris()
    num = Math.floor(Math.random() * 7)
    tetrominos.push(new Tetromino(tetrominoChoices[num].shape, tetrominoChoices[num].color))
    
    currentTetromino++
  }
}, 500)

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
      console.log('tetris')
      tetrisCount++
      // cells.forEach((e, i) =>  {
      //   cells[i][y].div.style = 'background-color: black'
      //   cells[i][y].hasTetromino = false
      // })
      removeRow(y)
    }
  }
  switch (tetrisCount) {
    case 1: updateScore(40); break
    case 2: updateScore(100); break
    case 3: updateScore(300); break
    case 4: updateScore(1200); break
  }
}

function removeRow(y) {
  // const pivotedArray = []
  // for (let i = 0; i < 20; i++) {
  //   pivotedArray.push([])
  // }
  // cells.forEach((e) => {
  //   e.forEach((e2, j) => {
  //     pivotedArray[j].push(e2)
  //   })
  // })
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
  console.dir(cells)
  // pivotedArray.splice(y, 1)
  // pivotedArray.unshift(newRow)
  // const newCells = []
  // for (let i = 0; i < 10; i++) {
  //   newCells.push([])
  // }
  // pivotedArray.forEach((e, i) => {
  //   e.forEach((e2, j) => {
  //     cells[j][i] = e2
  //   })
    
  // })
  // console.dir(newCells)
  // cells = newCells
}

function updateScore(points) {
  score += round * points
  elements.score.innerHTML = score
}