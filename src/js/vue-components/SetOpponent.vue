<template>
    <div
        v-if="show"
        class="scene-html w-full h-full absolute t-0 l-0 flex justify-center items-center animate__animated animate__fadeIn"
    >
        <div
            class="flex items-center justify-center text-center rounded animate__animated animate__backInDown"
        >
            <div v-if="toShow === 'initRoom'" class="flex w-full">
                <div
                    class="col-create-room flex flex-1 justify-center items-center flex-col"
                >
                    <p class="text-gray-700 mb-2">Create a room</p>
                    <button
                        @click="createRoom()"
                        class="bg-pink-700 px-4 py-2 text-white rounded"
                    >
                        Create
                    </button>
                </div>
                <div
                    class="col-go-to-room flex flex-1 justify-center items-center flex-col"
                >
                    <p class="text-gray-700 mb-2">Go to a room</p>
                    <ul>
                        <li
                            v-for="(code, i) in codes"
                            :key="i"
                            class="flex flex-col mx-1"
                        >
                            <i
                                @click="increaseNum(i)"
                                class="fa fa-plus"
                                aria-hidden="true"
                            ></i>
                            <!-- <input type="text" v-model="codes[i].val" /> -->
                            <span class="bg-gray-800">{{ codes[i].val }}</span>
                            <i
                                @click="decreaseNum(i)"
                                class="fa fa-minus"
                                aria-hidden="true"
                            ></i>
                        </li>
                    </ul>
                    <button
                        @click="goToRoom()"
                        class="bg-blue-700 mt-1 px-4 py-2 text-white rounded"
                    >
                        Go play
                    </button>
                    <div v-if="roomError" class="room-error text-center mt-2">
                        <p class="text-red-600">Invalid room code..</p>
                        <p class="text-red-600 text-xs">
                            Try again with another code.
                        </p>
                    </div>
                </div>
            </div>
            <div v-if="toShow === 'roomCode'">
                <p class="text-gray-700">
                    Your opponent can connect to this room code:
                </p>
                <ul class="room-generated flex justify-center my-3">
                    <li v-for="num in roomCode.split('')" class="mx-1">
                        <span class="bg-gray-800">{{ num }}</span>
                    </li>
                </ul>
                <small class="text-green-600 mt-2"
                    >Waiting for opponent to connect...</small
                >
                <button
                    @click="goBack()"
                    class="go-back bg-blue-700 block mx-auto mt-4 px-4 py-2 text-white rounded"
                >
                    Go back
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'set-opponent',
    data() {
        return {
            show: false,
            toShow: 'initRoom',
            codes: [{ val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }],
            roomCode: '0000',
            roomError: false,
        };
    },
    mounted() {
        game.bus.$on('showSetOpponent', () => {
            this.codes.map((code) => (code.val = 0));
            this.toShow = 'initRoom';
            this.show = true;
        });

        game.bus.$on('ShowMyRoomId', (roomCode) => {
            this.roomCode = roomCode;
            this.toShow = 'roomCode';
        });

        game.bus.$on('PrintInvalidRoom', () => {
            this.roomError = true;
            setTimeout(() => {
                this.roomError = false;
            }, 2000);
        });

        game.bus.$on(
            'PrintOpponentDisconnected',
            this.printOpponentDisonnected
        );

        game.bus.$on('StartRoom', (roomToStart) => {
            if (roomToStart == this.roomCode) {
                // This is the room initiator player
                this.printOpponentConnected();
            } else {
                // This is the opponent
                this.show = false;
            }
        });
    },
    methods: {
        createRoom() {
            game.scene.getScene('SetPlaneScene').socket.send({
                action: 'getMyRoom',
            });
        },
        goToRoom() {
            if (this.roomError) return;
            const roomToGo = this.codes.map((code) => code.val).join('');
            if (roomToGo == this.roomCode) {
                game.bus.$emit('PrintInvalidRoom');
                return;
            }

            game.gameData.turn.setIsMyTurn(false);
            game.scene.getScene('SetPlaneScene').socket.send({
                action: 'goToRoom',
                room: roomToGo,
            });
        },
        increaseNum(key) {
            if (this.codes[key].val >= 9) return;
            this.codes[key].val++;
        },
        decreaseNum(key) {
            if (this.codes[key].val <= 0) return;
            this.codes[key].val--;
        },
        goBack() {
            this.toShow = 'initRoom';
        },
        printOpponentConnected() {
            Swal.fire({
                title: "Let's go!",
                text: 'Opponent connected',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                //console.log("execute then");
                this.show = false;
            });
        },
        printOpponentDisonnected() {
            Swal.fire({
                showConfirmButton: false,
                html: `<div class="no-opponent">
              <i class="fa fa-user-times text-red-700 mb-4" aria-hidden="true"></i>
              <p class="text-gray-700">Opponent has left the room..</p>    
          </div>`,
                timer: 2000,
            });
        },
    },
};
</script>

<style scoped lang="scss">
ul {
    &:not(.room-generated) {
        display: inherit;
    }

    li {
        span {
            width: 36px;
            height: 36px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #eee;
            border-radius: 2px;
        }

        i {
            text-align: center;
            // font-size: 40px;
            // margin: -8px 0;
            font-size: 23px;
            margin: 3px 0;
            cursor: pointer;
            color: #2d3748;
        }
    }
}
</style>
