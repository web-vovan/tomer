import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    workTime: 4,
    breakTime: 5
  },
  mutations: {
    countdownWorkTime (state) {
      setTimeout(function run() {
        state.workTime -= 1

        if (state.workTime === 0) {
          store.dispatch('finish')
        } else {
          setTimeout(run, 1000)
        }
      }, 1000);
    },
    countdownBreakTime (state) {
      setInterval(() => state.breakTime -= 1, 1000)
    }
  },
  actions: {
    finish() {
      alert('hello');
    }
  }
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
