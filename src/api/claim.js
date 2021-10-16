import http from "../utils/http"
import qs from 'qs'
let url = 'https://jinpu.mishihudong.com'
    //营业执照识别
function getBizLicense(data){
    return http.post(url + '/enterprise/v1/bizLicense',qs.stringify(data))
}
//获取验证码
function getCode(phone){
    return http.get(url + '/enterprise/login/sms',{params : phone})
}
//认领企业 
function getClaim(data){
    return http.post(url + '/pc/v1/claim',qs.stringify(data))
}
export default {
    getBizLicense,
    getCode,
    getClaim
}