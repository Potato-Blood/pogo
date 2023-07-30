import { Image } from 'p5';

type Frog = {
    mouthClosedEyesOpen: Image
    mouthClosedEyesClosed: Image
    mouthOpenEyesOpen: Image
    mouthOpenEyesClosed: Image
    keyPressDown: Image
    keyPressUp: Image
    bg: Image
    mouse: Image
}

class FrogBuilder {
    private mouthClosedEyesOpen: Image
    private mouthClosedEyesClosed: Image
    private mouthOpenEyesOpen: Image
    private mouthOpenEyesClosed: Image
    private keyPressDown: Image
    private keyPressUp: Image
    private bg: Image
    private mouse: Image

    setMouthClosedEyesOpen = (image: Image) => {
        this.mouthClosedEyesOpen = image
        return this
    }

    setMouthClosedEyesClosed = (image: Image) => {
        this.mouthClosedEyesClosed = image
        return this
    }

    setMouthOpenEyesOpen = (image: Image) => {
        this.mouthOpenEyesOpen = image
        return this
    }

    setMouthOpenEyesClosed = (image: Image) => {
        this.mouthOpenEyesClosed = image
        return this
    }

    setKeyPressDown = (image: Image) => {
        this.keyPressDown = image
        return this
    }

    setKeyPressup = (image: Image) => {
        this.keyPressUp = image
        return this
    }

    setBg = (image: Image) => {
        this.bg = image
        return this
    }

    setMouse = (image: Image) => {
        this.mouse = image
        return this
    }


    build = (): Frog => {
        return {
            mouthClosedEyesOpen: this.mouthClosedEyesOpen,
            mouthClosedEyesClosed: this.mouthClosedEyesClosed,
            mouthOpenEyesOpen: this.mouthOpenEyesOpen,
            mouthOpenEyesClosed: this.mouthOpenEyesClosed,
            keyPressDown: this.keyPressDown,
            keyPressUp: this.keyPressUp,
            bg: this.bg,
            mouse: this.mouse
        }
    }

}

export { Frog, FrogBuilder }