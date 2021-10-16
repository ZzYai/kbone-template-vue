<template>
    <div class="login">
        <div class="closeBtn">
            <button class="whiteBtn" @click="closeLogin">关闭</button>
        </div>
        <!-- <img src="../../assets/login/login-success.png" alt=""> -->
        <form action="" class="formDiv" @submit.prevent="login" >
            
            <div class="title"><span>{{loginStatus==4?'注册成功':'找回成功'}}</span></div>
            <p class="pOne">科技金普，助力企业成长</p>
            <div class="btns">
                <button class="redBtn">前往登录</button>
            </div>
            
        </form>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data(){
        return{
         
        }
    },
    computed:{
        ...mapState("user",['loginStatus'])
    },
    methods:{
        closeLogin(){
            this.$emit("closeLogin",this.loginStatus==4?2:3);
        },
        // 登录
        login(){
            this.$store.commit("user/setLoginStatus",1);
        },
    }
}
</script>

<style src="./login.css">

</style>