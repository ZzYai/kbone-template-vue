import Vue from "vue"
import Vuex from "vuex"
import pageActive from "./pageActive"
import user from "./user"
import enterprise from "./enterprise"
Vue.use(Vuex)

let store = new Vuex.Store({
    modules:{
        pageActive,
        user,
        enterprise
    }
})

export default store