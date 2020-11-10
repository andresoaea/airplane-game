import Players from './components/Players';
import Turn from './components/Turn';

class GameData {
    constructor() {
        // let imageNum = this.getId() == 1 ? 1 : 2;
        // //console.log(imageNum);
        // this.players = {
        //     player: {
        //         id: this.getId(),
        //         name: this.getId() == 1 ? 'Adeline' : 'Rudy',
        //         photo: `assets/images/profile-${imageNum}.jpg`,
        //     },
        // };

        this.players = {
            player: {
                id: this.generateUniqId(),
                name: null,
                photo: null,
            },
        };

        if (game.isInstant) {
            this.players.player = {
                id: FBInstant.player.getID(),
                name: FBInstant.player.getName(),
                photo: FBInstant.player.getPhoto(),
            };
        }
        this.turn = new Turn();
    }

    // Called from Socket class
    setOpponent(opponent) {
        this.players.opponent = opponent;

        const setPlaneScene = game.scene.getScene('SetPlaneScene');
        setPlaneScene.playersComponent = new Players(setPlaneScene);
    }

    // helper for debugging
    // getId() {
    //     return this.getParameterByName('userId') ?? 1;
    // }
    // getParameterByName(name, url = window.location.href) {
    //     name = name.replace(/[\[\]]/g, '\\$&');
    //     var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    //         results = regex.exec(url);
    //     if (!results) return null;
    //     if (!results[2]) return '';
    //     return decodeURIComponent(results[2].replace(/\+/g, ' '));
    // }

    generateUniqId() {
        return (
            new Date().getTime() +
            '-' +
            Math.random()
                .toString(36)
                .substr(2, 9)
        );
        // returns somethink like "1605022304112-9cq42s27v"
    }
}

export default GameData;
