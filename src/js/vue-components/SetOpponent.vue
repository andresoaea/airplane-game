<template>
  <div
    v-if="show"
    class="scene-html w-full h-full absolute t-0 l-0 flex justify-center items-center animate__animated animate__fadeIn"
  >
    <div class="flex items-center rounded animate__animated animate__backInDown">
      <div class="flex w-full">
        <div class="col-create-room flex flex-1 justify-center items-center flex-col">
          <p class="text-gray-800 mb-2">Create a room</p>
          <button @click="createRoom()" class="bg-pink-700 px-4 py-2 text-white rounded">Create</button>
        </div>
        <div class="col-go-to-room flex flex-1 justify-center items-center flex-col">
          <p class="text-gray-800 mb-2">Go to a room</p>

          <ul>
            <li v-for="(code,i) in codes" :key="i" class="flex flex-col mx-10">
              <i @click="increaseNum(i)" class="fa fa-caret-up" aria-hidden="true"></i>
              <!-- <input type="text" v-model="codes[i].val" /> -->
              <span>{{ codes[i].val }}</span>
              <i @click="decreaseNum(i)" class="fa fa-caret-down" aria-hidden="true"></i>
            </li>
          </ul>

          <!-- <input id="roomId" class="mb-2" value="0000" type="text" /> -->
          <button @click="goToRoom()" class="bg-blue-700 px-4 py-2 text-white rounded">Go play</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "set-opponent",
  data() {
    return {
      show: true,
      codes: [{ val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }]
    };
  },
  mounted() {
    game.bus.$on("showSetOpponent", () => (this.show = true));
  },
  methods: {
    createRoom() {
      game.scene.getScene("SetPlaneScene").socket.send({
        action: "getMyRoom"
      });
    },
    goToRoom() {
      const roomCode = this.codes.map(code => code.val).join("");

      console.log(roomCode);
    },
    increaseNum(key) {
      if (this.codes[key].val >= 9) return;
      this.codes[key].val++;
    },
    decreaseNum(key) {
      if (this.codes[key].val <= 0) return;
      this.codes[key].val--;
    }
  }
};
</script>

<style scoped lang="scss">
ul {
  display: inherit;
}
</style>

