class Map {
    constructor(scene, x, y, type = null, isMainScene = false) {
        this.type = type;
        this.scene = scene;
        this.x = x * game.zoom;
        this.y = y * game.zoom;
        this.isMainScene = isMainScene;
        this.attackedCells = [];

        this.drawMap();
    }

    drawMap() {
        const squareWidth = game.opts.cellSize;
        const cellsNum = 10;

        for (let i = 0; i < cellsNum; i++) {
            // Go vertical
            for (let j = 0; j < cellsNum; j++) {
                // Go horizontal
                this.drawRect(
                    this.x + j * squareWidth,
                    this.y + i * squareWidth,
                    squareWidth,
                    i,
                    j
                );
            }
        }

        this.drawBorder(this.x, this.y, squareWidth, cellsNum);

        // Draw coordinates
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        for (let i = 0; i < letters.length; i++) {
            // Draw letters
            const letter = letters[i].toUpperCase();
            this.drawText(
                letter,
                this.x - game.opts.cellSize / 2,
                this.y + game.opts.cellSize / 2 + game.opts.cellSize * i
            );

            // Draw numbers
            this.drawText(
                i + 1,
                this.x + game.opts.cellSize / 2 + game.opts.cellSize * i,
                this.y - game.opts.cellSize / 2
            );
        }
    }

    drawBorder(x, y, squareWidth, cellsNum) {
        const width = squareWidth * cellsNum;
        const rect = new Phaser.Geom.Rectangle(x, y, width, width);
        const graphics = this.scene.add.graphics({
            lineStyle: { width: 3 * game.zoom, color: 0x424242 },
        });
        graphics.strokeRectShape(rect);

        this.scene.dropZoneRect = rect;
    }

    drawRect(x, y, squareWidth, i, j) {
        const rect = new Phaser.Geom.Rectangle(x, y, squareWidth, squareWidth);
        //   let graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
        const graphics = this.scene.add.graphics({
            lineStyle: { width: 1 * game.zoom, color: 0x424242 },
        });
        graphics.strokeRectShape(rect);

        if (this.isMainScene) {
            // Rect in MainScene
            graphics.setInteractive(
                new Phaser.Geom.Rectangle(x, y, squareWidth, squareWidth),
                Phaser.Geom.Rectangle.Contains
            );

            const owner = this.type === 'opponent' ? 'p' : 'o';

            const id = `${owner}${j + 1}${i + 1}`;
            this.scene.cells[id] = { graphics, rect };

            graphics.on('pointerdown', () => {
                if (this.type !== 'opponent') return;

                if ($.isEmptyObject(this.scene.opponentData)) {
                    console.log('opponent not ready yet');
                    return;
                }

                if (!this.scene.turn.isMyTurn) {
                    //console.log('not my turn');
                    game.gameData.turn.scaleText();
                    return;
                }

                const cellNum = `${j + 1}${i + 1}`;

                if (this.attackedCells.includes(cellNum)) {
                    console.log('Already attacked this target');
                    return;
                }

                this.scene.socket.send({
                    action: 'attack',
                    cellClicked: id,
                });

                let isHit = false;
                const opponentPlanes = this.scene.opponentData.planes;

                Object.keys(opponentPlanes).forEach((planeKey) => {
                    const currPlane = opponentPlanes[planeKey];

                    if (currPlane.cells.includes(cellNum)) {
                        // Targeted point
                        let gph = this.scene.add.graphics({
                            fillStyle: { color: 0x800000 },
                        });
                        gph.fillRectShape(rect);

                        const texture =
                            cellNum == currPlane.head ? 'fire-cap' : 'fire';

                        this.scene.add
                            .image(rect.centerX, rect.centerY, texture)
                            .setScale(0.6 * game.zoom);

                        isHit = true;
                    }
                });

                if (!isHit) {
                    // Missed point
                    this.scene.add
                        .image(rect.centerX, rect.centerY, 'x')
                        .setScale(0.4 * game.zoom);
                }

                this.attackedCells.push(cellNum);

                game.gameData.turn.reverse();
            });
        } else {
            // Rect in SetPlaneScene
            const id = `${j + 1}${i + 1}`;
            this.scene.cells[id] = { id, rect };
        }
    }

    drawText(text, x, y) {
        const fontSize = 16 * game.zoom;
        this.scene.add
            .text(x, y, text, {
                color: '#424242',
                fontFamily: 'Righteous',
                // stroke: '#000',
                // strokeThickness: 1,
                fontSize: `${fontSize}px`,
            })
            .setOrigin(0.5);
        // .setDepth(4);
    }
}

export default Map;
