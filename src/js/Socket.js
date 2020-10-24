class Socket {
    constructor(players) {
        const url = `ws://192.168.0.105:8080/comm?playerId=${players.player.id}&opponentId=${players.opponent.id}`;
        const conn = new WebSocket(url);
        conn.onopen = function(e) {
            console.log(`Connection established to ${url}`);
        };
        // conn.onmessage = (e) => {
        //     console.log(e.data);
        // };
        this.conn = conn;
    }

    send(msg) {
        if (this.conn.readyState === WebSocket.CLOSED) return;
        return this.conn.send(msg);
    }
}

export default Socket;
