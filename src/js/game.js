import Vue from 'vue';
import Phaser from 'phaser';
import Swal from 'sweetalert2';
import Helpers from './helpers';
import InstantGame from './platforms/InstantGame';

import LoadScene from './scenes/LoadScene';
import MainScene from './scenes/MainScene';
import StartScene from './scenes/StartScene';
import SetPlaneScene from './scenes/SetPlaneScene';

import SetOpponent from './vue-components/SetOpponent.vue';

window.Swal = Swal;
window.jQuery = window.$ = require('jquery');

// Override default revokeObjectURL method, so we can
// reuse loaded images outside Phaser
Phaser.Loader.File.revokeObjectURL = () => {};

const zoom = Helpers.getDevicePixelRatio();

const config = {
    type: Phaser.AUTO,
    width: 800 * zoom,
    height: 458 * zoom,
    parent: 'game',
    title: 'Airplanes with Friends',
    version: '0.1.0',
    url: '',
};

const game = new Phaser.Game(config);
game.bus = new Vue();
window.game = game;
game.zoom = zoom;
game.opts = {
    cellSize: 32 * zoom,
    defaultWidth: 800,
    defaultHeight: 458,
};

game.scene.add('LoadScene', new LoadScene());
game.scene.add('MainScene', new MainScene());
game.scene.add('StartScene', new StartScene());
game.scene.add('SetPlaneScene', new SetPlaneScene());

game.isInstant = InstantGame.isInstantGame();

if (game.isInstant) {
    game.InstantGame = InstantGame;
    InstantGame.init().then(() => start());
} else {
    start();
}

function start() {
    game.scene.start('LoadScene');
    Vue.prototype.game = game;
    new Vue({
        render: (h) => h(SetOpponent),
    }).$mount('#game div');
}
