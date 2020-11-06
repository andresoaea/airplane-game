import Vue from 'vue';
import Phaser from 'phaser';
import Swal from 'sweetalert2';
import Helpers from './helpers';

window.Swal = Swal;
window.jQuery = window.$ = require('jquery');
// window.axios = require('axios');
// window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import LoadScene from './scenes/LoadScene';
import MainScene from './scenes/MainScene';
import StartScene from './scenes/StartScene';
import SetPlaneScene from './scenes/SetPlaneScene';
//import SetOpponentScene from './scenes/SetOpponentScene';

import SetOpponent from './vue-components/SetOpponent.vue';

const zoom = Helpers.getDevicePixelRatio();

const config = {
    type: Phaser.AUTO,
    width: 800 * zoom,
    height: 458 * zoom,
    parent: 'game',
    title: 'The Airplanes with Friends',
    version: '0.1.0',
    url: '',
};

const game = new Phaser.Game(config);

game.zoom = zoom;
game.opts = {
    cellSize: 32 * zoom,
    defaultWidth: 800,
    defaultHeight: 458,
};
game.bus = new Vue();

game.scene.add('LoadScene', new LoadScene());
game.scene.add('MainScene', new MainScene());
game.scene.add('StartScene', new StartScene());
game.scene.add('SetPlaneScene', new SetPlaneScene());
//game.scene.add('SetOpponentScene', new SetOpponentScene());
game.scene.start('LoadScene');

window.game = game;

new Vue({
    render: (h) => h(SetOpponent),
}).$mount('#game div');
