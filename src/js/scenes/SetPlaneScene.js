import Socket from '../Socket';
import Map from '../components/Map';
import Plane from '../components/Plane';
import Background from '../components/Background';
import PathFollower from 'phaser3-rex-plugins/plugins/pathfollower.js';

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

        this.playPlaneAnimation();
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

    playPlaneAnimation() {
        const path = new Phaser.Curves.Path(this.cache.json.get('path'));
        // var graphics = this.add.graphics().lineStyle(1, 0x2d2d2d, 1);
        // path.draw(graphics);
        const follower = this.add.follower(path, 0, 0, 'plane-1');
        follower.startFollow({
            duration: 8000,
            positionOnPath: true,
            repeat: -1,
            yoyo: true,
            ease: 'Linear',
            rotateToPath: true,
            verticalAdjust: true,
            rotationOffset: 90,
            // onUpdate: (tween) => {
            //     console.log(tween.progress);

            // },
        });

        this.animatedPlane = follower;

        // setTimeout(() => {
        //     follower.stopFollow();
        //     follower.destroy();
        // }, 5000);
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
