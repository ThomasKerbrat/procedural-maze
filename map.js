
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

        this.floorMakers = [];
        this.turnResistance = 0.4;
        this.maxFloorMakerCount = 20;
        this.floorMakerSpawnProbability = 0.8;
        this.generate(maxFloorCount, this.maxFloorMakerCount, this.turnResistance, this.floorMakerSpawnProbability);
    }

    generate(maxFloorCount, maxFloorMakerCount, turnResistance, floorMakerSpawnProbability) {
        let floorMaker = null;
        let currentFloorMakerIndex = 0;
        this.floorMakers.push(new FloorMaker(this.entryPoint.clone(), 0));

        let floorCount = 1;
        this.tiles[this.entryPoint.x][this.entryPoint.y] = TileType.floor;

        // Generate the maze
        while (floorCount < maxFloorCount && this.floorMakers.length > 0) {
            floorMaker = this.floorMakers[currentFloorMakerIndex];
            currentFloorMakerIndex = (currentFloorMakerIndex + 1) % this.floorMakers.length;

            let possibleWays = [];
            if (floorMaker.direction === 0 || Math.random() <= turnResistance) {
                if (this.canCreateFloor(floorMaker.currentPoint.x, floorMaker.currentPoint.y - 1)) { possibleWays.push(1); }
                if (this.canCreateFloor(floorMaker.currentPoint.x + 1, floorMaker.currentPoint.y)) { possibleWays.push(2); }
                if (this.canCreateFloor(floorMaker.currentPoint.x, floorMaker.currentPoint.y + 1)) { possibleWays.push(3); }
                if (this.canCreateFloor(floorMaker.currentPoint.x - 1, floorMaker.currentPoint.y)) { possibleWays.push(4); }
            } else {
                const nextPointCandidate = floorMaker.nextPoint;
                if (this.canCreateFloor(nextPointCandidate.x, nextPointCandidate.y)) {
                    possibleWays.push(floorMaker.direction);
                }
            }

            if (possibleWays.length === 0) {
                console.log('stuck');
                this.floorMakers.splice(currentFloorMakerIndex, 1);
                currentFloorMakerIndex %= this.floorMakers.length;
                continue;
            }

            let nextPoint = null;
            floorMaker.direction = possibleWays[Utility.randomInt(possibleWays.length)];
            nextPoint = floorMaker.nextPoint;

            this.tiles[nextPoint.x][nextPoint.y] = TileType.floor;
            floorCount++;
            floorMaker.currentPoint = nextPoint;

            if (this.floorMakers.length < maxFloorMakerCount && Math.random() < floorMakerSpawnProbability) {
                this.floorMakers.push(new FloorMaker(floorMaker.currentPoint.clone(), 0));
            }
        }

        this.exitPoint = floorMaker.currentPoint;

        // Add surrounding walls
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
