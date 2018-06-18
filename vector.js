
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(vector) {
        return this.x === vector.x && this.y === vector.y;
    }
}
