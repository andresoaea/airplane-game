class SetOpponentScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'SetOpponentScene',
        });
    }

    init(data) {
        this.setPlaneScene = data.setPlaneScene;
        this.events.on('shutdown', this.destroy, this);
    }

    create() {
        const html = `
            <div class="flex items-center rounded">

            <div class="flex w-full">
                <div class="flex flex-1 justify-center items-center flex-col">
                    <p class="text-gray-800 mb-2">Create a room</p>
                    <button id="createRoom" class="bg-pink-700 px-4 py-2 text-white rounded">Create</button>
                </div> 
                <div class="flex flex-1 justify-center items-center flex-col">
                <p class="text-gray-800 mb-2">Go to a room</p>
                    <input id="roomId" class="mb-2" value="0000" type="text" />
                    <button id="goToRoom" class="bg-blue-700 px-4 py-2 text-white rounded">Go play</button>
                </div> 

            </div> 

            </div>
        `;

        const el = document.createElement('div');
        el.innerHTML = html;
        el.style.width = $('canvas').width() + 'px';
        el.style.height = $('canvas').height() + 'px';
        el.classList =
            'scene-html absolute t-0 l-0 flex justify-center items-center';
        $('#game').append(el);

        $('body').on('click', '#createRoom', this.getMyRoom.bind(this));
        $('body').on('click', '#goToRoom', () => {
            console.log($('#roomId').val());
        });
    }

    getMyRoom() {
        this.setPlaneScene.socket.send({
            action: 'getMyRoom',
        });
    }

    // Called from Socket class on message received from server
    showMyRoomId(id) {
        $('#createRoom')
            .after(`<h4>${id}</h4>`)
            .remove();
    }

    destroy() {
        $('.scene-html').fadeOut(500, () => {
            $('.scene-html').remove();
            console.log('removed');
        });
    }
}

export default SetOpponentScene;
