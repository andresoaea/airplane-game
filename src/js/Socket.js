class Socket {
    constructor() {
        const conn = new WebSocket('ws://localhost:8080/comm');
        conn.onopen = function(e) {
            console.log('Connection established!');
        };
        // conn.onmessage = (e) => {
        //     console.log(e.data);
        // };
        this.conn = conn;
    }

    send(msg) {
        return this.conn.send(msg);
    }
}

export default new Socket();
