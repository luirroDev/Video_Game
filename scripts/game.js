const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btn_up = document.querySelector('#up')
const btn_left = document.querySelector('#left')
const btn_rigth = document.querySelector('#rigth')
const btn_down = document.querySelector('#down')
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

window.addEventListener('load', setCanvaSize);
window.addEventListener('resize', setCanvaSize);
window.addEventListener('keyup', moveBykeys)
btn_up.addEventListener('click', moveUp);
btn_left.addEventListener('click', moveLeft);
btn_rigth.addEventListener('click', moveRight);
btn_down.addEventListener('click', moveDown);


const playerPos = {
  x: undefined,
  y: undefined,
}
const giftPosition = {
  x: undefined,
  y: undefined,
}
let canvasSize;
let elementSize;
let enemyPositions = [];
let level=0;
let lives=3;
let timeStart;

function startGame() {

  game.font = elementSize-8 + 'px Verdana'
  game.textAlign = 'end'

  if(maps[level] == undefined) {    
    gameWin();
    return;
  } 

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }
  
  const mapRows = maps[level].trim().split('\n')
  const mapRowsCols = mapRows.map(row => row.trim().split(''));
  
  showLives();

  enemyPositions = [];
  game.clearRect(0, 0, canvasSize, canvasSize)

  mapRowsCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementSize * (colI + 1);
      const posY = elementSize * (rowI + 0.8);

      if(col == 'O') {
        if (!playerPos.x && !playerPos.y) {
          playerPos.x = posX;
          playerPos.y = posY;
        }
      } else if (col == 'I') {
        giftPosition.x = posX;
        giftPosition.y = posY;        
      } else if (col == 'X') {
        enemyPositions.push({
          x: posX,
          y: posY,
        })
      }
      game.fillText(emoji, posX, posY);
    })
  })  
  movePlayer();
}
function setCanvaSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);

elementSize = canvasSize / 10;

playerPos.x = undefined;
playerPos.y = undefined;
startGame();
}

function levelFail() {
  lives--;   
  if (lives <= 0){
    level = 0;
    lives = 3;
    timeStart = 0;
  } 
  playerPos.x = undefined;
  playerPos.y = undefined;
  startGame();
}
function gameWin() {

  clearInterval(timeInterval);

  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;

  if (recordTime){
    if (recordTime > playerTime) {
      localStorage.setItem('record_time', playerTime);
      pResult.innerText = 'Haz implantado un nuevo record'
    }else {
      pResult.innerText = 'No superaste el record :(' ;
    }
  } else {
    localStorage.setItem('record_time', playerTime)    
    console.log('Tu record fue de '+ playerTime);
  }

}


function movePlayer() {

  const giftCollision = playerPos.x.toFixed(3) == giftPosition.x.toFixed(3) 
                     && playerPos.y.toFixed(3) == giftPosition.y.toFixed(3);
  
  if (giftCollision) {    
    level++;
    startGame();
  }

  const enemyCollision = enemyPositions.find(enemy => {
    return enemy.x.toFixed(3) == playerPos.x.toFixed(3) && enemy.y.toFixed(3) == playerPos.y.toFixed(3);      
  })

  if(enemyCollision) {   
    levelFail();
  }

  game.fillText(emojis['PLAYER'], playerPos.x, playerPos.y);
}
function moveBykeys(event) {
  switch (event.key) {
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowLeft':
      moveLeft();      
      break
    case 'ArrowRight':
      moveRight();      
      break
    case 'ArrowDown':
      moveDown();      
      break
    default:
      break;
  }
}
function moveUp() {
  if ((playerPos.y - elementSize) < 0 ) {
  } else {
    playerPos.y -= elementSize;
    startGame();
  }
} 
function moveRight() {
  if ((playerPos.x + elementSize) > canvasSize+1) {
  } else {
    playerPos.x += elementSize;
    startGame();
  }  
} 
function moveLeft() {      
  if ((playerPos.x - elementSize) < elementSize) { 
  } else {
    playerPos.x -= elementSize;
    startGame();
  }  
} 
function moveDown() {   
  if ((playerPos.y + elementSize) > canvasSize) {
  } else {
    playerPos.y += elementSize;
    startGame();
  }
} 

function showLives() {
  switch (lives) {
    case 3: spanLives.innerText = '❤️❤️❤️'
      break;
    case 2: spanLives.innerText = '❤️❤️' 
      break;
    case 1: spanLives.innerText = '❤️ <- Last Live !!!'
      break;
  }
}
function showTime() {
  let seg = ((Date.now() - timeStart) / 1000).toFixed(1);
  spanTime.innerText = seg;   
}
function showRecord() {

  record = localStorage.getItem('record_time') / 1000;

  spanRecord.innerText = record.toFixed(1);
}