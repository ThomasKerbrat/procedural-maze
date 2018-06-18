
const tileSize = 20;
const game = new Game();

window.addEventListener('load', function () {
    const canvasElement = document.querySelector('#maze-canvas');
    const context = canvasElement.getContext('2d');
    canvasElement.setAttribute('width', 640);
    canvasElement.setAttribute('height', 640);

    game.render(context);
});

window.addEventListener('keydown', function (event) {
    console.log(event.key);
    
    switch (event.key) {
        case 'ArrowUp': game.movePlayerUp(); break;
        case 'ArrowDown': game.movePlayerDown(); break;
        case 'ArrowLeft': game.movePlayerLeft(); break;
        case 'ArrowRight': game.movePlayerRight(); break;
    }

    const canvasElement = document.querySelector('#maze-canvas');
    const context = canvasElement.getContext('2d');
    game.render(context);
});
