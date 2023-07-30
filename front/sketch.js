const images = {};
let blinking = false;
let talking = false;
let keyPress = false;

let blinkDelayMax = 200;
let blinkDelayMin = 125;
let blinkDuration = 10;
let blinkDelay = blinkDelayMax;

let tick = 0;
let mousePosX = 0;
let mousePosY = 0;

const numOfHats = 32; // FIXME: when YAML available, move to that instaead of hard coding trash
const hats = new Array(numOfHats)
let hatIdx = 0;
let hatEnabled = false;
let hatSpinCount = 0;


const numOfMouths = 11; // FIXME: when YAML available, move to that instaead of hard coding trash
const mouths = new Array(numOfMouths)
let mouthIdx = 0;

// Created a websocket that when closed tries to reconnet with some backoff
startWebsocket = (ip, port, backoff) => {
  console.log("Attempting to connect to websocket");
  var ws = new WebSocket(`ws://${ip}:${port}`);

  ws.onmessage = function (event) {
    // if (!event.data.includes("Voice")) {
    //   console.log(event);
    // }
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
    if (event.data.includes("VoiceOn")) {
      talking = true;
    } else if (event.data.includes("VoiceOff")) {
      talking = false;
    }
    if (event.data.includes("RandomHat")) {
      hatEnabled = true;
      prevIdx = hatIdx;
      hatIdx = Math.floor(Math.random() * hats.length);
      if (hatIdx == prevIdx) {
        hatIdx = (hatIdx + 1) % hats.length;
      }
      hatSpinCount += 20;
      console.log(hatIdx);
    }
    ws.send("readyformore!");
  };

  ws.onclose = function () {
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

  images.mouthClosed = loadImage("assets/mouthClosed.png");
  images.eyesClosed = loadImage("assets/eyesClosed.png");
  images.eyesOpen = loadImage("assets/eyesOpen.png");

  images.keyPressDown = loadImage("assets/down.png");
  images.keyPressUp = loadImage("assets/up.png");
  images.bg = loadImage("assets/bg.png");
  images.mouse = loadImage("assets/mouse.png");

  for (let i = 0; i < numOfHats; i++) {
    hats[i] = loadImage(`assets/Hats/${i}.png`)
  }

  for (let i = 0; i < numOfMouths; i++) {
    mouths[i] = loadImage(`assets/MouthShapes/${i}.png`)
  }

}
let count = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}
let rndMouth;
let temp;
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


  count++;
  if(count === 10){
    rndMouth = mouths[Math.floor(random(0,(mouths.length)))]
    count = 0;
  }
  
  

  const imgMouth = talking ? rndMouth : images.mouthClosed;
  const imgEyes = blinking ? images.eyesClosed : images.eyesOpen;
  const imgHand = keyPress ? images.keyPressDown : images.keyPressUp;


  // Calculate mouse offset and rotation
  const mouseOffsetX = 120;
  const mouseOffsetY = 260 + 229;

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
  //background(0, 255, 0);
  clear();
  image(images.bg, 0, 0);
  image(imgEyes, 0, 0);
  image(imgMouth, 0, 0);
  image(imgHand, 0, 0);
  image(images.mouse, scaledMouseX - 35, scaledMouseY - 25);

  const fillColour = color("#75c687");
  const strokeColour = color("#31556b");

  fill(fillColour);
  stroke(fillColour);
  strokeWeight(1);

  // Draw triangle to fill the missing area left by the curves
  triangle(225, 170 + 229, 200, 119 + 229, scaledMouseX, scaledMouseY);

  strokeWeight(8);
  stroke(strokeColour);

  // Draw two curves for the mouse hand using scaledMouseX/Y
  curve(
    -400 + scaledMouseX * 5, //c1
    scaledMouseY / 3, //c1
    225, //x1
    170 + 229, //y1
    scaledMouseX, //x2
    scaledMouseY, //y2
    0, //c2
    229 //c2
  );
  curve(
    -100 + scaledMouseX * 5, //c1
    (scaledMouseY + 329) / 3, //c1
    200, //x1
    119 + 229, //y1
    scaledMouseX, //x2
    scaledMouseY, //y2
    300, //c2
    200 + 229//c2
  );
  drawHat(hatIdx)
}var delay = 1;
var delayFactor = 1;
var fastDelayCycles = 6;
var currentCycle = 0;
var hat;
var prevHat;

function drawHat(hatIdx) {
  if (hatSpinCount > 20) {
    delay = 1;
    delayFactor = 1;
    fastDelayCycles = 6;
    currentCycle = 0;
    hatSpinCount = 20;
  }

  if (delay > 0) {
    delay--;
  } else {
    if (hatSpinCount > 0) {
      prevHat = hat;
      hat = hats[Math.floor(Math.random() * hats.length)];
      
      while (hat === prevHat) {
        hat = hats[Math.floor(Math.random() * hats.length)];
      }
      
      hatSpinCount--;

      if (currentCycle < fastDelayCycles) {
        delay = 1;
        currentCycle++;
      } else {
        delay = delayFactor;
        delayFactor++;
      }
    } else {
      hat = hats[hatIdx];
      delayFactor = 1;
      currentCycle = 0;
    }
  }

  if (hat) {
    hat.resize(612, 612);
    image(hat, 1, 0);
  }
}