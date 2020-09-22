// 引入vue
import Vue from 'vue'
// 全局引入vueX
import Vuex from 'vuex'
import BIOS from './modules/BIOS'

import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    BIOS,
  },
  plugins: debug ? [createLogger()] : []
})
export default store