let imgMouthClosedEyesOpen,
  imgMouthClosedEyesClosed,
  imgMouthOpenEyesOpen,
  imgMouthOpenEyesClosed;
let imgKeyPressDown, imgKeyPressUp, imgBG, imgMouse;
let blinking = false,
  keyPress = false;
let blinkDelay = 200;
let tick = 0;
let mousePosX = 0,
  mousePosY = 0;
const ws = new WebSocket("ws://localhost:9001");

function preload() {
  imgMouthClosedEyesOpen = loadImage("assets/1.png");
  imgMouthClosedEyesClosed = loadImage("assets/2.png");
  imgMouthOpenEyesOpen = loadImage("assets/3.png");
  imgMouthOpenEyesClosed = loadImage("assets/3.png");
  imgKeyPressDown = loadImage("assets/down.png");
  imgKeyPressUp = loadImage("assets/up.png");
  imgBG = loadImage("assets/bg.png");
  imgMouse = loadImage("assets/mouse.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}
ws.onmessage = function (event) {
  if (event.data.includes("KeyPress")) {
    keyPress = true;
  } else if (event.data.includes("KeyRelease")) {
    keyPress = false;
  }
  if (event.data.includes("Hack:")) {
    let tempPos = event.data.split(" ");
    mousePosX = tempPos[1];
    mousePosY = tempPos[2];
  }
  ws.send("readyformore!");
};

function draw() {
  background(0, 255, 0);
  tick++;
  if (tick == blinkDelay - 10) {
    blinking = true;
  } else if (tick == blinkDelay) {
    blinking = false;
    tick = 0;
    blinkDelay = Math.floor(random(150, 200));
  }
  let img = blinking ? imgMouthClosedEyesClosed : imgMouthClosedEyesOpen;
  let imgHand = keyPress ? imgKeyPressDown : imgKeyPressUp;
  image(imgBG, 0, 0);
  image(img, 0, 0);
  image(imgHand, 0, 0);
  let mouseOffsetX = 140,
    mouseOffsetY = 260;
  let ScaledMouseY = (mousePosY - 240) / (209 - 240) + mouseOffsetY,
    ScaledMouseX = (mousePosX - 240) / (209 - 240) + mouseOffsetX;

  image(imgMouse, ScaledMouseX - 35, ScaledMouseY - 25);
  let fillColour = color("#6abd8f"),
    strokeColour = color("#847669");
  fill(fillColour);
  stroke(fillColour);
  strokeWeight(1);
  triangle(250, 170, 173, 140, ScaledMouseX, ScaledMouseY);

  strokeWeight(6);
  stroke(strokeColour);
  curve(
    -100 + ScaledMouseX * 5, //c1
    ScaledMouseY / 3, //c1
    250, //x1
    170, //y1
    ScaledMouseX, //x2
    ScaledMouseY, //y2
    0, //c2
    0 //c2
  );
  curve(
    -300 + ScaledMouseX * 5, //c1
    ScaledMouseY / 3, //c1
    173, //x1
    140, //y1
    ScaledMouseX, //x2
    ScaledMouseY, //y2
    300, //c2
    200 //c2
  );
}
