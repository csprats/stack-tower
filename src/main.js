// constants

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const modes = {
  FALL: "fall",
  BOUNCE: "bounce",
  GAMEOVER: "gameover",
}

const initial_box_width = 200
const initial_box_y = 600

const box_height = 50
const initial_y_speed = 5
const initial_x_speed = 2

// state

let boxes = []
let debris = { x: 0, y: 0, width: 0 }
let scrollCounter, cameraY, current, mode, xSpeed, ySpeed

function updateCamera() {
  if (scrollCounter > 0) {
    cameraY++
    scrollCounter--  
  }
}

function createStepColor(step) {
  const red = Math.floor(Math.random() * 255)
  const green = Math.floor(Math.random() * 255)
  const blue = Math.floor(Math.random() * 255)

  return `rgb(${red}, ${green}, ${blue})`
}

function initializeGameState() {
  boxes = [{
    x: canvas.width / 2 - initial_box_width / 2,
    y: 200,
    width: initial_box_width,
    color: 'black',
  }]

  debris = { x: 0, y: 0, width: 0 }
  current = 1
  mode = modes.BOUNCE
  xSpeed = initial_x_speed
  ySpeed = initial_y_speed
  scrollCounter = 0
  cameraY = 0

  createNewBox()
}

function restart () {
  initializeGameState()
  draw()
}

function draw() {
  if (mode === modes.GAMEOVER) return

  drawBackground()
  drawBoxes()
  drawDebris()

  if (mode === modes.BOUNCE) {
    moveAndDetectCollision()
  } else if (mode = modes.FALL) {
    updateFallMode()
  }

  debris.y -= ySpeed

  updateCamera()

  requestAnimationFrame(draw)
}

function drawBackground() {
  ctx.fillStyle = '#eee'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawDebris() {
  const { x, y, width } = debris
  const newY = initial_box_y - y + cameraY

  ctx.fillStyle = boxes[current -1].color
  ctx.fillRect(x, newY, width, box_height)
}

function drawBoxes() {
  boxes.forEach((box) => {
    const { x, y, width, color } = box
    const newY = initial_box_y - y + cameraY

    ctx.fillStyle = color
    ctx.fillRect(x, newY, width, box_height)
  })
}

function createNewBox() {
  boxes[current] = {
    x: 0,
    y: (current + 10) * box_height,
    width: boxes[current - 1].width,
    color: createStepColor(current)
  }
  console.log(createStepColor(current))
}

function createNewDebris(difference) {
  const currentBox = boxes[current]
  const previousBox = boxes[current -1]

  const debrisX = currentBox.x > previousBox.x 
    ? currentBox.x + currentBox.width
    : currentBox.x
  debris = {
    x: debrisX,
    y: currentBox.y,
    width: difference
  }
}

function updateFallMode() {
  const currentBox = boxes[current]
  currentBox.y -= ySpeed

  const positionPreviousBox = boxes[current - 1].y + box_height

  if (currentBox.y === positionPreviousBox) {
    hadleBoxLanding()
  }
}

function adjustCurrentBox(difference) {
  const currentBox = boxes[current]
  const previousBox = boxes[current -1]

  if (currentBox.x > previousBox.x) {
    currentBox.width -= difference
  } else {
    currentBox.width += difference
    currentBox.x -= difference
  }
}

function gameOver() {
  ctx.fillStyle = 'rgba(255, 0, 0, 0)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fill()

  ctx.font = '20px sans-serif'
  ctx.fillStyle = 'black'
  ctx.textAlign = 'center'
  ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2)
}

function hadleBoxLanding() {
  const currentBox = boxes[current]
  const previousBox = boxes[current -1]

  const difference = currentBox.x - previousBox.x

  if (Math.abs(difference) > currentBox.width) {
    mode = modes.GAMEOVER
    gameOver()
    return
  }

  adjustCurrentBox(difference)
  createNewDebris(difference)


  xSpeed += xSpeed > 0 ? 1 : -1
  current++
  scrollCounter = box_height

  mode = modes.BOUNCE

  createNewBox()
}

function moveAndDetectCollision () {
  const currentBox = boxes[current]
  currentBox.x += xSpeed

  const isMovingRight = xSpeed > 0
  const isMovingLeft = xSpeed < 0

  const hasHitRightSide = 
    currentBox.x + currentBox.width > canvas.width

  const hasHitLeftSide = currentBox.x < 0

  if (
    (isMovingRight && hasHitRightSide) || 
    (isMovingLeft && hasHitLeftSide)
  ) {
    xSpeed *= -1
  }

  document.addEventListener('keydown', (e) => {
    if (e.key == ' ' && mode === modes.BOUNCE) {
      mode = modes.FALL
    }
  })

}

canvas.onpointerdown = () => {
  if (mode === modes.GAMEOVER) {
    restart()
  } else if (mode === modes.BOUNCE) {
    mode = modes.FALL
  }
}

restart()