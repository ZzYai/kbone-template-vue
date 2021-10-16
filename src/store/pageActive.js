export default{
    namespaced:true,
    state:{
        pageActive:1
    },
    mutations:{
        setPageActive(state,payload){
            state.pageActive = payload
        }
    }
}
