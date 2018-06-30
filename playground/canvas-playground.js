
/**
 * CanvasPlayground implements mouse events handling for a given HTML canvas element.
 */
class CanvasPlayground {

    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        if (arguments.length < 1) { throw new Error('canvas is required'); }
        if (!(canvas instanceof HTMLCanvasElement)) { throw new TypeError('canvas must be a HTMLCanvasElement'); }

        this.canvas = canvas;
        this._playground = new Playground(this.canvas.width, this.canvas.height);

        this._allowMoving = true;
        this.isMoving = false;
        this.mouseMoveOrigin = null;

        this.canvas.addEventListener('mousedown', this.mousedownEventHandler.bind(this));
        this.canvas.addEventListener('mousemove', this.mousemoveEventHandler.bind(this));
        this.canvas.addEventListener('mouseup', this.mouseupEventHandler.bind(this));
        this.canvas.addEventListener('dblclick', this.dblclickEventHandler.bind(this));
        this.canvas.addEventListener('wheel', this.wheelEventHandler.bind(this));
    }

    /**
     * @returns {Playground}
     */
    get playground() {
        return this._playground;
    }

    get allowMoving() {
        return this._allowMoving;
    }

    set allowMoving(value) {
        this._allowMoving = Boolean(value);
    }

    mousedownEventHandler(event) {
        if (this._allowMoving) {
            this.isMoving = true;
            this.mouseMoveOrigin = {
                x: event.clientX - this.playground.offsetX,
                y: event.clientY - this.playground.offsetY,
            };
        }
    }

    mousemoveEventHandler(event) {
        if (this.isMoving) {
            this.playground.offsetX = event.clientX - this.mouseMoveOrigin.x;
            this.playground.offsetY = event.clientY - this.mouseMoveOrigin.y;
        }
    }

    mouseupEventHandler(event) {
        this.isMoving = false;
        this.mouseMoveOrigin = null;
    }

    dblclickEventHandler(event) {
        this.playground.resetTranslation();
        event.preventDefault();
    }

    wheelEventHandler(event) {
        event.preventDefault();

        const fixedX = (event.altKey ? this.playground.width / 2 : event.clientX);
        const fixedY = (event.altKey ? this.playground.height / 2 : event.clientY);

        if (event.deltaY > 0) {
            this.playground.zoomOut(fixedX, fixedY);
        } else {
            this.playground.zoomIn(fixedX, fixedY);
        }
    }
}
