
class Game {
    constructor(width, height) {
        this.map = null;
        this.player = null;
        this.width = width;
        this.height = height;
    }

    newGame() {
        this.map = new Map({ width: this.width, height: this.height, maxFloorCount: 2048 });
        this.map.generate();
        this.player = new Vector(this.map.entryPoint.x, this.map.entryPoint.y);
    }

    newGameByStep() {
        this.map = new Map({ width: this.width, height: this.height, maxFloorCount: 2048 });
        this.player = new Vector(this.map.entryPoint.x, this.map.entryPoint.y);
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {CanvasPlayground} canvasPlayground
     */
    render(context, canvasPlayground) {
        if (this.map === null) { return; }

        context.fillStyle = '#000';
        context.fillRect(0, 0, this.map.width * tileSize, this.map.height * tileSize);
        this.map.render(context, canvasPlayground);

        context.beginPath();
        context.arc(
            canvasPlayground.playground.scaleX(this.player.y * tileSize + (tileSize / 2)),
            canvasPlayground.playground.scaleY(this.player.x * tileSize + (tileSize / 2)),
            canvasPlayground.playground.scale(tileSize / 3),
            0,
            2 * Math.PI
        );
        context.fillStyle = '#00f';
        context.fill();
        context.closePath();
    }

    movePlayerUp() {
        this.movePlayer(new Vector(this.player.x - 1, this.player.y));
    }

    movePlayerDown() {
        this.movePlayer(new Vector(this.player.x + 1, this.player.y));
    }

    movePlayerLeft() {
        this.movePlayer(new Vector(this.player.x, this.player.y - 1));
    }

    movePlayerRight() {
        this.movePlayer(new Vector(this.player.x, this.player.y + 1));
    }

    movePlayer(point) {
        if (!this.map.areValidCoordinates(point.x, point.y)) { return; }
        if (this.map.tiles[point.x][point.y] !== TileType.floor) { return; }

        this.player.x = point.x;
        this.player.y = point.y;

        if (this.player.equals(this.map.exitPoint)) {
            this.newGame();
        }
    }
}
