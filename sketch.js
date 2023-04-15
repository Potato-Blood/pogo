const images = {};
let blinking = false;
let keyPress = false;

let blinkDelayMax = 200;
let blinkDelayMin = 125;
let blinkDuration = 10;
let blinkDelay = blinkDelayMax;

let tick = 0;
let mousePosX = 0;
let mousePosY = 0;

// Created a websocket that when closed tries to reconnet with some backoff
startWebsocket = (ip, port, backoff) => {
  console.log("Attempting to connect to websocket");
  var ws = new WebSocket(`ws://${ip}:${port}`);

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

  ws.onclose = function (event) {
    ws = null;
    console.log(`Websocket closed, retying with backoff of ${backoff}ms`);

    // 1 minute as the max backoff
    if (backoff >= 60000) {
      backoff = 60000;
    }
    setTimeout(() => startWebsocket(ip, port, backoff * 2), backoff);
  };
};

startWebsocket("localhost", "9001", 32); // Start the websocket with expoentional backoff

// Load images before setup
function preload() {
  images.mouthClosedEyesOpen = loadImage("assets/1.png");
  images.mouthClosedEyesClosed = loadImage("assets/2.png");
  images.mouthOpenEyesOpen = loadImage("assets/3.png");
  images.mouthOpenEyesClosed = loadImage("assets/4.png");
  images.keyPressDown = loadImage("assets/down.png");
  images.keyPressUp = loadImage("assets/up.png");
  images.bg = loadImage("assets/bg.png");
  images.mouse = loadImage("assets/mouse.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  // There must be a better way to do this
  tick++;
  if (tick === blinkDelay - blinkDuration) {
    blinking = true;
  } else if (tick === blinkDelay) {
    blinking = false;
    tick = 0;
    blinkDelay = Math.floor(random(blinkDelayMin, blinkDelayMax));
  }
  const imgBlinking = blinking
    ? images.mouthClosedEyesClosed
    : images.mouthClosedEyesOpen;
  const imgHand = keyPress ? images.keyPressDown : images.keyPressUp;

  // Calculate mouse offset and rotation
  const mouseOffsetX = 120;
  const mouseOffsetY = 260;

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

  // Draw background and images in order
  background(0, 255, 0);
  image(images.bg, 0, 0);
  image(imgBlinking, 0, 0);
  image(imgHand, 0, 0);
  image(images.mouse, scaledMouseX - 35, scaledMouseY - 25);

  const fillColour = color("#6abd8f");
  const strokeColour = color("#847669");

  fill(fillColour);
  stroke(fillColour);
  strokeWeight(1);

  // Draw triangle to fill the missing area left by the curves
  triangle(225, 170, 200, 119, scaledMouseX, scaledMouseY);

  strokeWeight(6);
  stroke(strokeColour);

  // Draw two curves for the mouse hand using scaledMouseX/Y
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
