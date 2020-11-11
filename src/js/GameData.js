import Players from './components/Players';
import Turn from './components/Turn';

class GameData {
    constructor() {
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

    generateUniqId() {
        // Generate unique id, something like "1605022304112-9cq42s27v"
        return (
            new Date().getTime() +
            '-' +
            Math.random()
                .toString(36)
                .substr(2, 9)
        );
    }
}

export default GameData;
