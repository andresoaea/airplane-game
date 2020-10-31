// import Socket from '../Socket';
import Players from '../components/Players';

class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene',
        });

        this.cells = {};
        this.opponentData = {}; // it is set on Socket class when msg is received from opponent
    }

    init(data) {
        this.myPlanesCells = data.planesData.cells;
        this.myPlanes = data.planesData.planes;
        //console.log(this.myPlanesCells);
        // console.log('heads', this.myPlanesCells[0], this.myPlanesCells[10]);
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
        console.log('main create');

        this.drawSceneBackground();

        this.playersComponent = new Players(this);
        //this.game.scene.getScene('SetPlaneScene').players.opponent

        this.socket.send({
            action: 'setOpponentData',
            opponentData: {
                planesCells: this.myPlanesCells,
            },
        });

        this.drawPlayerMap(40, 80);
        this.drawPlayerMap(440, 80, 'opponent');

        this.drawPlanes();

        this.turn = game.gameData.turn;
        this.turn.setScene(this);

        //console.log(this.turn);

        //debug
        //window.Socket = Socket;
        window.MainScene = this;
        // this.drawByCells(this.myPlanesCells);
    }

    drawPlanes() {
        // console.log(this.myPlanes);
        Object.keys(this.myPlanes).forEach((planeKey) => {
            const playerMapLeftDiff = 2 * 40; // Difference between left margin of maps                                               // on SetPlaneScene and MainScene
            const plane = this.myPlanes[planeKey].instance;
            const planeImage = this.add
                .image(plane.x - playerMapLeftDiff, plane.y, plane.texture.key)
                .setAngle(plane.angle);
        });
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

            if ($.isEmptyObject(this.opponentData)) {
                console.log('opponent not ready yet');
                return;
            }

            if (!this.turn.isMyTurn) {
                console.log('not my turn');
                game.gameData.turn.scaleText();
                return;
            }

            this.socket.send({
                action: 'attack',
                cellClicked: id,
            });

            if (this.opponentData.planesCells.includes(`${j + 1}${i + 1}`)) {
                // Targeted point
                graphics = this.add.graphics({
                    fillStyle: { color: 0x000000 },
                });
                graphics.fillRectShape(rect);
            } else {
                // Missed point
                this.add.image(rect.centerX, rect.centerY, 'x').setScale(0.8);
            }

            game.gameData.turn.reverse();
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
