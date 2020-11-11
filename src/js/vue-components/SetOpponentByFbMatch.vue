<template>
  <div class="text-center rounded animate__animated animate__backInDown">
    <p class="text-center text-gray-700 font-lg mt-10">Choose how to play</p>
    <div class="flex items-center mt-6 play-type">
      <div class="w-full flex justify-center items-center">
        <div @click="playWithRandomOpponent()" class="flex-1">
          <p>Play with random opponent</p>
        </div>
        <div class="flex-1">
          <p>Play with a friend</p>
        </div>
        <div @click="playByRoomCode()" class="flex-1">
          <img :src="this.getLoadedImageSrc('btn-start-game')" />
          <p>Play by room code</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "set-opponent-by-fb-match",
  created() {
    game.bus.$on("matchToRoom", room => {
      console.log("the room is", room);
    });
  },
  methods: {
    playByRoomCode() {
      game.bus.$emit("changeComponent", "roomCode");
    },
    playWithRandomOpponent() {
      game.InstantGame.match();
    },
    getLoadedImageSrc(imageKey) {
      const textures = game.scene.getScene("LoadScene").textures;
      const blobUrl = textures.list[imageKey].source[0].image.src;
      return blobUrl;
    }
  }
};
</script>

<style scoped lang="scss">
.play-type > div {
  cursor: pointer;
}
</style>