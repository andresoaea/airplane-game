import GameData from '../GameData';

class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'LoadScene',
        });
    }

    init() {
        game.gameData = new GameData();
    }

    preload() {
        /**
         * LoadScene images
         */

        // this.load.multiatlas(
        //     'atlas',
        //     'assets/sprites/tp/atlas.json',
        //     'assets/sprites/tp'
        // );

        this.load.image('player', game.gameData.players.player.photo);

        this.load.image('play-btn', 'assets/images/play-btn.png');
        this.load.image('btn-start-game', 'assets/images/btn-start-game.png');

        this.load.image('x', 'assets/images/x.png');
        this.load.image('fire', 'assets/images/fire.png');
        this.load.image('fire-cap', 'assets/images/fire-cap.png');

        this.load.image('plane-1', 'assets/images/planes/plane-1.png');
        this.load.image('plane-2', 'assets/images/planes/plane-2.png');

        this.showPreloader();
    }

    showPreloader() {
        let scene = this;

        let fontStyle = {
            fontFamily: 'Play',
            fontSize: 28,
            color: '#ffffff',
            stroke: '#fff',
            strokeThickness: 2,
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000',
                blur: 0,
                stroke: true,
                fill: true,
            },
        };

        let progressBar = scene.add.graphics();
        let progressBox = scene.add.graphics();
        progressBox.fillStyle(0x222222, 0.05);
        progressBox.fillRect(
            (game.config.width - 250) / 2,
            game.config.height / 2 + 40,
            250,
            50
        );

        let width = scene.cameras.main.width;
        let height = scene.cameras.main.height;
        let loadingText = scene.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: fontStyle,
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = scene.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: fontStyle,
        });
        percentText.setOrigin(0.5, 0.5);

        scene.load.on('progress', function(value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xbf4689, 1);
            progressBar.fillRect(
                (game.config.width - 250) / 2 + 5,
                game.config.height / 2 + 50,
                240 * value,
                30
            );
        });

        scene.load.on('complete', function() {
            // console.log('preload done')

            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();

            //game.scene.start('Start');

            game.scene.start('SetPlaneScene');
        });
    }
}

export default LoadScene;
