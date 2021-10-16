export default{
    namespaced:true,
    state:{
        userInfo:0,         //显示是否登录成功
        loginStatus:0,
        codeCD : 60,        //默认60秒，验证码的冷却时间
        userData : {
            "account": "",
            "name": "",
            "avatar": null,
            "id": null,
        }
    },
    mutations:{
        setUserInfo(state,payload){
            state.userInfo = payload;
        },
        setLoginStatus(state,payload){
            state.loginStatus = payload;
        },
        setCodeCD(state,num){
            // state.codeCD = 60*num;
            state.codeCD = num
        },
        setUserData(state,data){
            state.userData = Object.assign(state.userData,data);
        },
    },
    getters : {
        getUserData:(state)=>{
            return state.userData
        },
        getLoginStatus:(state)=>{
            return state.loginStatus
        },
        getUserInfo:(state)=>{
            return state.userInfo
        }
    }
}