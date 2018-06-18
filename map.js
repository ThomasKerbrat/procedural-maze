
class Map {
    constructor({ width, height, maxFloorCount }) {
        this.width = width;
        this.height = height;
        this.entryPoint = new Vector(Utility.randomInt(this.width), Utility.randomInt(this.height));
        this.exitPoint = null;

        this.tiles = [];
        for (let i = 0; i < this.width; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.tiles[i][j] = TileType.none;
            }
        }

        this.generate({ maxFloorCount });
    }

    generate({ maxFloorCount }) {
        let floorCount = 0;
        let currentPoint = this.entryPoint;

        this.tiles[this.entryPoint.x][this.entryPoint.y] = TileType.floor;

        while (floorCount < maxFloorCount) {
            let possibleWays = [];
            if (this.canCreateFloor(currentPoint.x - 1, currentPoint.y)) { possibleWays.push('left'); }
            if (this.canCreateFloor(currentPoint.x + 1, currentPoint.y)) { possibleWays.push('right'); }
            if (this.canCreateFloor(currentPoint.x, currentPoint.y - 1)) { possibleWays.push('up'); }
            if (this.canCreateFloor(currentPoint.x, currentPoint.y + 1)) { possibleWays.push('down'); }

            if (possibleWays.length === 0) {
                console.log('stuck');
                break;
            }

            let nextPoint = null;
            const direction = possibleWays[Utility.randomInt(possibleWays.length)];
            switch (direction) {
                case 'left':
                    nextPoint = new Vector(currentPoint.x - 1, currentPoint.y);
                    break;
                case 'right':
                    nextPoint = new Vector(currentPoint.x + 1, currentPoint.y);
                    break;
                case 'up':
                    nextPoint = new Vector(currentPoint.x, currentPoint.y - 1);
                    break;
                case 'down':
                    nextPoint = new Vector(currentPoint.x, currentPoint.y + 1);
                    break;
                default: throw direction;
            }

            this.tiles[nextPoint.x][nextPoint.y] = TileType.floor;
            currentPoint = nextPoint;
        }

        this.exitPoint = currentPoint;

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.tiles[i][j] === TileType.floor) {
                    for (let k = -1; k <= 1; k++) {
                        for (let l = -1; l <= 1; l++) {
                            const _x = i - k, _y = j - l;
                            if (!(k === 0 && l === 0) && this.areValidCoordinates(_x, _y) && this.tiles[_x][_y] !== TileType.floor) {
                                this.tiles[_x][_y] = TileType.wall;
                            }
                        }
                    }
                }
            }
        }
    }

    canCreateFloor(x, y) {
        return this.areValidCoordinates(x, y) && this.tiles[x][y] === TileType.none;
    }

    areValidCoordinates(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    _displayConsole() {
        const stringBuilder = [];
        const tileString = {};
        tileString[TileType.none] = ' ';
        tileString[TileType.floor] = '.';
        tileString[TileType.wall] = 'X';

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (i === this.entryPoint.x && j === this.entryPoint.y) {
                    stringBuilder.push('+');
                } else if (i === this.exitPoint.x && j === this.exitPoint.y) {
                    stringBuilder.push('*');
                } else {
                    stringBuilder.push(tileString[this.tiles[i][j]]);
                }
            }
            stringBuilder.push('\n');
        }

        console.log(stringBuilder.join(''));
    }

    render(context) {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let color = '#000';
                if (this.tiles[i][j] === TileType.floor) {
                    color = '#999';
                } else if (this.tiles[i][j] === TileType.wall) {
                    color = '#777';
                }
                context.fillStyle = color;
                context.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
            }
        }

        context.beginPath();
        context.arc(this.exitPoint.y * tileSize + (tileSize / 2), this.exitPoint.x * tileSize + (tileSize / 2), (tileSize / 3), 0, 2 * Math.PI);
        context.strokeStyle = '#00f';
        context.stroke();
        context.closePath();
    }
}
