class Socket {
    constructor() {
        const domain = 'localhost'; //192.168.0.105

        this.scene = game.scene.getScene('MainScene');
        const queryString = $.param(game.gameData.players.player);
        const url = `wss://${domain}/wss2/comm?${queryString}`;
        const conn = new WebSocket(url);

        conn.onopen = (e) => {
            console.log(`Connection established to ${url}`);
        };
        this.conn = conn;
        conn.onmessage = (e) => {
            // console.log(e.data);
            const msg = JSON.parse(e.data);
            this.handleReceivedMessage(msg);
        };

        conn.onerror = () => {
            Swal.fire({
                title: 'Ouups!',
                text:
                    "We can't connect to the server now. Please try again later.",
                icon: 'error',
                showConfirmButton: false,
            });
        };
    }

    handleReceivedMessage(msg) {
        if (!msg.action) return;
        console.log(msg);

        switch (msg.action) {
            case 'setMyRoom':
                //game.scene.getScene('SetOpponentScene').showMyRoomId(msg.room);
                game.bus.$emit('ShowMyRoomId', msg.room);
                game.gameData.turn.setIsMyTurn(true);
                break;
            case 'invalidRoom':
                //game.scene.getScene('SetOpponentScene').printInvalidRoom();
                game.bus.$emit('PrintInvalidRoom');
                break;
            case 'enterToRoom':
                game.gameData.setOpponent(msg.opponent);
                //game.scene.getScene('SetOpponentScene').startRoom(msg.room);
                game.bus.$emit('StartRoom', msg.room);
                break;
            case 'opponentDisconnected':
                this.doOpponentDisconnected(msg);
                break;
            case 'attack':
                this.doAttack(msg);
                game.gameData.turn.reverse();
                break;
            case 'setOpponentData':
                this.doSetOpponentData(msg);
                break;
        }
    }

    doSetOpponentData(msg) {
        this.scene.opponentData = msg.opponentData;
    }

    doAttack(msg) {
        const cellId = msg.cellClicked;
        if (!cellId) return;

        let isHit = false;
        const cellNum = cellId.replace('p', '');
        const rect = this.scene.cells[cellId.replace('p', 'o')].rect;

        game.gameData.turn.printAttackedText(cellNum);

        Object.keys(this.scene.myPlanes).forEach((planeKey) => {
            const currPlane = this.scene.myPlanes[planeKey].instance;
            // console.log(currPlane);

            if (currPlane.planeCells.includes(cellNum)) {
                // Targeted point
                const headHitted = cellNum == currPlane.headCell;
                const texture = headHitted ? 'fire-cap' : 'fire';

                const fire = this.scene.add
                    .image(rect.centerX, rect.centerY, texture)
                    .setScale(0.6 * game.zoom);

                if (!this.scene.fireGameObjects[planeKey]) {
                    this.scene.fireGameObjects[planeKey] = [];
                }
                this.scene.fireGameObjects[planeKey].push(fire);

                // Delete cell from plane cells
                currPlane.planeCells.splice(
                    currPlane.planeCells.indexOf(cellNum),
                    1
                );

                // console.log(currPlane.planeCells.length);
                if (headHitted || currPlane.planeCells.length === 0) {
                    //console.log('full discovered plane');
                    this.scene.destroyPlane(planeKey);
                }

                isHit = true;
            }
        });

        if (!isHit) {
            // Missed point
            this.scene.add
                .image(rect.centerX, rect.centerY, 'x')
                .setScale(0.4 * game.zoom);
        }
    }

    doOpponentDisconnected(msg) {
        console.log('opponent disconnected');
        game.bus.$emit('PrintOpponentDisconnected');
        this.scene.scene.start('SetPlaneScene');
    }
    // Used external
    send(msg) {
        if (this.conn.readyState === WebSocket.CLOSED) return;
        return this.conn.send(JSON.stringify(msg));
    }
}

export default Socket;
