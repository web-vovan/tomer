<template>
  <div id="app">
    <header>
      <img src="./assets/img/logo.svg" class="logo" alt="">
      <h1>Tomer</h1>
    </header>

    <div class="timer-wrap">
      <div
          class="item"
          data-timer="workTimer"
          v-on:click="activateTimer"
          v-bind:class="{ active: currentTimer === 'workTimer' }"
      >
        {{ workTimer }}
      </div>
      <div
          class="item"
          data-timer="breakTimer"
          v-on:click="activateTimer"
          v-bind:class="{ active: currentTimer === 'breakTimer' }">
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
     currentTimer() {
       return this.$store.state.currentTimer
     }
   },
   methods: {
     startTimer() {
       this.$store.dispatch('startAudio')
       this.$store.commit('countdown')
     },
     stopTimer() {
       this.$store.dispatch('stopAudio')
       this.$store.dispatch('stopTimer')
     },
     // проигрываем мелодию в зависимости от активности таймера
     playAudioAfterChange() {
       (this.$store.state.isPlay) ? this.$store.dispatch('stopAudio') : this.$store.dispatch('checkAudio');
     },
     activateTimer: function(event) {
       // проигрываем мелодию
       this.playAudioAfterChange()

       // останавливаем таймер
       this.$store.dispatch('stopTimer')

       // меняем активный таймер
       this.$store.commit('setCurrentTimer', event.target.dataset.timer)
     },
     keyEvent(event) {
       // при нажатии на пробел включаем/останавливаем таймер
       if (event.code === 'Space') {
         // проигрываем мелодию в зависимости от активности таймера
         (this.$store.state.isPlay) ? this.$store.dispatch('stopAudio') : this.$store.dispatch('startAudio');

         (this.$store.state.isPlay) ? this.$store.dispatch('stopTimer') : this.$store.commit('countdown');
       }

       // при клике на стрелку вправо выбираем таймер отдыха
       if (event.code === 'ArrowRight') {
         // проигрываем мелодию
         this.playAudioAfterChange()

         // останавливаем таймер
         this.$store.dispatch('stopTimer')

         // меняем активный таймер
         this.$store.commit('setCurrentTimer', 'breakTimer')
       }

       // при клике на стрелку влево выбираем таймер работы
       if (event.code === 'ArrowLeft') {
         // проигрываем мелодию
         this.playAudioAfterChange()

         // останавливаем таймер
         this.$store.dispatch('stopTimer')

         // меняем активный таймер
         this.$store.commit('setCurrentTimer', 'workTimer')
       }
     }
   },
   created() {
     window.addEventListener('keyup', this.keyEvent)
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
    width: 470px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,.1);
    overflow: hidden;
    max-width: 90%;
  }
  header {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
  }
  .logo {
    width: 50px;
    margin-right: 20px;
  }
  h1 {
    font-size: 40px;
    color: #d23834;
    margin: 40px 0;
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
    margin-bottom: 40px;
  }
  .timer-button img{
    width: 70px;
    cursor: pointer;
  }
</style>
