class Socket {
    constructor(scene) {
        this.scene = scene;
        const url = `ws://192.168.0.105:8080/comm?playerId=${scene.players.player.id}&opponentId=${scene.players.opponent.id}`;
        const conn = new WebSocket(url);

        // //
        // this.toSend = null;
        // //

        conn.onopen = (e) => {
            console.log(`Connection established to ${url}`);
            // this.send(this.toSend);
        };
        this.conn = conn;
        conn.onmessage = (e) => {
            // console.log(e.data);
            const msg = JSON.parse(e.data);
            this.handleReceivedMessage(msg);
        };
    }

    handleReceivedMessage(msg) {
        if (!msg.action) return;
        console.log(msg);

        switch (msg.action) {
            case 'opponentDisconnected':
                this.doOpponentDisconnected(msg);
                break;
            case 'attack':
                this.doAttack(msg);
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

        const graphics = this.scene.add.graphics({
            fillStyle: { color: 0x0000ff },
        });

        graphics.fillRectShape(this.scene.cells[cellId.replace('p', 'o')].rect);
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

    // sendOnConnect(msg) {
    //     this.toSend = msg;
    // }
}

export default Socket;
