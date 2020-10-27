import Phaser from 'phaser';
// import moment, { lang } from 'moment';
// import Swal from 'sweetalert2';

// window.moment = moment;
// window.Swal = Swal;

window.jQuery = window.$ = require('jquery');
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import LoadScene from './scenes/LoadScene';
import MainScene from './scenes/MainScene';
import SetPlaneScene from './scenes/SetPlaneScene';
import SetOpponentScene from './scenes/SetOpponentScene';

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 458,
    parent: 'game',
    // physics: {
    //     default: 'arcade',
    //     arcade: {
    //         gravity: { y: 800 },
    //         //debug: true
    //     },
    // },
    title: 'The Airplanes with Friends',
    url: '',
    version: '1.0.0',
};

let game = new Phaser.Game(config);
game.scene.add('LoadScene', new LoadScene());
game.scene.add('MainScene', new MainScene());
game.scene.add('SetPlaneScene', new SetPlaneScene());
game.scene.add('SetOpponentScene', new SetOpponentScene());
game.scene.start('LoadScene');
window.game = game;
