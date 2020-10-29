class SetOpponentScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'SetOpponentScene',
        });
    }

    init(data) {
        this.setPlaneScene = data.setPlaneScene;
        this.events.on('shutdown', this.destroy, this);

        this.randSceneId = Math.floor(Math.random() * 100000);
    }

    create() {
        const html = `
            <div class="flex items-center rounded">

            <div class="flex w-full">
                <div class="col-create-room flex flex-1 justify-center items-center flex-col">
                    <p class="text-gray-800 mb-2">Create a room</p>
                    <button id="createRoom" class="bg-pink-700 px-4 py-2 text-white rounded">Create</button>
                </div> 
                <div class="col-go-to-room flex flex-1 justify-center items-center flex-col">
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
        el.classList = `scene-html scene-html-${this.randSceneId} absolute t-0 l-0 flex justify-center items-center`;
        $('#game').append(el);

        $('body').one('click', '#createRoom', this.getMyRoom.bind(this));
        $('body').one('click', '#goToRoom', () => {
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
        const $sceneHtml = $(`.scene-html-${this.randSceneId}`);
        const $colCreateRoom = $sceneHtml.find('.col-create-room');

        $sceneHtml
            .find('#createRoom')
            .after(`<h4>${id}</h4>`)
            .remove();

        $colCreateRoom
            .find('p')
            .text('Your opponent can connect to this room code:');

        $colCreateRoom.find('h4').after(`
                <small class="text-green-600 mt-2">Waiting for opponent to connect...<small>
                <button class="go-back bg-blue-400 block mx-auto mt-4 px-4 py-2 text-white rounded">Go back</button>
            `);
        $sceneHtml.find('.col-go-to-room').hide();

        $('body').one('click', '.go-back', () => {
            this.scene.restart();

            // this.setPlaneScene.scene.launch('SetOpponentScene', {
            //     setPlaneScene: this.setPlaneScene,
            // });
        });
    }

    destroy() {
        const $sceneHtml = $(`.scene-html-${this.randSceneId}`);
        $('body').off();
        $sceneHtml.fadeOut(500, () => {
            $sceneHtml.remove();
            console.log('removed');
        });
    }
}

export default SetOpponentScene;
