import Socket from '../Socket';

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

    create() {
        Socket.conn.onmessage = (e) => {
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

            graphics.fillRectShape(this.cells[cellId].rect);
        };

        const x = 40;
        const y = 80;

        this.drawPlayerMap(x, y);

        //debug
        window.Socket = Socket;
        window.MainScene = this;

        /// this.drawPlayerMap(440, y);
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
    }

    drawRect(x, y, sqareWidth, i, j) {
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
        const id = `${j + 1}${i + 1}`;
        this.cells[id] = { graphics, rect };
        // graphics.setData('id', id);
        graphics.on('pointerdown', () => {
            Socket.send(
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
}

export default MainScene;
