class Explode {
    constructor(scene) {
        this.scene = scene;
        this.create();
    }

    create() {
        this.rt = this.scene.make
            .renderTexture({ x: 0, y: 0, width: 100, height: 100 })
            .setOrigin(0, 0);

        this.blast = this.scene.add.follower(null, 50, 150, 'smoke');
        this.blast
            .setAlpha(0)
            .setScale(game.zoom / 2)
            .setDepth(6);

        this.nuke = this.scene.tweens.add({
            targets: [this.blast],
            scaleX: 6 * (game.zoom / 2),
            scaleY: 6 * (game.zoom / 2),
            alpha: 0,
            duration: 1000,
            ease: 'Bounce.easeIn',
            onStart: () => {
                this.blast.alpha = 1;
            },
            onComplete: () => {
                this.rt.clear();
                this.blast.alpha = 0;
            },
            paused: true,
        });

        this.nuke.setCallback('onUpdate', this.draw.bind(this), [], this);

        // this.scene.input.on('pointerdown', (pointer) => {
        //     this.generate(pointer.x, pointer.y);
        // });
    }

    generate(x, y) {
        this.blast.x = x;
        this.blast.y = y;
        this.blast.setScale(0.5);
        this.blast.alpha = 1;

        this.nuke.play();

        let points = [
            100 / 3,
            300 / 3,
            400 / 3,
            300 / 3,
            425 / 3,
            275 / 3,
            100 / 3,
            300 / 3,
            200 / 3,
            300 / 3,
            200 / 3,
            150 / 3,
        ];

        let curve = new Phaser.Curves.Spline(points);

        this.blast.setPath(curve);
        this.blast.startFollow(200);
    }

    draw() {
        // this.rt.save();

        let crot = Math.cos(this.blast.rotation + Math.random() * 2);
        let srot = Math.sin(this.blast.rotation + Math.random() * 2);

        let rand = Math.random() * 2;

        let sx = this.blast.scaleX + rand;
        let sy = this.blast.scaleY + rand;

        if (Math.random() < 0.8) {
            this.blast.setTexture('explode');
        } else {
            this.blast.setTexture('smoke');
        }

        this.rt.currentMatrix = [
            crot * sx,
            srot,
            -srot,
            crot * sy,
            this.blast.x,
            this.blast.y,
        ];
        this.rt.setAlpha(this.blast.alpha);
        this.rt.draw(
            this.blast.texture,
            this.blast.frame,
            -this.blast.width / 2,
            -this.blast.height / 2
        );
        // this.rt.restore();
    }
}

export default Explode;
