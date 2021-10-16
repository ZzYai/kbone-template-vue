import http from "../utils/http"
import qs from 'qs'
// import { Toast } from 'vant'
let url = 'https://jinpu.mishihudong.com';
//聊天列表

function getChatInfo() {
    let token = localStorage.getItem('token')
    return http.get(url + '/chat/v1/list', {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
}
//聊天详情
function getChatDetails(data) {
    let token = localStorage.getItem('token')
    return http.get(url + '/chat/v1/chat', {
        params: data,
        headers: {
            "Authorization": "Bearer " + token
        }
    })
}



export default {
    getChatInfo,
    getChatDetails
}