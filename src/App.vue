<template>
  <div id="app">
    <header>
      <div class="logo"><img src="./assets/img/logo.svg" alt=""></div>
      <h1>Tomer</h1>
    </header>

    <div class="timer-wrap">
      <div
          class="item"
          data-timer="workTimer"
          v-on:click="activate"
          v-bind:class="{ active: activeTimer === 'workTimer' }"
      >
        {{ workTimer }}
      </div>
      <div
          class="item"
          data-timer="breakTimer"
          v-on:click="activate"
          v-bind:class="{ active: activeTimer === 'breakTimer' }">
        {{ breakTimer }}
      </div>
    </div>
    <div class="timer-button">
      <img src="./assets/img/start.svg" v-on:click="startTimer" v-if="!isPlay">
      <img src="./assets/img/stop.svg" v-on:click="stopTimer" v-else>
    </div>
  </div>
</template>

<script>
 export default {
   computed: {
     workTimer() {
       let minCount = Math.floor(this.$store.state.workTimer / 60);
       let secCount = this.$store.state.workTimer % 60;

       return minCount + ':' + (secCount < 10 ? '0' + secCount : secCount)
     },
     breakTimer() {
       let minCount = Math.floor(this.$store.state.breakTimer / 60);
       let secCount = this.$store.state.breakTimer % 60;

       return minCount + ':' + (secCount < 10 ? '0' + secCount : secCount)
     },
     isPlay() {
       return this.$store.state.isPlay
     },
     activeTimer() {
       return this.$store.state.activeTimer
     }
   },
   methods: {
     startTimer() {
       this.$store.commit('countdown')
     },
     stopTimer() {
       this.$store.commit('stopTimer')
     },
     activate: function(event) {
       this.$store.commit('setActiveTimer', {
         timer: event.target.dataset.timer
       })
       this.$store.dispatch('checkAudio')
     },
     change(event) {
       if (event.code === 'Space') {
         console.log('space');
       }
     }
   },
   created() {
     window.addEventListener('keyup', this.changeStatus)
   }
 }
</script>

<style>
  html,
  body {
    height: 100%;
  }
  body {
    margin: 0;
    padding: 0;
    background: #eee;
    font-family: 'Bubblegum Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #app {
    width: 500px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 4px 4px 10px rgba(0,0,0,.1);
    overflow: hidden;
    max-width: 90%;
  }
  header {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
  }
  .logo img {
    width: 50px;
    margin-right: 20px;
  }
  h1 {
    font-size: 40px;
    color: #d23834;
    margin: 30px 0;
  }
  .timer-wrap {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
  }
  .item {
    font-size: 30px;
    padding: 10px 20px;
    border: 5px solid #eee;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 15px 20px 15px;
    width: 110px;
    text-align: center;
    color: #88c057;
  }
  .active {
    border-color: #d23834;
  }
  .timer-button {
    text-align: center;
    margin-bottom: 30px;
  }
  .timer-button img{
    width: 70px;
    cursor: pointer;
  }

</style>
