
/**
 * A Playground is used to convert coordinates from an absolute two-dimensional referential
 * to a fixed-size "viewing window" defined by a width, a height, a zoom and offsets in the two dimensions.
 * 
 * This is a library/framework agnostic with no dependencies.
 * 
 * This utility code was extracted into a module because I needed this behavior in multiple projects.
 * The first project using this code was an infinite 2D plane in which particles experience gravity from each other's mass.
 */
class Playground {

    /**
     * Instanciates a new Playground.
     * @param {number} width Playground's "wiewing window" width.
     * @param {number} height Playground's "wiewing window" height.
     */
    constructor(width, height) {
        if (arguments.length < 2) { throw new Error('width and height are required'); }
        this.width = width;
        this.height = height;

        // Translation params
        this.resetTranslation();
        this.zoomInFactor = 1.1;
        this.zoomOutFactor = 0.9;
    }

    /**
     * @see updateTranslation
     */
    zoomIn(fixedX, fixedY) {
        return this.updateTranslation(fixedX, fixedY, this.zoomInFactor);
    }

    /**
     * @see updateTranslation
     */
    zoomOut(fixedX, fixedY) {
        return this.updateTranslation(fixedX, fixedY, this.zoomOutFactor);
    }

    /**
     * Scales the offsets and zoom arround a fixed point in the two-dimensional plane.
     * The given fixed point will keep its scaled coordinates after the translation.
     * @param {number} fixedX The X component of the fixed point.
     * @param {number} fixedY The Y component of the fixed point.
     * @param {number} delta Factor by which the zoom will be multiplied. 
     */
    updateTranslation(fixedX, fixedY, delta) {
        // NOTE: I do not understand why this works.
        const newZoom = this.zoom * delta;
        const x = (this.offsetX - fixedX) / this.zoom;
        const y = (this.offsetY - fixedY) / this.zoom;
        this.offsetX = (x * newZoom) + fixedX;
        this.offsetY = (y * newZoom) + fixedY;
        this.zoom = newZoom;
    }

    /**
     * Resets the default offsets and zoom for the playground.
     */
    resetTranslation() {
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = 1;
    }

    /**
     * Scales a number to the playground's zoom.
     * This is useful for scaling radius of a circle.
     * 
     * @param {number} value The value to scale.
     */
    scale(value) {
        return value * this.zoom;
    }

    /**
     * Scales a number to the playground's zomm adding the X offset.
     * 
     * @param {number} value The value to scale.
     */
    scaleX(value) {
        return (value * this.zoom) + this.offsetX;
    }

    /**
     * Scales a number to the playground's zomm adding the Y offset.
     * 
     * @param {number} value The value to scale.
     */
    scaleY(value) {
        return (value * this.zoom) + this.offsetY;
    }
}
