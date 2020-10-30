class Players {
    constructor(scene) {
        this.scene = scene;
        this.player = game.gameData.players.player;
        this.opponent = game.gameData.players.opponent;

        this.printBackground();
        this.printPlayer();
        this.loadOpponent();
    }

    printBackground() {
        const rect = new Phaser.Geom.Rectangle(0, 0, game.config.width, 70);
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x000000, 0.6);
        graphics.fillRectShape(rect);
    }

    loadOpponent() {
        if (this.scene.textures.exists(`opponent-${this.opponent.id}`)) {
            this.printOpponent();
            return;
        }

        this.scene.load.image(
            `opponent-${this.opponent.id}`,
            this.opponent.photo
        );
        this.scene.load.on('complete', this.printOpponent, this);
        this.scene.load.start();
    }

    printPlayer() {
        this.printPlayerPhoto('player', 30, 10);
        this.printPlayerName(this.player.name, 90, 50, 0);
    }

    printOpponent() {
        this.printPlayerPhoto(
            `opponent-${this.opponent.id}`,
            game.config.width - 80,
            10
        );
        this.printPlayerName(this.opponent.name, game.config.width - 90, 50);
    }

    printPlayerPhoto(key, x, y) {
        const width = 50;
        const height = width;

        // Create mask
        const shape = this.scene.add.graphics();
        shape.fillStyle(0x000000, 1);
        shape.fillRoundedRect(x, y, width, height, 6);
        const mask = shape.createGeometryMask();

        // Add player image
        const img = this.scene.add
            .image(x, y, key)
            .setDepth(4)
            .setMask(mask)
            .setOrigin(0);

        img.displayWidth = width;
        img.displayHeight = height;
    }

    printPlayerName(name, x, y, originX = 1) {
        this.scene.add
            .text(x, y, name, {
                color: '#fff',
                fontFamily: 'Righteous',
                stroke: 'rgba(0,0,0,.6)',
                strokeThickness: 1,
                fontSize: '20px',
            })
            .setOrigin(originX, 0.5)
            .setDepth(4);
    }
}

export default Players;
