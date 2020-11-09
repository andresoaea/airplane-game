import Players from './components/Players';
import Turn from './components/Turn';

class GameData {
    constructor() {
        let imageNum = this.getId() == 1 ? 1 : 2;
        //console.log(imageNum);
        this.players = {
            player: {
                id: this.getId(),
                name: this.getId() == 1 ? 'Adeline' : 'Rudy',
                photo: `assets/images/profile-${imageNum}.jpg`,
            },
        };

        this.turn = new Turn();
    }

    // Called from Socket class
    setOpponent(opponent) {
        this.players.opponent = opponent;

        const setPlaneScene = game.scene.getScene('SetPlaneScene');
        setPlaneScene.playersComponent = new Players(setPlaneScene);
    }

    // helper for debugging
    getId() {
        return this.getParameterByName('userId') ?? 1;
    }
    getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}

export default GameData;
