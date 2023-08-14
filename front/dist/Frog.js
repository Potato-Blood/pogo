class FrogBuilder {
    constructor() {
        this.setMouthClosedEyesOpen = (image) => {
            this.mouthClosedEyesOpen = image;
            return this;
        };
        this.setMouthClosedEyesClosed = (image) => {
            this.mouthClosedEyesClosed = image;
            return this;
        };
        this.setMouthOpenEyesOpen = (image) => {
            this.mouthOpenEyesOpen = image;
            return this;
        };
        this.setMouthOpenEyesClosed = (image) => {
            this.mouthOpenEyesClosed = image;
            return this;
        };
        this.setKeyPressDown = (image) => {
            this.keyPressDown = image;
            return this;
        };
        this.setKeyPressup = (image) => {
            this.keyPressUp = image;
            return this;
        };
        this.setBg = (image) => {
            this.bg = image;
            return this;
        };
        this.setMouse = (image) => {
            this.mouse = image;
            return this;
        };
        this.build = () => {
            return {
                mouthClosedEyesOpen: this.mouthClosedEyesOpen,
                mouthClosedEyesClosed: this.mouthClosedEyesClosed,
                mouthOpenEyesOpen: this.mouthOpenEyesOpen,
                mouthOpenEyesClosed: this.mouthOpenEyesClosed,
                keyPressDown: this.keyPressDown,
                keyPressUp: this.keyPressUp,
                bg: this.bg,
                mouse: this.mouse
            };
        };
    }
}
export { FrogBuilder };
