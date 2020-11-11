import GameData from '../GameData';
import Background from '../components/Background';

class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'LoadScene',
        });
    }

    init() {
        game.gameData = new GameData();
        this.cameras.main.setBackgroundColor('#fff');
    }

    preload() {
        // dev
        // this.load.plugin(
        //     'PathBuilder.min',
        //     'src/js/PathBuilder.min.js',
        //     'PathBuilder'
        // );

        this.load.json('path', 'assets/path.json');

        /**
         * LoadScene images
         */
        // Player photo
        if (game.gameData.players.player.photo) {
            this.load.image('player', game.gameData.players.player.photo);
        } else {
            this.load.image('def-pilot', 'assets/images/def-pilot.png');
            this.load.image('def-pilot-1', 'assets/images/def-pilot-1.png');
        }

        // Buttons or other game elements
        this.load.image('play-btn', 'assets/images/play-btn.png');
        this.load.image('btn-start-game', 'assets/images/btn-start-game.png');

        // Fire & X
        this.load.image('x', 'assets/images/x.png');
        this.load.image('fire', 'assets/images/fire.png');
        this.load.image('fire-cap', 'assets/images/fire-cap.png');

        // Planes
        this.load.image('plane-1', 'assets/images/planes/plane-1.png');
        this.load.image('plane-2', 'assets/images/planes/plane-2.png');

        //Explosion images
        this.load.image('smoke', 'assets/images/particles/smoke-puff.png');
        this.load.image('explode', 'assets/images/particles/muzzleflash3.png');

        // // Testing load scene
        // for (let i = 0; i < 500; i++) {
        //     this.load.image('plane-' + i, 'assets/images/planes/plane-2.png');
        // }

        this.showPreloader();
    }

    showPreloader() {
        let scene = this;

        let bg = new Background(scene);

        let fontStyle = {
            fontFamily: 'Righteous',
            fontSize: 28 * game.zoom,
            color: '#2d3748',
            stroke: '#fff',
            strokeThickness: 2,
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#fff',
                blur: 0,
                stroke: true,
                fill: true,
            },
        };

        let progressBar = scene.add.graphics();
        let progressBox = scene.add.graphics();
        progressBox.fillStyle(0x222222, 0.05);
        progressBox.fillRect(
            (game.config.width - 250 * game.zoom) / 2,
            game.config.height / 2 + 40 * game.zoom,
            250 * game.zoom,
            50 * game.zoom
        );

        let width = scene.cameras.main.width;
        let height = scene.cameras.main.height;
        let loadingText = scene.make.text({
            x: width / 2,
            y: height / 2 - 50 * game.zoom,
            text: 'Loading...',
            style: fontStyle,
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = scene.make.text({
            x: width / 2,
            y: height / 2 - 5 * game.zoom,
            text: '0%',
            style: fontStyle,
        });
        percentText.setOrigin(0.5, 0.5);

        scene.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            // progressBar.fillStyle(0xbf4689, 1);
            progressBar.fillStyle(0x2d3748, 1);
            progressBar.fillRect(
                (game.config.width - 250 * game.zoom) / 2 + 5 * game.zoom,
                game.config.height / 2 + 50 * game.zoom,
                240 * value * game.zoom,
                30 * game.zoom
            );
        });

        scene.load.on('complete', () => {
            // console.log('preload done')

            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();

            //game.scene.start('Start');
            this.scene.stop();
            game.scene.start('SetPlaneScene');
        });
    }
}

export default LoadScene;
