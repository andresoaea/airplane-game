import Socket from '../Socket';
import Map from '../components/Map';
import Plane from '../components/Plane';
import Background from '../components/Background';

class SetPlaneScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'SetPlaneScene',
            physics: {
                arcade: {
                    //debug: true,
                },
            },
        });

        //this.cellSize = 40;
        // this.cells = [];

        // this.planes = {};
        // this.planesGameObjects = [];
    }

    init() {
        this.cameras.main.setBackgroundColor('#fff');
    }

    create() {
        this.cells = [];
        this.planes = {};
        this.planesGameObjects = [];

        // this.drawSceneBackground();
        const background = new Background(this);

        // // Setup players
        //this.players = new Players(this);

        // const x = 120;
        // const y = 80;
        // this.drawPlayerMap(x, y);
        const map = new Map(this, 96, 98);

        //this.plane = new Plane(this);
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

        //
        //
        ///
        // this.scene.launch('SetOpponentScene', {
        //     setPlaneScene: this,
        // });

        // setTimeout(() => {
        //     this.scene.stop('SetOpponentScene');
        //     this.scene.resume();
        // }, 4000);

        //debug
        window.socket = this.socket;
        window.SetPlaneScene = this;

        // let cls = localStorage.getItem('lastPlaceCells').split(',');
        // this.drawByCells(cls);
    }

    addStartGame() {
        this.add
            .image(630 * game.zoom, 384 * game.zoom, 'btn-start-game')
            .setScale(game.zoom)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => {
                //// let heads = [];
                //let allPlanesCells = [];

                let keys = Object.keys(this.planes);
                let keysLength = keys.length;

                if (keysLength < 2) {
                    // add 2 planes
                    console.log('Add 2 planes to map');
                    return;
                }

                // for (let i = 0; i < keysLength; i++) {
                //     //heads.push(this.planes[keys[i]].cells[0]);
                //     allPlanesCells = [
                //         ...allPlanesCells,
                //         ...this.planes[keys[i]].cells,
                //     ];
                // }

                //console.log(this.planes);

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

    // drawPlayerMap(x, y) {
    //     const squareWidth = this.cellSize;
    //     const cellsNum = 8;

    //     for (let i = 0; i < cellsNum; i++) {
    //         // Go vertical
    //         for (let j = 0; j < cellsNum; j++) {
    //             // Go horizontal
    //             this.drawRect(
    //                 x + j * squareWidth,
    //                 y + i * squareWidth,
    //                 squareWidth,
    //                 i,
    //                 j
    //             );
    //         }
    //     }

    //     this.drawBorder(x, y, squareWidth, cellsNum);
    // }

    // drawBorder(x, y, squareWidth, cellsNum) {
    //     let width = squareWidth * cellsNum;
    //     let rect = new Phaser.Geom.Rectangle(x, y, width, width);
    //     //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    //     let graphics = this.add.graphics({
    //         lineStyle: { width: 3, color: 0x000000 },
    //     });
    //     graphics.strokeRectShape(rect);

    //     this.dropZoneRect = rect;
    // }

    // drawRect(x, y, squareWidth, i, j, type) {
    //     let rect = new Phaser.Geom.Rectangle(x, y, squareWidth, squareWidth);
    //     //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    //     let graphics = this.add.graphics({
    //         lineStyle: { width: 1, color: 0x000000 },
    //     });
    //     graphics.strokeRectShape(rect);

    //     const id = `${j + 1}${i + 1}`;

    //     this.cells[id] = { id, rect };
    // }

    // drawSceneBackground() {
    //     const x = 0;
    //     const y = 0;
    //     const squareWidth = this.cellSize;
    //     const cellsNum = 20;

    //     for (let i = 0; i < cellsNum; i++) {
    //         // Go vertical
    //         for (let j = 0; j < cellsNum; j++) {
    //             // Go horizontal
    //             this.drawBgRect(
    //                 x + j * squareWidth,
    //                 y + i * squareWidth,
    //                 squareWidth,
    //                 i,
    //                 j
    //             );
    //         }
    //     }
    // }

    // drawBgRect(x, y, squareWidth, i, j) {
    //     let rect = new Phaser.Geom.Rectangle(x, y, squareWidth, squareWidth);
    //     //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    //     var graphics = this.add.graphics({
    //         lineStyle: { width: 1, color: 0xeeeeee },
    //     });
    //     graphics.strokeRectShape(rect);
    // }
}

export default SetPlaneScene;
