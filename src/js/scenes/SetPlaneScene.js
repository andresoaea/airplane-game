import Socket from '../Socket';
import Map from '../components/Map';
import Plane from '../components/Plane';
import Background from '../components/Background';

class SetPlaneScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'SetPlaneScene',
        });
    }

    init() {
        this.cameras.main.setBackgroundColor('#fff');
    }

    create() {
        this.cells = [];
        this.planes = {};
        this.planesGameObjects = [];

        const background = new Background(this);

        const map = new Map(this, 96, 98);

        let plane1 = new Plane({
            scene: this,
            x: game.config.width / game.zoom / 2 + 200,
            y: 140,
            planeNum: 1,
        });

        this.planesGameObjects.push(plane1);

        let plane2 = new Plane({
            scene: this,
            x: game.config.width / game.zoom / 2 + 300,
            y: 140,
            planeNum: 2,
        });

        this.planesGameObjects.push(plane2);

        // Start game btn
        this.addStartGame();

        let mainScene = game.scene.getScene('MainScene');
        // mainScene.players = new Players(mainScene);

        // ---
        this.socket = new Socket();
        mainScene.socket = this.socket;
        // ---

        // Set opponent screen
        // this.scene.stop();

        //new Players(this);

        // ---
        this.scene
            .launch('StartScene', {
                setPlaneScene: this,
            })
            .bringToTop('StartScene');
        // ---

        // let cls = localStorage.getItem('lastPlaceCells').split(',');
        // this.drawByCells(cls);
    }

    addStartGame() {
        this.add
            .image(630 * game.zoom, 384 * game.zoom, 'btn-start-game')
            .setScale(game.zoom)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => {
                let keys = Object.keys(this.planes);
                let keysLength = keys.length;

                if (keysLength < 2) {
                    // add 2 planes
                    console.log('Add 2 planes to map');
                    return;
                }

                this.scene.stop();
                this.scene.start('MainScene', {
                    planesData: {
                        //cells: allPlanesCells,
                        planes: this.planes,
                    },
                });
            });
    }

    // debug
    drawByCells(cells) {
        cells.forEach((cl) => {
            //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
            var graphics = this.add.graphics({
                lineStyle: { width: 3, color: 0x000000 },
            });
            graphics.strokeRectShape(this.cells[cl].rect);
        });
    }
}

export default SetPlaneScene;
