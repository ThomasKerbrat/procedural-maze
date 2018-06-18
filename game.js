
class Game {
    constructor() {
        this.map = null;
        this.player = null;
    }

    newGame() {
        this.map = new Map({ width: 64, height: 64, maxFloorCount: 512 });
        this.map.generate();
        this.player = new Vector(this.map.entryPoint.x, this.map.entryPoint.y);
    }

    newGameByStep() {
        this.map = new Map({ width: 64, height: 64, maxFloorCount: 512 });
        this.player = new Vector(this.map.entryPoint.x, this.map.entryPoint.y);
    }

    render(context) {
        if (this.map === null) { return; }

        context.fillStyle = '#000';
        context.fillRect(0, 0, this.map.width * 20, this.map.height * 20);
        this.map.render(context);

        context.beginPath();
        context.arc(this.player.y * tileSize + (tileSize / 2), this.player.x * tileSize + (tileSize / 2), (tileSize / 3), 0, 2 * Math.PI);
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
