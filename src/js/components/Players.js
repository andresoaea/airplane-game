class Players {
    constructor() {
        this.player = {
            id: this.getParameterByName('userId') ?? '1',
            name: 'User',
            photo: null,
        };

        this.opponent = {
            id: this.getParameterByName('opponentId') ?? '2',
            name: 'UserOpponent',
            photo: null,
        };
    }

    // helper for debugging
    getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}

export default Players;
