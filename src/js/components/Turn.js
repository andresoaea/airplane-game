class Turn {
    constructor() {
        this.text = null;
        this.isMyTurn = false; // used in Mainscene to allow/disallow clicking on cells
    }

    setScene(scene) {
        this.scene = scene;
        this.printTurnText();
        this.updateTurnText();
    }

    setIsMyTurn(bool) {
        this.isMyTurn = bool;
    }

    reverse() {
        this.isMyTurn = !this.isMyTurn;
        setTimeout(this.updateTurnText.bind(this), 2000);
    }

    getTurnText() {
        return this.isMyTurn ? 'Your turn' : 'Opponent turn. Please wait..';
    }

    printTurnText() {
        const fontSize = 16 * game.zoom;
        this.text = this.scene.add
            .text(game.config.width / 2, 36 * game.zoom, this.getTurnText(), {
                color: '#fff',
                fontFamily: 'Righteous',
                stroke: 'rgba(0,0,0,.6)',
                strokeThickness: 1,
                fontSize: `${fontSize}px`,
            })
            .setOrigin(0.5)
            .setDepth(4);
    }

    printAttackedText(cellNum) {
        const point = this.getLetterPoint(cellNum);
        this.text.setText(`Opponent attacked ${point}`).setColor('#fff');
        const tween = this.scene.tweens.add({
            targets: [this.text],
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 400,
            yoyo: true,
            onComplete: () => {
                //   this.text.setColor('#fff').setScale(1);
            },
        });
    }

    updateTurnText() {
        setTimeout(() => {
            const color = this.isMyTurn ? '#0a9c00' : '#f79e0f';
            this.text.setText(this.getTurnText()).setColor(color);

            const tween = this.scene.tweens.add({
                targets: [this.text],
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 400,
                yoyo: true,
                onComplete: () => {
                    this.text.setColor('#fff').setScale(1);
                },
            });
        }, 400);
    }

    scaleText() {
        this.text.setText(this.getTurnText()).setColor('#ff0000');
        const tween = this.scene.tweens.add({
            targets: [this.text],
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 400,
            yoyo: true,
            onComplete: () => {
                this.text.setColor('#fff').setScale(1);
            },
        });
    }

    getLetterPoint(cellNum) {
        let point;
        const splitted = cellNum.split('');
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

        if (/10/g.exec(cellNum) !== null) {
            if (cellNum === '1010') {
                point = 'J10';
            } else if (/^10/.exec(cellNum) !== null) {
                point = letters[splitted[2] - 1] + '10';
            } else {
                point = 'J' + splitted[0];
            }
        } else {
            point = letters[splitted[1] - 1] + splitted[0];
        }

        return point;
    }
}

export default Turn;
