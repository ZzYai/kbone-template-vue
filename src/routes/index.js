import Vue from "vue"
import VueRouter from "vue-router"
import config from "./config"
import store from "../store"



const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

let router = new VueRouter(config)
router.beforeEach(function (to, from, next) {
    if (to.path == "/home/homeAddr") {
        store.commit("pageActive/setPageActive", 1)
    }
    if (to.path == "/home/sayMessage") {
        store.commit("pageActive/setPageActive", 2)
    }
    if (to.path == "/home/bussinessList") {
        store.commit("pageActive/setPageActive", 3)
    }
    if (to.path == "/home/mine") {
        store.commit("pageActive/setPageActive", 4)
    }
    if (to.path == "/home/industryChain") {
        store.commit("pageActive/setPageActive", 5)
    }
    if (to.path == "/enterprise/enterprisePanorama") {
        store.commit("pageActive/setPageActive", 6)
    }
    if (to.path == "/enterprise/enterpriseServe") {
        store.commit("pageActive/setPageActive", 7)
    }
    if (to.path == "/enterprise/enterpriseImg") {
        store.commit("pageActive/setPageActive", 8)
    }
    if (to.path == "/enterprise/enterprisePPT") {
        store.commit("pageActive/setPageActive", 9)
    }
    if (to.path == "/enterprise/enterpriseWe") {
        store.commit("pageActive/setPageActive", 10)
    }
    store.commit('enterprise/setPositionBtn', {
        positionMap: to.name + 'A',
        positionBack: to.name + 'B'
    })


    next()
})
export default router