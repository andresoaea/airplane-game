class StartScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'StartScene',
        });
    }

    init(data) {
        this.setPlaneScene = data.setPlaneScene;
    }

    create() {
        const rect = new Phaser.Geom.Rectangle(
            0,
            0,
            game.config.width,
            game.config.height
        );
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 0.8);
        graphics.fillRectShape(rect);

        const playBtn = this.add
            .image(game.config.width / 2, game.config.height / 2, 'play-btn')
            .setScale(game.zoom * 0.5)
            .setAlpha(0.7)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', this.start, this);

        this.tweens.add({
            targets: [playBtn],
            scaleX: 0.6,
            scaleY: 0.6,
            alpha: 1,
            duration: 1000,
            repeat: -1,
            yoyo: true,
            ease: 'Circ.easeIn',
        });
    }

    start() {
        this.scene.stop();
        game.bus.$emit('showSetOpponent');
        // this.scene.launch('SetOpponentScene', {
        //     setPlaneScene: this.setPlaneScene,
        // });
    }
}

export default StartScene;
