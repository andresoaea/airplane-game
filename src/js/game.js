import Phaser from 'phaser';
// import moment, { lang } from 'moment';
// import Swal from 'sweetalert2';

// window.moment = moment;
// window.Swal = Swal;

// //indow.jQuery = window.$ = require('jquery');
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

window.SOCKET_URL = 'ws://localhost:8080/play';

import MainScene from './scenes/MainScene';
const mainScene = new MainScene();

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
game.scene.add('MainScene', mainScene);
game.scene.start('MainScene');
window.game = game;
