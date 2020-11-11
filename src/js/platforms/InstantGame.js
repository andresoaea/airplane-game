import Helpers from '../helpers';

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
        FBInstant.context
            .chooseAsync({
                //filters: ['NEW_CONTEXT_ONLY'],
                minSize: 2,
                maxSize: 2,
            })
            .then(() => {
                const contextId = FBInstant.context.getID();
                InstantGame.sendInvitation(contextId);
            });
    }

    static getPlayersInContext(context) {
        FBInstant.context.getPlayersAsync().then((players) =>
            players.forEach((player) => {
                console.log(player.getName());
            })
        );
    }

    static sendInvitation(contextId) {
        console.log('here i am');
        let imgFromPage =
            'https://scontent-otp1-1.xx.fbcdn.net/v/t1.0-9/122407489_115339883698070_2455859213577006635_o.png?_nc_cat=109&ccb=2&_nc_sid=e3f864&_nc_ohc=Ba9lBJPNSvAAX9dUL_J&_nc_ht=scontent-otp1-1.xx&oh=7176ceb57e153dd9fcc4dab798da1247&oe=5FD1A548';

        Helpers.convertImgToBase64URL(imgFromPage, (base64) => {
            InstantGame.sendMessage(base64, contextId);
        });
    }

    static sendMessage(base64image, contextId) {
        console.log('here i am');

        let playerName = FBInstant.player.getName();
        let payload = {
            cta: 'Go Play!',
            data: { contextId: contextId },
            text: `${playerName} invited you to play a match now`,
            image: base64image,
            action: 'CUSTOM',
            template: 'INVITE',
            strategy: 'IMMEDIATE',
            notification: 'NO_PUSH',
        };

        FBInstant.updateAsync(payload)
            .then(() => {
                console.log('Message was posted!');
            })
            .catch(function(error) {
                console.log('Message was not posted: ' + error.message);
            });
    }
}

export default InstantGame;
