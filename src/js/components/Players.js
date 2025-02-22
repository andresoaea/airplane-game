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
        const rect = new Phaser.Geom.Rectangle(
            0,
            0,
            game.config.width,
            66 * game.zoom
        );
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x000000, 0.6);
        graphics.fillRectShape(rect);
    }

    loadOpponent() {
        if (!this.opponent.photo) {
            // Print default image if opponent has no photo
            this.printOpponent();
            return;
        }

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
        const photoKey = this.player.photo ? 'player' : 'def-pilot';
        const name = this.player.name ?? 'You';

        this.printPlayerPhoto(photoKey, 30, 10);
        this.printPlayerName(name, 90, 50, 0);
    }

    printOpponent() {
        const photoKey = this.opponent.photo
            ? `opponent-${this.opponent.id}`
            : 'def-pilot-1';
        const name =
            this.opponent.name.length !== 0 ? this.opponent.name : 'Opponent';

        this.printPlayerPhoto(photoKey, game.opts.defaultWidth - 80, 10);
        this.printPlayerName(name, game.opts.defaultWidth - 90, 50);
    }

    printPlayerPhoto(key, x, y) {
        const width = 50 * game.zoom;
        const height = width;

        x = x * game.zoom;
        y = y * game.zoom;

        // Create mask
        const shape = this.scene.add.graphics();
        shape.fillStyle(0x000000, 1);
        shape.fillRoundedRect(x, y, width, height, 6 * game.zoom);
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
        const fontSize = 20 * game.zoom;
        this.scene.add
            .text(x * game.zoom, y * game.zoom, name, {
                color: '#fff',
                fontFamily: 'Righteous',
                stroke: 'rgba(0,0,0,.6)',
                strokeThickness: 1,
                fontSize: `${fontSize}px`,
            })
            .setOrigin(originX, 0.5)
            .setDepth(4);
    }
}

export default Players;
