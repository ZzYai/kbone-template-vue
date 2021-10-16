export default {
    namespaced: true,
    state: {
        enterpriseId: null,
        enterpriseData: null,
        positionBtn: {              //返回按钮  样式
            positionMap: '',
            positionBack: ''
        },
        positionMapPoint :{
            lat : '',
            lng : '',
            logo : '',
            point : ''
        }


    },
    mutations: {
        setEnterpriseId(state, payload) {
            state.enterpriseId = payload
            // state.enterpriseData = payload
        },
        setPositionBtn(state, obj) {
            Object.assign(state.positionBtn,obj)
        },
        setPositionMapPoint(state,valobj){
            // Object.assign(state.positionMapPoint,valobj)
            state.positionMapPoint.lat = valobj.lat||valobj.latitude
            state.positionMapPoint.lng = valobj.lng||valobj.longitude
            state.positionMapPoint.logo = valobj.logo
            state.positionMapPoint.point = valobj.point
            // console.log(state.positionMapPoint)
        }

    },
    getters:{
        getPositionBtn(state){
            return state.positionBtn
        },
        getPositionMapPoint(state){
            return state.positionMapPoint
        }
    }
}