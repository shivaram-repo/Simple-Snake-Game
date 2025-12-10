const board = document.querySelector(".board");
const blockheight = 50;
const blockwidth = 50;
const blocks = [];
const btnstart = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const strgame = document.querySelector(".start-game");
const gameover = document.querySelector(".game-over");
const btnrestart = document.querySelector(".btn-restart");
const highscoreelement = document.getElementById("high-score");
const scoreelement = document.getElementById("score");
const timeelement = document.getElementById("time");
const cols = Math.floor(board.clientWidth / blockwidth);
const rows = Math.floor(board.clientHeight / blockheight);

let speed = 200;
let snake = [{ x: 1, y: 3 }];
let direction = "right";
let intervalid = null;
let timerid = null;
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};
let touchstartx=0;
let touchendx=0;
let touchstarty=0;
let touchendy=0;
let highscore = localStorage.getItem("highscore") || 0;
let score = 0;
let time = "00:00";
highscoreelement.innerText = highscore;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${r},${c}`] = block;
  }
}
function drawSnake() {
  let head = null;

  blocks[`${food.x},${food.y}`].classList.add("food");

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }

  //wall collision
  if (head.x < 0 || head.y < 0 || head.x >= rows || head.y >= cols) {
    blocks[`${snake[0].x},${snake[0].y}`].classList.remove("head");
    alert("Game Over");
    clearInterval(intervalid);
    clearInterval(timerid);
    modal.style.display = "flex";
    strgame.style.display = "none";
    gameover.style.display = "flex";
    return;
  }
  //food collision
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x},${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x},${food.y}`].classList.add("food");
    snake.unshift(head);
    score += 10;
    scoreelement.innerText = score;
    if (speed > 80 && score >50) {
  speed -= 5; // increase difficulty gradually
  clearInterval(intervalid);
  intervalid = setInterval(drawSnake, speed);
}
  if (score > highscore) {
      highscore = score;
      localStorage.setItem("highscore", highscore.toString());
      highscoreelement.innerText = highscore;
    }
  }

  snake.forEach((segment) => {
   const block = blocks[`${segment.x},${segment.y}`];
   block.classList.remove("fill");
   block.classList.remove("head");
  });
  snake.unshift(head);
  snake.pop();
  snake.forEach((segment,index) => {
  const block =  blocks[`${segment.x},${segment.y}`];
  block.classList.add("fill");
   if(index===0){
    block.classList.add("head");
   }
  });
}
btnstart.addEventListener("click", () => {
  modal.style.display = "none";
  intervalid = setInterval(() => {
    drawSnake();
  }, speed);
  timerid = setInterval(() => {
    let [mins , secs]=time.split(":").map(Number);
    secs+=1;
    if(secs===60){
      mins+=1;
      secs=0;
    }
    time=`${mins.toString().padStart(2,"0")}:${secs.toString().padStart(2,"0")}`;
    timeelement.innerText = time;
  },1000);
});

btnrestart.addEventListener("click", () => {
  restartGame();
});
function restartGame() {
  score = 0;
  time = "00:00";
  speed = 200;
  scoreelement.innerText = score;
  timeelement.innerText = time;
  highscoreelement.innerText = highscore;
  blocks[`${food.x},${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    const block = blocks[`${segment.x},${segment.y}`];
    if(block) { // Safety check
      block.classList.remove("fill", "head");
    }
  });

  modal.style.display = "none";
  snake = [
    {
      x: 2,
      y: 3,
    },
  ];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  direction = "right";
  intervalid = setInterval(() => {
    drawSnake();
  }, speed);
  timerid = setInterval(() => {
    let [mins , secs]=time.split(":").map(Number);
    secs+=1;
    if(secs===60){
      mins+=1;
      secs=0;
    }
    time=`${mins.toString().padStart(2,"0")}:${secs.toString().padStart(2,"0")}`;
    timeelement.innerText = time;
  },1000);
}
addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  } else if (event.key === "ArrowRight" && direction !== "left") {
    direction = "right";
  } else if (event.key === "ArrowUp" && direction !== "down") {
    direction = "up";
  } else if (event.key === "ArrowDown" && direction !== "up") {
    direction = "down";
  }
});

board.addEventListener("touchstart",(event)=>{
  const touch=event.touches[0];
  touchstartx=touch.clientX;
  touchstarty=touch.clientY;
})

board.addEventListener("touchend",(event)=>{
  const touch=event.changedTouches[0];
  touchendx=touch.clientX;
  touchendy=touch.clientY;
  const dx=touchendx-touchstartx;
  const dy=touchendy-touchstarty;
  if(Math.abs(dx)<10 && Math.abs(dy)<10) return;
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal swipe
    if (dx > 0 && direction !== "left") {
      direction = "right";
    } else if (dx < 0 && direction !== "right") {
      direction = "left";
    }
  } else {
    // Vertical swipe
    if (dy > 0 && direction !== "up") {
      direction = "down";
    } else if (dy < 0 && direction !== "down") {
      direction = "up";
    }
  }
});

board.addEventListener("touchmove",(event)=>{
    event.preventDefault();},
  { passive: false }
);

