import Players from '../components/Players';
import Plane from '../components/Plane';

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

        this.cells = [];
    }

    init() {
        this.cameras.main.setBackgroundColor('#fff');
    }

    create() {
        this.drawSceneBackground();

        // Setup players
        this.players = new Players();

        // this.socket = new Socket(this.players);

        const x = 120;
        const y = 80;

        this.drawPlayerMap(x, y);

        //this.plane = new Plane(this);
        let plane = new Plane({
            scene: this,
            x: game.config.width / 2 + 200,
            y: 140,
        });

        //debug
        // window.Socket = Socket;
        window.SetPlaneScene = this;
    }

    drawPlayerMap(x, y) {
        const sqareWidth = 40;
        const cellsNum = 8;

        for (let i = 0; i < cellsNum; i++) {
            // Go vertical
            for (let j = 0; j < cellsNum; j++) {
                // Go horizontal
                this.drawRect(
                    x + j * sqareWidth,
                    y + i * sqareWidth,
                    sqareWidth,
                    i,
                    j
                );
            }
        }

        this.drawBorder(x, y, sqareWidth, cellsNum);
    }

    drawBorder(x, y, sqareWidth, cellsNum) {
        let width = sqareWidth * cellsNum;
        let rect = new Phaser.Geom.Rectangle(x, y, width, width);
        //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
        let graphics = this.add.graphics({
            lineStyle: { width: 3, color: 0x000000 },
        });
        graphics.strokeRectShape(rect);

        this.dropZoneRect = rect;
    }

    drawRect(x, y, sqareWidth, i, j, type) {
        let rect = new Phaser.Geom.Rectangle(x, y, sqareWidth, sqareWidth);
        //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
        let graphics = this.add.graphics({
            lineStyle: { width: 1, color: 0x000000 },
        });
        graphics.strokeRectShape(rect);

        const id = `${j + 1}${i + 1}`;
        this.cells[id] = { graphics, rect };
    }

    drawSceneBackground() {
        const x = 0;
        const y = 0;
        const sqareWidth = 40;
        const cellsNum = 20;

        for (let i = 0; i < cellsNum; i++) {
            // Go vertical
            for (let j = 0; j < cellsNum; j++) {
                // Go horizontal
                this.drawBgRect(
                    x + j * sqareWidth,
                    y + i * sqareWidth,
                    sqareWidth,
                    i,
                    j
                );
            }
        }
    }

    drawBgRect(x, y, sqareWidth, i, j) {
        let rect = new Phaser.Geom.Rectangle(x, y, sqareWidth, sqareWidth);
        //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
        var graphics = this.add.graphics({
            lineStyle: { width: 1, color: 0xeeeeee },
        });
        graphics.strokeRectShape(rect);
    }
}

export default SetPlaneScene;
