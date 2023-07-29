import * as p5 from 'p5';
import {Frog, FrogBuilder} from './Frog'

const buildFrog = (p: p5): Frog => {
    return new FrogBuilder()
        .setMouthClosedEyesOpen(p.loadImage("assets/1.png"))
        .setMouthClosedEyesClosed(p.loadImage("assets/2.png"))
        .setMouthOpenEyesOpen(p.loadImage("assets/3.png"))
        .setMouthOpenEyesClosed(p.loadImage("assets/4.png"))
        .setKeyPressDown(p.loadImage("assets/down.png"))
        .setKeyPressup(p.loadImage("assets/up.png"))
        .setBg(p.loadImage("assets/bg.png"))
        .setMouse(p.loadImage("assets/mouse.png"))
        .build();
}

export const sketch = (p: p5) => {


    let images: Frog;
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

    const startWebsocket = (ip: string, port: number, backoff: number): void => {
        console.log("Attempting to connect to websocket");
        var ws = new WebSocket(`ws://${ip}:${port}`);

        ws.onmessage = function (event) {
            //console.log(event);
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

    startWebsocket("localhost", 9001, 32); // Start the websocket with expoentional backoff
    p.preload = () => {
        images = buildFrog(p);
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
    }

    p.draw = () => {
        // There must be a better way to do this
        tick++;
        if (tick === blinkDelay - blinkDuration) {
            blinking = true;
        } else if (tick === blinkDelay) {
            blinking = false;
            tick = 0;
            blinkDelay = Math.floor(Math.random() * (blinkDelayMax - blinkDelayMin) + blinkDelayMin);
        }
        let imgBlinking = images.mouthClosedEyesOpen;
        if (talking && blinking) {
            imgBlinking = images.mouthOpenEyesClosed;
        } else if (talking) {
            imgBlinking = images.mouthOpenEyesOpen;
        } else if (blinking) {
            imgBlinking = images.mouthClosedEyesClosed;
        }

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
        p.clear(0,0,0,0);
        p.image(images.bg, 0, 0);
        p.image(imgBlinking, 0, 0);

        p.image(imgHand, 0, 0);
        p.image(images.mouse, scaledMouseX - 35, scaledMouseY - 25);

        const fillColour = p.color("#75c687");
        const strokeColour = p.color("#31556b");

        p.fill(fillColour);
        p.stroke(fillColour);
        p.strokeWeight(1);

        // Draw triangle to fill the missing area left by the curves
        p.triangle(225, 170 + 229, 200, 119 + 229, scaledMouseX, scaledMouseY);

        p.strokeWeight(6);
        p.stroke(strokeColour);

        // Draw two curves for the mouse hand using scaledMouseX/Y
        p.curve(
            -400 + scaledMouseX * 5, //c1
            scaledMouseY / 3, //c1
            225, //x1
            170 + 229, //y1
            scaledMouseX, //x2
            scaledMouseY, //y2
            0, //c2
            229 //c2
        );
        p.curve(
            -100 + scaledMouseX * 5, //c1
            (scaledMouseY + 329) / 3, //c1
            200, //x1
            119 + 229, //y1
            scaledMouseX, //x2
            scaledMouseY, //y2
            300, //c2
            200 + 229//c2
        );

    }
}

export const myp5 = new p5(sketch, document.body);