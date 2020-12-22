import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.config.productionTip = false

// конфиг
const config = {
  workTimer: 25 * 60, // рабочий таймер в секундах
  breakTimer: 4, // таймер отдыха в секундах
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
      store.commit('setPlayState', true)

      setTimeout(function run() {
        // проверяем активен ли таймер
        // используется при остановке таймера кнопкой СТОП
        if (state.isPlay === false) {
          return false;
        }

        // уменьшаем значение таймера
        state[state.activeTimer] -= 1

        setTimeout(run, 1000)
      }, 1000)
    },

    // установка состояния таймера
    setPlayState(state, payload) {
      state.isPlay = payload
    },

    // установка активного таймера
    setActiveTimer(state, payload) {

      // если таймер уже запущен, то останавливаем и меняем активный таймер
      if (state.isPlay) {
        store.commit('stopTimer')
        state.activeTimer = payload.timer
      } else {
        // просто меняем активный таймер
        store.dispatch('checkAudio')
        state.activeTimer = payload.timer
      }
    },

    // остановка таймера по кнопке
    stopTimer() {
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
    // мелодия при принудительной остановке таймера
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
    changeTimer(state, payload) {
      // если таймер активен, то останавливаем его и устанавливаем активный таймер
      if (store.state.isPlay) {
        store.commit('stopTimer')
        store.commit('setActiveTimer', payload)
      } else {
        // меняем активный таймер
        store.commit('setActiveTimer', payload)
      }
    }
  }
})

// отслеживаем обнуление таймера
store.watch((state) => state[state.activeTimer], (oldValue, newValue) => {
  if (newValue === 0) {
    // отключаем таймер
    store.commit('setPlayState', false)

    // сбрасываем все значения
    store.commit('reset')

    // переключаем активный таймер
    let newActiveTimer = store.state.activeTimer === 'breakTimer' ? 'workTimer' : 'breakTimer'
    store.commit('setActiveTimer', {
      timer: newActiveTimer
    })

    // проигрываем мелодию при завершении таймера
    store.dispatch('finishAudio')
  }
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
