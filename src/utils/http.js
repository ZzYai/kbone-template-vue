import axios from "axios"
import qs from 'qs'
import { Toast } from 'vant';
import Vue from 'vue';
import store from '../store/index.js'
Vue.use(Toast);
Toast.allowMultiple();
const instance = new axios.create({
    // 序列化
    paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
    }
})

instance.interceptors.request.use((config) => {
    // if(config.url!='/api/enterprise/login/login'){
    //     let token = localStorage.getItem("token")
    //     token && (config.headers.Authorization = 'Bearer ' + token)
    // }
    // let reg= new RegExp(/null/)
    // if(reg.test(config.headers.Authorization)){
    //     console.log("null !!!!!!!!!")
    //     return false
    // }
    // console.log(config)
    return config
}, error => {
    Promise.reject(error)
})

instance.interceptors.response.use((response) => {
    if (response.data.code == 200) {
        return response.data
    } else {
        if ((response.data.message).slice(0, 4) == "发送频繁") {
            // let num = response.data.message.slice(6, 7);
            store.commit('user/setCodeCD', response.data.data.ttl);
            return response.data
        }
        Toast.fail({
            message: response.data.message,
            forbidClick: false,
            duration: 2000,
            className: "failToast"
        });
        return false
    }
}, error => {
    let { response } = error
    if (response) {
        // console.log(response);
        // if(response.statusText =="Internal Server Error"){
        //     return false
        // }
        Toast.fail({
            duration: 3000, // 持续展示 toast
            forbidClick: false,
            message: response.data.message ? response.data.message : "未登录",
            className: "failToast"
        });
        if (response.data.message && (response.data.message).slice(0, 4) == "发送频繁") {
            // let num = response.data.message.slice(6, 7);
            store.commit('user/setCodeCD', response.data.data.ttl);
            return response.data
        }
        return false
    } else if (!window.navigator.onLine) {
        Toast.fail('网络错误');
    } else {
        Toast.fail('服务故障');
    }
})


export default instance