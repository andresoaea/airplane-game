class InstantGame {
    static isInstantGame() {
        return true;
    }
    static init() {
        return new Promise((resolve) => {
            FBInstant.initializeAsync().then(() => {
                FBInstant.setLoadingProgress(100);
                FBInstant.startGameAsync().then(() => {
                    // start game
                    resolve();
                });
            });
        });
    }

    static match() {
        FBInstant.checkCanPlayerMatchAsync().then(function(canMatch) {
            if (canMatch) {
                FBInstant.matchPlayerAsync(null, true).then(function() {
                    const room = FBInstant.context.getID();
                    game.bus.$emit('matchToRoom', room);
                });
            } else {
                // Player cannot match
                console.log('cannot match');
            }
        });
    }

    static chooseContext() {
        FBInstant.context.chooseAsync().then(() => {
            console.log(FBInstant.context.getID());
            // 1234567890
        });
    }

    static getPlayersInContext(context) {
        FBInstant.context.getPlayersAsync().then((players) =>
            players.forEach((player) => {
                console.log(player.getName());
            })
        );
    }
}

export default InstantGame;
