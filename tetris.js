const elements = {
  gameScreen: document.querySelector('#game-screen'),
}

class Tetromino {
  constructor(shape, color) {
    this.width = shape.length
    this.shape = shape
    this.color = color
  }
  display(x, y) {
    this.shape.forEach((e, i) => {
      e.forEach((e2, j) => {
        const currentCell = cells[x + j][y + i]
        if (e2) {
          currentCell.div.style = 'background-color: ' + this.color
        } else {
          currentCell.div.style = 'background-color: black'
        }
      })
    })
  }

  rotate(direction) {
    const newShape = [[],[],[]]
    if (this.width === 4) {
      newShape.push([])
    }
    if (direction === 0) {
      this.shape.forEach((e, i) => e.forEach((e2, j) => newShape[j].unshift(this.shape[i][j])))
    } else {
      this.shape.forEach((e, i) => e.forEach((e2, j) => newShape[this.width - 1 - j].push(this.shape[i][j])))
    }
    this.shape = newShape
  }
}

const tetrominos = [
  { shape: [[false, false, false], [true, true, true], [false, true, false]], color: '#ff00ff' },
  { shape: [[false, false, false], [true, true, true], [false, false, true]], color: '#00ff00' },
  { shape: [[false, false, false], [true, true, true], [true, false, false]], color: '#0066ff' },
  { shape: [[false, false, false], [true, true, false], [false, true, true]], color: '#ff0000' },
  { shape: [[false, false, false], [false, true, true], [true, true, false]], color: '#ff9900' },
  { shape: [[false, false, false, false], [false, false, false, false], [true, true, true, true], [false, false, false, false]], color: '#66ffff' },
  { shape: [[false, false, false, false], [false, true, true, false], [false, true, true, false], [false, false, false, false]], color: '#9900cc' }
]

const cells = []

for (let x = 0; x < 10; x++) {
  const tempArray = []
  for (let y = 0; y < 20; y++) {
    const cellDiv = document.createElement('div')
    cellDiv.classList.add('cell')
    elements.gameScreen.appendChild(cellDiv)
    const cell = {
      color: 'black',
      hasTetromino: false,
      div: cellDiv,
    }
    cellDiv.addEventListener('click', () => console.log(x + ', ' + y))
    tempArray.push(cell)
  }
  cells.push(tempArray)
}
const num = Math.floor(Math.random() * 7)
const tet = new Tetromino(tetrominos[num].shape, tetrominos[num].color)



tet.display(4,4)

document.addEventListener('keydown', e => {
  const key = e.key

  if (key === 'x') {
    tet.rotate(0)
    tet.display(4,4)
  } else if (key === 'z') {
    tet.rotate(1)
    tet.display(4,4)
  }
})