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
        this.updateTurnText();
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
}

export default Turn;
