import http from "../utils/http"
import qs from 'qs'
import { Toast } from 'vant'
Toast.allowMultiple();
let url = 'https://jinpu.mishihudong.com'
// 地图信息
function getMapInfo(infoMap) {
    return http.get(url + '/pc/v1/points', { params: infoMap })
}
// 登录
function getLogin(data) {
    return http.post(url + '/enterprise/login/login', qs.stringify(data))
}
//获取验证码
function getVerificationCode(phone) {

    return http.get(url + '/enterprise/login/sms', { params: phone })
}
//注册
function getRegister(data) {
    return http.post(url + '/enterprise/login/user', qs.stringify(data))
}
//历史记录
function getHistories(page) {
    let token = localStorage.getItem('token');
    return http.get(url + '/pc/v1/histories', {
        params: page,
        headers: {
            "Authorization": "Bearer " + token
        }
    })
}
//删除历史记录
function getDeleteHistories(id){
    let token = localStorage.getItem('token');
    return http.delete(url + '/pc/v1/history',{
        params : id,
        headers: {
            "Authorization": "Bearer " + token
        }
    })
}




//修改信息
function getModifyInfo(data){
    let token = localStorage.getItem('token');
    return http.put(url+'/pc/v1/info',qs.stringify(data),{
        headers : {
            "Authorization" : "Bearer " + token
        }
    })
}
//修改密码  忘记密码
function getpasswordReset(data){
    return http.put(url+'/enterprise/login/password_reset',qs.stringify(data))
}
//修改原有密码
function getPassWordEnterprise(data){
    let token = localStorage.getItem('token');
    return http.put(url+'/enterprise/v1/user',qs.stringify(data),{
        headers : {
            "Authorization" : "Bearer " + token
        }
    })
}

//pc/v1/check  检查登录状态
function getTestingCheck(){
    let token = localStorage.getItem('token');
    return http.get(url+'/pc/v1/check',{
        headers : {
            "Authorization" : "Bearer " + token
        }
    })
}

export default {
    getMapInfo,
    getLogin,
    getVerificationCode,
    getRegister,
    getHistories,
    getDeleteHistories,
    getModifyInfo,
    getpasswordReset,
    getPassWordEnterprise,
    getTestingCheck
}