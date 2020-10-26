import Socket from '../Socket';
import Players from '../components/Players';

class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene',
            physics: {
                arcade: {
                    //debug: true,
                },
            },
        });

        this.cells = {};
    }

    init(data) {
        this.planesCells = data.planesData.cells;
        this.cameras.main.setBackgroundColor('#fff');
    }

    //debug
    drawByCells(cells) {
        console.log(this.cells);

        cells.forEach((cl) => {
            //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
            var graphics = this.add.graphics({
                lineStyle: { width: 3, color: 0x000000 },
            });
            graphics.strokeRectShape(this.cells[`o${cl}`].rect);
        });
    }

    create() {
        this.drawSceneBackground();

        // Setup players
        this.players = new Players();

        this.socket = new Socket(this.players);

        this.socket.conn.onmessage = (e) => {
            console.log(e.data);
            const msg = JSON.parse(e.data);

            if (msg.opponentDisconnected) {
                console.log('opponent disconnected');
                this.scene.restart();
            }

            const cellId = msg.cellClicked;
            if (!cellId) return;

            const graphics = this.add.graphics({
                fillStyle: { color: 0x0000ff },
            });

            graphics.fillRectShape(this.cells[cellId.replace('p', 'o')].rect);
        };

        const x = 40;
        const y = 80;

        this.drawPlayerMap(x, y);
        this.drawPlayerMap(440, y, 'opponent');

        //debug
        window.Socket = Socket;
        window.MainScene = this;
        this.drawByCells(this.planesCells);
    }

    drawPlayerMap(x, y, type = null) {
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
                    j,
                    type
                );
            }
        }
    }

    drawRect(x, y, sqareWidth, i, j, type) {
        let rect = new Phaser.Geom.Rectangle(x, y, sqareWidth, sqareWidth);
        //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
        var graphics = this.add.graphics({
            lineStyle: { width: 1, color: 0x0000aa },
        });
        graphics.strokeRectShape(rect);

        graphics.setInteractive(
            new Phaser.Geom.Rectangle(x, y, sqareWidth, sqareWidth),
            Phaser.Geom.Rectangle.Contains
        );

        const owner = type === 'opponent' ? 'p' : 'o';

        const id = `${owner}${j + 1}${i + 1}`;
        this.cells[id] = { graphics, rect };
        // graphics.setData('id', id);
        graphics.on('pointerdown', () => {
            if (type !== 'opponent') return;

            this.socket.send(
                JSON.stringify({
                    cellClicked: id,
                })
            );

            // console.log(graphics.getData('id'));
            graphics = this.add.graphics({
                fillStyle: { color: 0x0000ff },
            });

            graphics.fillRectShape(rect);
        });
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

export default MainScene;
