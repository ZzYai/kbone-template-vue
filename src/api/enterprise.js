import http from "../utils/http"
import qs from 'qs'
let url = 'https://jinpu.mishihudong.com'
//全部企业信息
function getEnterpriese(data) {
    return http.get(url + '/pc/v1/enterprises', { params: data })

}
// 官网信息
function getEnterpriseInfo(infoMap) {
    // return http.get(url + '/pc/v1/enterprise', { params: infoMap })
    //修改
    return http.get(url + '/pc/v1/website', { params: infoMap })
}
//官网信息，添加浏览记录
function getgetEnterpriseWebsite(data) {
    let token = localStorage.getItem('token');
    return http.get(url + '/pc/v1/website', {
        params: data,
        headers: {
            Authorization: "Bearer " + token
        }
    })
}
// 商机中心
function getopportunities(infoMap) {
    return http.get(url + '/pc/v1/opportunities', { params: infoMap })
}
//商机详情
function getopportunity(data) {
    return http.get(url + '/pc/v1/opportunity', { params: data })
}
// 标签
function getTags(tagevalue) {
    return http.get(url + '/pc/v1/tags', { params: tagevalue })
}
//获取产业链
function getChains(page) {
    return http.get(url + '/pc/v1/chains', { params: page })
}
//获取产业链分类
function getIndustryChains(data) {
    return http.get(url + '/pc/v1/industry_chains', { params: data })
}
//获取产业链中企业分类
function getClassifyEnterprise(data) {
    return http.get(url + '/pc/v1/industry_enterprises', { params: data })
}

//发布内容分类
function getClassify(tagval) {
    let token = localStorage.getItem('token');
    if (token) {
        token = localStorage.getItem('token');
        if (token) {
            return http.get(url + '/pc/v1/classify', {
                params: tagval,
                 headers: {
                    Authorization: "Bearer " + token
                }
            })
        } else {
            return http.get(url + '/pc/v1/classify', { params: tagval })
        }
    } else {
        return http.get(url + '/pc/v1/classify', { params: tagval })
    }

}

function getInfoTag(valid) {
    return http.get(url + '/pc/v1/info', { params: valid })
}
export default {
    getEnterpriese,
    getEnterpriseInfo,  //地图信息
    getopportunities,   //商机中心
    getopportunity,
    getTags,            //标签
    getChains,
    getIndustryChains,
    getClassifyEnterprise,
    getClassify,
    getInfoTag,
    getgetEnterpriseWebsite //官网信息添加浏览记录
}