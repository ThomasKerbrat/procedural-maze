
class Map {
    constructor({ width, height, maxFloorCount }) {
        this.width = width;
        this.height = height;
        this.entryPoint = new Vector(0, 0);
        this.exitPoint = null;

        this.tiles = [];
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = TileType.none;
            }
        }

        this.currentFloorMaker = null;
        this.currentFloorMakerIndex = 0;
        this.floorMakers = [new FloorMaker(this.entryPoint.clone(), Utility.randomInt(4) + 1)];

        this.floorCount = 1;
        this.tiles[this.entryPoint.y][this.entryPoint.x] = TileType.floor;

        this.maxFloorCount = maxFloorCount;
        this.turnResistance = 0.95;
        this.maxFloorMakerCount = 5;
        this.floorMakerSpawnProbability = 0.2;
    }

    generate() {
        while (this.floorCount < this.maxFloorCount && this.floorMakers.length > 0) {
            this.generateStep();
        }

        this.exitPoint = this.currentFloorMaker.currentPoint;
        this.generateWalls();
    }

    generateStep() {
        if (!(this.floorCount < this.maxFloorCount && this.floorMakers.length > 0)) {
            if (this.exitPoint === null) {
                this.exitPoint = this.currentFloorMaker.currentPoint;
                this.generateWalls();
            }
            if (this.floorMakers.length > 0) {
                this.floorMakers.splice(0, this.floorMakers.length);
            }
            return;
        }

        this.currentFloorMaker = this.floorMakers[this.currentFloorMakerIndex];
        this.currentFloorMakerIndex = (this.currentFloorMakerIndex + 1) % this.floorMakers.length;

        let directionCandidates = [];
        if (this.currentFloorMaker.direction === 0 || Math.random() > this.turnResistance) {
            // console.log(floorMaker.direction === 0 ? 'no direction' : 'turn');
            if (this.canCreateFloor(this.currentFloorMaker.currentPoint.x, this.currentFloorMaker.currentPoint.y - 1)) { directionCandidates.push(1); }
            if (this.canCreateFloor(this.currentFloorMaker.currentPoint.x + 1, this.currentFloorMaker.currentPoint.y)) { directionCandidates.push(2); }
            if (this.canCreateFloor(this.currentFloorMaker.currentPoint.x, this.currentFloorMaker.currentPoint.y + 1)) { directionCandidates.push(3); }
            if (this.canCreateFloor(this.currentFloorMaker.currentPoint.x - 1, this.currentFloorMaker.currentPoint.y)) { directionCandidates.push(4); }
        } else {
            const nextPointCandidate = this.currentFloorMaker.nextPoint;
            if (this.canCreateFloor(nextPointCandidate.x, nextPointCandidate.y)) {
                directionCandidates.push(this.currentFloorMaker.direction);
            }
        }

        if (directionCandidates.length === 0) {
            console.log('stuck');
            this.floorMakers.splice(this.floorMakers.indexOf(this.currentFloorMaker), 1);
            this.currentFloorMakerIndex %= this.floorMakers.length;
            return;
        }

        let nextPoint = null;
        this.currentFloorMaker.direction = directionCandidates[Utility.randomInt(directionCandidates.length)];
        nextPoint = this.currentFloorMaker.nextPoint;

        this.tiles[nextPoint.y][nextPoint.x] = TileType.floor;
        this.floorCount++;
        this.currentFloorMaker.currentPoint = nextPoint;

        if (this.floorMakers.length < this.maxFloorMakerCount && Math.random() < this.floorMakerSpawnProbability) {
            // console.log('new floor maker');
            this.floorMakers.push(new FloorMaker(this.currentFloorMaker.currentPoint.clone(), 0));
        }
    }

    generateWalls() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.tiles[i][j] === TileType.floor) {
                    for (let k = -1; k <= 1; k++) {
                        for (let l = -1; l <= 1; l++) {
                            if (!(k === 0 && l === 0)) {
                                const _y = i + k;
                                const _x = j + l;
                                if (this.areValidCoordinates(_x, _y) && this.tiles[_y][_x] !== TileType.floor) {
                                    this.tiles[_y][_x] = TileType.wall;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    canCreateFloor(x, y) {
        return this.areValidCoordinates(x, y) && this.tiles[y][x] === TileType.none;
    }

    areValidCoordinates(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {CanvasPlayground} canvasPlayground
     */
    render(context, canvasPlayground) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.tiles[y][x] == TileType.none) {
                    continue;
                }

                let color;
                if (this.tiles[y][x] === TileType.floor) {
                    color = '#999';
                } else if (this.tiles[y][x] === TileType.wall) {
                    color = '#777';
                }
                context.fillStyle = color;
                context.fillRect(
                    canvasPlayground.playground.scaleX(x * tileSize),
                    canvasPlayground.playground.scaleY(y * tileSize),
                    canvasPlayground.playground.scale(tileSize),
                    canvasPlayground.playground.scale(tileSize)
                );
            }
        }

        for (let floorMaker of this.floorMakers) {
            context.strokeStyle = '#f00';
            context.strokeRect(
                canvasPlayground.playground.scaleX(floorMaker.currentPoint.x * tileSize),
                canvasPlayground.playground.scaleY(floorMaker.currentPoint.y * tileSize),
                canvasPlayground.playground.scale(tileSize),
                canvasPlayground.playground.scale(tileSize)
            );
        }

        if (this.exitPoint !== null) {
            context.beginPath();
            context.arc(
                canvasPlayground.playground.scaleX(this.exitPoint.x * tileSize + (tileSize / 2)),
                canvasPlayground.playground.scaleY(this.exitPoint.y * tileSize + (tileSize / 2)),
                canvasPlayground.playground.scale(tileSize / 3),
                0,
                2 * Math.PI
            );
            context.strokeStyle = '#00f';
            context.stroke();
            context.closePath();
        }
    }
}
