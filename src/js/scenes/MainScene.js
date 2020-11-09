import Map from '../components/Map';
import Players from '../components/Players';
import Explode from '../components/Explode';
import Background from '../components/Background';

class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene',
        });

        this.cells = {};
        this.opponentData = {}; // it's set on Socket class
    }

    init(data) {
        this.myPlanes = data.planesData.planes;
        this.cameras.main.setBackgroundColor('#fff');
    }

    //debug
    // drawByCells(cells) {
    //     //console.log(this.cells);

    //     cells.forEach((cl) => {
    //         //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    //         var graphics = this.add.graphics({
    //             lineStyle: { width: 3, color: 0x000000 },
    //         });
    //         graphics.strokeRectShape(this.cells[`o${cl}`].rect);
    //     });
    // }

    create() {
        // console.log('main create');
        this.fireGameObjects = {};
        this.planesGameObjects = {};

        this.explode = new Explode(this);

        const background = new Background(this);
        const playersComponent = new Players(this);

        const playerMap = new Map(this, 96 - 32, 98, null, true);
        const opponentMap = new Map(this, 96 + 32 * 11, 98, 'opponent', true);

        // Extract neccesarry data to send as opponent data
        const dataToSend = { planes: {} };
        Object.keys(this.myPlanes).forEach((planeKey) => {
            const currPlane = this.myPlanes[planeKey];
            // console.log(currPlane);
            dataToSend.planes[planeKey] = {
                cells: currPlane.instance.planeCells,
                head: currPlane.instance.headCell,
            };
        });

        // Send data to opponent
        this.socket.send({
            action: 'setOpponentData',
            opponentData: dataToSend,
        });

        this.drawPlanes();

        this.turn = game.gameData.turn;
        this.turn.setScene(this);

        this.printTerritoryText();

        //console.log(this.turn);

        //debug

        // this.drawByCells(this.myPlanesCells);
    }

    drawPlanes() {
        // console.log(this.myPlanes);

        Object.keys(this.myPlanes).forEach((planeKey) => {
            const playerMapLeftDiff = game.opts.cellSize; // Difference between left margin of maps on SetPlaneScene vs MainScene
            const plane = this.myPlanes[planeKey].instance;
            const planeImage = this.add
                .image(plane.x - playerMapLeftDiff, plane.y, plane.texture.key)
                .setAngle(plane.angle)
                .setAlpha(0.9)
                .setScale(game.zoom);

            this.planesGameObjects[planeKey] = planeImage;
        });
    }

    printTerritoryText() {
        const gameWidth = game.opts.defaultWidth;
        const x1 = gameWidth / 4 + (game.opts.cellSize / 2) * game.zoom;
        const x2 = gameWidth - gameWidth / 4;
        const y = game.opts.defaultHeight - 20;
        this.printText(x1, y, 'Your territory');
        this.printText(x2, y, 'Opponent territory');
    }

    printText(x, y, text) {
        x = x * game.zoom;
        y = y * game.zoom;
        const fontSize = 14 * game.zoom;
        this.add
            .text(x, y, text, {
                color: '#424242',
                fontFamily: 'Righteous',
                fontSize: `${fontSize}px`,
            })
            .setOrigin(0.5)
            .setAlpha(0.7);
    }

    /**
     * Destroy if plane head or all plane cells hitted
     * Called on Socket class
     */
    destroyPlane(planeKey) {
        const plane = this.planesGameObjects[planeKey];
        const fires = this.fireGameObjects[planeKey];

        // Explode plane
        this.explode.generate(plane.x, plane.y);
        plane.setAlpha(0.3);

        // Delete from remaining planes, so can detect game over
        delete this.planesGameObjects[planeKey];

        // Remove fire game objects
        fires.forEach((fire) => fire.destroy());

        // Check game over
        if ($.isEmptyObject(this.planesGameObjects)) {
            console.log('Game OVERRRRRRRR');
        }
    }
}

export default MainScene;
