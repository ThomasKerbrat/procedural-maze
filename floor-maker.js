
class FloorMaker {
    constructor(currentPoint, direction) {
        this.currentPoint = currentPoint;
        this.direction = direction;
    }

    get nextPoint() {
        switch (this.direction) {
            case 1: // up
                return new Vector(this.currentPoint.x, this.currentPoint.y - 1);
            case 2: // right
                return new Vector(this.currentPoint.x + 1, this.currentPoint.y);
            case 3: // down
                return new Vector(this.currentPoint.x, this.currentPoint.y + 1);
            case 4: // left
                return new Vector(this.currentPoint.x - 1, this.currentPoint.y);
            default: throw new Error('Unexpected direction: ' + this.direction);
        }
    }
}
