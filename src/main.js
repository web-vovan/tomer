import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.config.productionTip = false

// конфиг
const config = {
  workTimer: 24 * 60, // рабочий таймер в секундах
  breakTimer: 5 * 60, // таймер отдыха в секундах
  activeTimer: 'workTimer', // активный таймер по умолчанию
  isPlay: false // флаг запуска таймера
}

const store = new Vuex.Store({
  state: {
    workTimer: config.workTimer,
    breakTimer: config.breakTimer,
    activeTimer: config.activeTimer,
    isPlay: config.isPlay,
  },

  mutations: {
    countdown (state) {
      // проигрываем мелодию старта таймера
      store.dispatch('startAudio')

      // активируем таймер
      state.isPlay = true

      setTimeout(function run() {
        // проверяем активен ли таймер
        // используется при остановке таймера кнопкой СТОП
        if (state.isPlay === false) {
          return false;
        }

        // уменьшаем значение таймера
        state[state.activeTimer] -= 1

        // таймер подошел к концу
        if (state[state.activeTimer] === 0) {
          // отключаем таймер
          state.isPlay = false

          // сбрасываем все значения
          store.commit('reset')

          // переключаем активный таймер
          store.commit('setActiveTimer', {
            timer: state.activeTimer === 'breakTimer' ? 'workTimer' : 'breakTimer'
          })

          // проигрываем мелодию при завершении таймера
          store.dispatch('finishAudio')
        } else {
          setTimeout(run, 1000)
        }
      }, 1000)
    },

    // установка активного таймера
    setActiveTimer(state, payload) {
      state.activeTimer = payload.timer
    },

    // остановка таймера по кнопке
    stopTimer() {
      // сбрасываем все значения
      store.commit('reset')

      // проигрываем аудио остановки таймера
      store.dispatch('stopAudio')
    },

    // сброс значений таймеров
    reset(state) {
      state.isPlay = false
      state.workTimer = config.workTimer
      state.breakTimer = config.breakTimer
    }
  },

  actions: {
    // мелодия при завершении таймера
    finishAudio() {
      let audio = new Audio('/assets/sounds/finishTimer.mp3')
      audio.play()
    },

    // мелодия при старте таймере
    startAudio() {
      let audio = new Audio('/assets/sounds/startTimer.mp3')
      audio.play()
    },

    // мелодия при принудительной остановке таймера
    stopAudio() {
      let audio = new Audio('/assets/sounds/stopTimer.mp3')
      audio.play()
    },

    // мелодия при смене таймера
    checkAudio() {
      let audio = new Audio('/assets/sounds/check.mp3')
      audio.play()
    }
  }
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
