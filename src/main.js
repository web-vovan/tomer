import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import * as workerTimers from 'worker-timers'

Vue.use(Vuex)
Vue.config.productionTip = false

// конфиг
const config = {
  workTimer: 25 * 60, // рабочий таймер в секундах
  breakTimer: 7 * 60, // таймер отдыха в секундах
  activeTimer: 'workTimer', // активный таймер по умолчанию
  isPlay: false // флаг запуска таймера
}

const store = new Vuex.Store({
  state: {
    workTimer: config.workTimer,
    breakTimer: config.breakTimer,
    activeTimer: config.activeTimer,
    isPlay: config.isPlay,
    timerId: null,
    finishTime: null
  },

  mutations: {
    countdown (state) {
      // проигрываем мелодию старта таймера
      store.dispatch('startAudio')

      // активируем таймер
      store.commit('setPlayState', true)

      // устанавливаем время в миллисекундах окончания таймера
      store.commit('setFinishTime')

      function workSecCount() {

        state[state.activeTimer] = Math.ceil((state.finishTime - new Date().getTime()) / 1000)

        if (state[state.activeTimer] < 0) {
          console.log(new Date())
          // удаляем таймер
          store.dispatch('timerDestroy')

          // сбрасываем все значения
          store.commit('reset')

          // отключаем таймер
          store.commit('setPlayState', false)

          // переключаем активный таймер
          let newActiveTimer = store.state.activeTimer === 'breakTimer' ? 'workTimer' : 'breakTimer'
          store.commit('setActiveTimer', {
            timer: newActiveTimer
          })

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
      state.finishTime = new Date().getTime() + state[state.activeTimer] * 1000
    },

    // установка активного таймера
    setActiveTimer(state, payload) {

      // если таймер уже запущен, то останавливаем и меняем активный таймер
      if (state.isPlay) {
        store.commit('stopTimer')
        state.activeTimer = payload.timer
      } else {
        // просто меняем активный таймер
        state.activeTimer = payload.timer
      }
    },

    // остановка таймера по кнопке
    stopTimer() {
      // удаляем таймер
      store.dispatch('timerDestroy')

      // отключаем таймер
      store.commit('setPlayState', false)

      // сбрасываем все значения
      store.commit('reset')

      // проигрываем аудио остановки таймера
      store.dispatch('stopAudio')
    },

    // сброс значений таймеров
    reset(state) {
      state.workTimer = config.workTimer
      state.breakTimer = config.breakTimer
    }
  },

  actions: {
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
    },

    // включение/остановка таймера
    controlTimer() {
      if (store.state.isPlay) {
        store.commit('stopTimer')
      } else {
        store.commit('countdown')
      }
    },

    // смена таймера при клике на кнопки влево/вправо
    changeTimer(context, payload) {
      // если таймер активен, то останавливаем его и устанавливаем активный таймер
      if (context.state.isPlay) {
        context.commit('stopTimer')
        context.commit('setActiveTimer', payload)
      } else {
        // меняем активный таймер
        context.commit('setActiveTimer', payload)
      }
    },

    // удаляем таймер
    timerDestroy(context) {
      workerTimers.clearInterval(context.state.timerId)
      // context.state.timerId = null
    }
  }
})

// отслеживаем обнуление таймера
store.watch((state) => state[state.activeTimer], (oldValue, newValue) => {
  if (newValue <= 0) {
    // удаляем таймер
    // store.dispatch('timerDestroy')
    //
    // // сбрасываем все значения
    // store.commit('reset')
    //
    // // отключаем таймер
    // store.commit('setPlayState', false)
    //
    // // переключаем активный таймер
    // let newActiveTimer = store.state.activeTimer === 'breakTimer' ? 'workTimer' : 'breakTimer'
    // console.log(newActiveTimer)
    // store.commit('setActiveTimer', {
    //   timer: newActiveTimer
    // })
    //
    // // проигрываем мелодию при завершении таймера
    // store.dispatch('finishAudio')
  }
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
