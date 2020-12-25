import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import * as workerTimers from 'worker-timers'
import config from "@/config"

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    workTimer: config.workTimer,
    breakTimer: config.breakTimer,
    currentTimer: config.currentTimer,
    isPlay: config.isPlay,
    timerId: null,
    finishTime: null
  },

  mutations: {
    countdown (state) {
      // активируем таймер
      store.commit('setPlayState', true)

      // устанавливаем время в миллисекундах окончания таймера
      store.commit('setFinishTime')

      function workSecCount() {
        // получаем новое время
        state[state.currentTimer] = Math.ceil((state.finishTime - new Date().getTime()) / 1000)

        // устанавливаем title страницы
        store.commit('setTitleOfTime')

        if (state[state.currentTimer] < 0) {
          // останавливаем таймер
          store.dispatch('stopTimer')

          // переключаем активный таймер
          store.dispatch('changeCurrentTimer')

          // проигрываем мелодию при завершении таймера
          store.dispatch('finishAudio')
        }
      }

      workSecCount()
      state.timerId = workerTimers.setInterval(workSecCount, 1000)
    },

    // установка состояния таймера
    setPlayState(state, payload) {
      state.isPlay = payload // флаг активности таймера
    },

    // время в миллесекундах окончания таймера
    setFinishTime(state) {
      state.finishTime = new Date().getTime() + state[state.currentTimer] * 1000
    },

    // установка активного таймера
    setCurrentTimer(state, payload) {
      state.currentTimer = payload
    },

    // установка title страницы
    setTitleOfTime(state) {
      let minCount = Math.floor(state[state.currentTimer] / 60);
      let secCount = state[state.currentTimer] % 60;

      document.title = minCount + ':' + (secCount < 10 ? '0' + secCount : secCount) + ' - Tomer'
    },

    // сброс title страницы
    resetTitle() {
      document.title = 'Tomer'
    },

    // сброс значений таймеров
    reset(state) {
      state.workTimer = config.workTimer
      state.breakTimer = config.breakTimer
    }
  },

  actions: {
    // остановка таймера
    stopTimer() {
      // удаляем таймер
      store.dispatch('timerDestroy')

      // отключаем таймер
      store.commit('setPlayState', false)

      // сбрасываем все значения
      store.commit('reset')

      // сбрасываем title страницы
      store.commit('resetTitle')
    },

    // переключаем активный таймер
    changeCurrentTimer() {
      const newCurrentTimer = (store.state.currentTimer === 'breakTimer') ? 'workTimer' : 'breakTimer'
      store.commit('setCurrentTimer', newCurrentTimer)
    },

    // удаляем таймер
    timerDestroy(context) {
      if (context.state.timerId) {
        workerTimers.clearInterval(context.state.timerId)
        context.state.timerId = null
      }
    },

    // мелодия при завершении таймера
    finishAudio() {
      let audio = new Audio('/sounds/finishTimer.mp3')
      audio.play()
    },

    // мелодия при старте таймере
    startAudio() {
      let audio = new Audio('/sounds/startTimer.mp3')
      audio.play()
    },
    // мелодия при принудительной остановки таймера
    stopAudio() {
      let audio = new Audio('/sounds/stopTimer.mp3')
      audio.play()
    },

    // мелодия при смене таймера
    checkAudio() {
      let audio = new Audio('/sounds/check.mp3')
      audio.play()
    }
  }
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
