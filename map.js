
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

        this.currentFloorMaker = null;
        this.currentFloorMakerIndex = 0;
        this.floorMakers = [new FloorMaker(this.entryPoint.clone(), Utility.randomInt(4) + 1)];

        this.floorCount = 1;
        this.tiles[this.entryPoint.x][this.entryPoint.y] = TileType.floor;

        this.maxFloorCount = maxFloorCount;
        this.turnResistance = 0.9;
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

        this.tiles[nextPoint.x][nextPoint.y] = TileType.floor;
        this.floorCount++;
        this.currentFloorMaker.currentPoint = nextPoint;

        if (this.floorMakers.length < this.maxFloorMakerCount && Math.random() < this.floorMakerSpawnProbability) {
            // console.log('new floor maker');
            this.floorMakers.push(new FloorMaker(this.currentFloorMaker.currentPoint.clone(), 0));
        }
    }

    generateWalls() {
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

        for (let i = 0; i < this.floorMakers.length; i++) {
            context.strokeStyle = this.currentFloorMakerIndex === i ? '#0f0' : '#f00';
            context.strokeRect(this.floorMakers[i].currentPoint.y * tileSize, this.floorMakers[i].currentPoint.x * tileSize, tileSize, tileSize);
            context.font = '' + (tileSize - 5) + 'px Arial';
            context.fillText(i.toString(), this.floorMakers[i].currentPoint.y * tileSize, (this.floorMakers[i].currentPoint.x + 1) * tileSize);
        }

        if (this.exitPoint !== null) {
            context.beginPath();
            context.arc(this.exitPoint.y * tileSize + (tileSize / 2), this.exitPoint.x * tileSize + (tileSize / 2), (tileSize / 3), 0, 2 * Math.PI);
            context.strokeStyle = '#00f';
            context.stroke();
            context.closePath();
        }
    }
}
