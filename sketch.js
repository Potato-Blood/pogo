const images = {};
let blinking = false;
let keyPress = false;
let blinkDelay = 200;
let tick = 0;
let mousePosX = 0;
let mousePosY = 0;
const ws = new WebSocket("ws://localhost:9001");

ws.onmessage = function (event) {
  if (event.data.includes("KeyPress")) {
    keyPress = true;
  } else if (event.data.includes("KeyRelease")) {
    keyPress = false;
  }
  if (event.data.includes("MouseMove:")) {
    const [_, x, y] = event.data.split(" ");
    mousePosX = x;
    mousePosY = y;
  }
  ws.send("readyformore!");
};

function preload() {
  images.mouthClosedEyesOpen = loadImage("assets/1.png");
  images.mouthClosedEyesClosed = loadImage("assets/2.png");
  images.mouthOpenEyesOpen = loadImage("assets/3.png");
  images.mouthOpenEyesClosed = loadImage("assets/4.png");
  images.mouthOpenEyesClosed = loadImage("assets/down.png");
  images.keyPressUp = loadImage("assets/up.png");
  images.bg = loadImage("assets/bg.png");
  images.mouse = loadImage("assets/mouse.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  tick++;
  if (tick == blinkDelay - 10) {
    blinking = true;
  } else if (tick == blinkDelay) {
    blinking = false;
    tick = 0;
    blinkDelay = Math.floor(random(150, 200));
  }

  const img = blinking
    ? images.mouthClosedEyesClosed
    : images.mouthClosedEyesOpen;
  const imgHand = keyPress ? images.mouthOpenEyesClosed : images.keyPressUp;

  const mouseOffsetX = 140;
  const mouseOffsetY = 270;
  const cosAngleX = Math.cos(Math.PI / 1.3);
  const sinAngleX = Math.sin(Math.PI / 1.3);
  const deltaX = mousePosX - 240;

  const cosAngleY = Math.cos(Math.PI / 1.1);
  const sinAngleY = Math.sin(Math.PI / 1.1);
  const deltaY = mousePosY - 240;

  const rotatedX = deltaX * cosAngleX + deltaY * sinAngleX;
  const rotatedY = deltaY * cosAngleY - deltaX * sinAngleY;

  const scaledMouseX = rotatedX / (240 - 215) + mouseOffsetX;
  const scaledMouseY = rotatedY / (240 - 190) + mouseOffsetY;

  background(0, 255, 0);
  image(images.bg, 0, 0);
  image(img, 0, 0);
  image(imgHand, 0, 0);
  image(images.mouse, scaledMouseX - 35, scaledMouseY - 25);

  const fillColour = color("#6abd8f");
  const strokeColour = color("#847669");

  fill(fillColour);
  stroke(fillColour);
  strokeWeight(1);

  triangle(225, 170, 200, 119, scaledMouseX, scaledMouseY);

  strokeWeight(6);
  stroke(strokeColour);

  curve(
    -400 + scaledMouseX * 5, //c1
    scaledMouseY / 3, //c1
    225, //x1
    170, //y1
    scaledMouseX, //x2
    scaledMouseY, //y2
    0, //c2
    0 //c2
  );

  curve(
    -100 + scaledMouseX * 5, //c1
    scaledMouseY / 3, //c1
    200, //x1
    119, //y1
    scaledMouseX, //x2
    scaledMouseY, //y2
    300, //c2
    200 //c2
  );
}
