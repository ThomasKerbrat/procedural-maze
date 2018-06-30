
const tileSize = 10;

let canvasPlayground;
let game;

window.addEventListener('load', function () {
    const canvasElement = document.querySelector('#maze-canvas');
    const context = canvasElement.getContext('2d');

    const width = Math.floor((this.document.body.clientWidth - 20) / tileSize);
    const height = Math.floor((this.document.body.clientHeight - 20) / tileSize);

    canvasElement.setAttribute('width', width * tileSize);
    canvasElement.setAttribute('height', height * tileSize);

    game = new Game(width, height);
    // game.newGame();
    game.newGameByStep();

    canvasPlayground = new CanvasPlayground(canvasElement);
    game.render(context, canvasPlayground);

    setInterval(function () {
        game.map.generateStep();
    }, 0);

    requestAnimationFrame(renderGame);
    function renderGame() {
        requestAnimationFrame(renderGame);
    
        const canvasElement = document.querySelector('#maze-canvas');
        const context = canvasElement.getContext('2d');
        game.render(context, canvasPlayground);
    }
});

window.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp': game.movePlayerUp(); break;
        case 'ArrowDown': game.movePlayerDown(); break;
        case 'ArrowLeft': game.movePlayerLeft(); break;
        case 'ArrowRight': game.movePlayerRight(); break;
        case 's': game.map.generateStep(); break;
    }

    const canvasElement = document.querySelector('#maze-canvas');
    const context = canvasElement.getContext('2d');
    game.render(context, canvasPlayground);
});
