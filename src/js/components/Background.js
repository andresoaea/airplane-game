class Background {
    constructor(scene) {
        this.scene = scene;
        this.draw();
    }

    draw() {
        const x = 0;
        const y = 0;
        const squareWidth = game.opts.cellSize;
        const cellsNum = 26;

        for (let i = 0; i < cellsNum; i++) {
            // Go vertical
            for (let j = 0; j < cellsNum; j++) {
                // Go horizontal
                this.drawSingleRect(
                    x + j * squareWidth,
                    y + i * squareWidth,
                    squareWidth,
                    i,
                    j
                );
            }
        }
    }

    drawSingleRect(x, y, squareWidth, i, j) {
        const rect = new Phaser.Geom.Rectangle(x, y, squareWidth, squareWidth);
        const graphics = this.scene.add.graphics({
            lineStyle: { width: 1 * game.zoom, color: 0xeeeeee },
        });
        graphics.strokeRectShape(rect);
    }
}

export default Background;
