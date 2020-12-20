<template>
  <div id="app">
    <table>
      <tr>
        <td>workTime</td>
        <td>breakTime</td>
      </tr>
      <tr>
        <td>{{ workTime }}</td>
        <td>{{ breakTime }}</td>
      </tr>
    </table>
    <button v-if="isPlay" v-on:click="countdown">stop</button>
    <button v-else v-on:click="countdown">start</button>
  </div>
</template>

<script>
 export default {
   data() {
     return {
       play: false
     }
   },
   computed: {
     workTime() {
       return this.$store.state.workTime
     },
     breakTime() {
       return this.$store.state.breakTime
     },
     isPlay() {
       return this.play
     }
   },
   methods: {
     countdown() {
       this.play = true
       this.$store.commit('countdownWorkTime')
     }
   }
 }
</script>

<style>

</style>
