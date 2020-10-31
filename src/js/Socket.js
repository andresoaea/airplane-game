class Socket {
    constructor() {
        this.scene = game.scene.getScene('MainScene');
        const queryString = $.param(game.gameData.players.player);
        const url = `ws://192.168.0.105:8080/comm?${queryString}`;
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
                game.scene.getScene('SetOpponentScene').showMyRoomId(msg.room);
                game.gameData.turn.setIsMyTurn(true);
                break;
            case 'invalidRoom':
                game.scene.getScene('SetOpponentScene').printInvalidRoom();
                break;
            case 'enterToRoom':
                game.gameData.setOpponent(msg.opponent);
                game.scene.getScene('SetOpponentScene').startRoom(msg.room);
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

        const rect = this.scene.cells[cellId.replace('p', 'o')].rect;

        if (this.scene.myPlanesCells.includes(cellId.replace('p', ''))) {
            // Targeted point
            this.scene.add
                .image(rect.centerX, rect.centerY, 'fire')
                .setScale(0.8);
        } else {
            // Missed point
            this.scene.add.image(rect.centerX, rect.centerY, 'x').setScale(0.8);
        }

        // const graphics = this.scene.add.graphics({
        //     fillStyle: { color },
        // });

        // graphics.fillRectShape(this.scene.cells[cellId.replace('p', 'o')].rect);
    }

    doOpponentDisconnected(msg) {
        console.log('opponent disconnected');
        this.scene.scene.start('SetPlaneScene');
    }
    // Used external
    send(msg) {
        if (this.conn.readyState === WebSocket.CLOSED) return;
        return this.conn.send(JSON.stringify(msg));
    }
}

export default Socket;
