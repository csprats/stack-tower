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
let scrollCounter, cameraY, current, mode, xSpeed, ySpeed

function updateCamera() {
  if (scrollCounter > 0) {
    cameraY++
    scrollCounter--
  }
}

function initializeGameState() {
  boxes = [{
    x: canvas.width / 2 - initial_box_width / 2,
    y: 200,
    width: initial_box_width,
    color: 'black',
  }]

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

  if (mode === modes.BOUNCE) {
    moveAndDetectCollision()
  } else if (mode = modes.FALL) {
    updateFallMode()
  }

  requestAnimationFrame(draw)
}

function drawBackground() {
  ctx.fillStyle = '#eee'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawBoxes() {
  boxes.forEach((box) => {
    const { x, y, width, color } = box
    const newY = initial_box_y - y

    ctx.fillStyle = color
    ctx.fillRect(x, newY, width, box_height)
  })
}

function createNewBox() {
  boxes[current] = {
    x: 0,
    y: (current + 10) * box_height,
    width: boxes[current - 1].width,
    color: 'black'
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

function hadleBoxLanding() {
  const currentBox = boxes[current]
  const previousBox = boxes[current -1]

  const difference = currentBox.x - previousBox.x

  if (Math.abs(difference) > currentBox.width) {
    mode = modes.GAMEOVER
    return
  }

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

restart()