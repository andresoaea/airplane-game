<template>
  <div
    v-if="show"
    class="scene-html w-full h-full absolute t-0 l-0 flex justify-center items-center animate__animated animate__fadeIn"
  >
    <set-opponent-by-room-code v-if="component ==='roomCode'"></set-opponent-by-room-code>
    <set-opponent-by-fb-match v-if="component ==='fbMatch'"></set-opponent-by-fb-match>
  </div>
</template>

<script>
import SetOpponentByRoomCode from "./SetOpponentByRoomCode.vue";
import SetOpponentByFbMatch from "./SetOpponentByFbMatch.vue";

export default {
  name: "set-opponent",
  components: {
    SetOpponentByRoomCode,
    SetOpponentByFbMatch
  },
  data() {
    return {
      component: game.isInstant ? "fbMatch" : "roomCode",
      show: false
    };
  },
  created() {
    game.bus.$on("changeComponent", component => {
      this.component = component;
    });

    game.bus.$on("showSetOpponent", bool => {
      //this.codes.map(code => (code.val = 0));
      //this.toShow = "initRoom";
      this.show = bool;
    });
  },
  methods: {}
};
</script>

