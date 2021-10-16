<template>
    <div class="homeTabbar">
        <div class="skipBtn" @click="changePage(1)">
            <img src="../assets/homeTabbar/homeTabbar-addr-red.svg"  v-if="pageActive==1">
            <img src="../assets/homeTabbar/homeTabbar-addr-black.svg"  v-else>            
            <p :class="{'redP':pageActive==1}">企业地图</p>
        </div>
        <div class="skipBtn" @click="changePage(2)">
            <img src="../assets/homeTabbar/homeTabbar-message-red.svg"  v-if="pageActive==2">
            <img src="../assets/homeTabbar/homeTabbar-message-black.svg" v-else>            
            <p :class="{'redP':pageActive==2}">沟通</p>
        </div>
        <div class="midBtn" @click="changePage(5)">
            <img src="../assets/homeTabbar/homeTabbar-midBtn.svg" alt="">
        </div>
        <div class="skipBtn" @click="changePage(3)" :style="{marginLeft:110/16+'rem'}">
            <img src="../assets/homeTabbar/homeTabbar-bussiness-red.svg" alt="" v-if="pageActive==3">
            <img src="../assets/homeTabbar/homeTabbar-bussiness-black.svg" v-else>            
            <p :class="{'redP':pageActive==3}">商机</p>
        </div>
        <div class="skipBtn" @click="changePage(4)">
            <img src="../assets/homeTabbar/homeTabbar-mine-red.svg" alt="" v-if="pageActive==4">
            <img src="../assets/homeTabbar/homeTabbar-mine-black.svg" v-else>            
            <p :class="{'redP':pageActive==4}">我的</p>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex"
export default {
    computed:{
        ...mapState("pageActive",['pageActive'])
    },
    // props:{
    //     btnList:{
    //         type:Array,
    //         default:()=>[]
    //     }
    // },
    // 监听,当路由发生变化的时候执行

    data(){
        return{
            btnActive:1
        }
    },
    methods:{
        changePage(val){
            this.$store.commit("pageActive/setPageActive",val)
            this.$emit("changePage",val)
            if(val == 4){
                this.$store.commit("user/setLoginStatus", 0);
            }
        }
    }
}
</script>

<style  scoped>
.homeTabbar{
    height: 110px;
    width: 100%;
    background:#ffffff;    
    position: fixed;
    bottom:0;
    left:0;
    display: flex;
    align-items: center;
    z-index: 2;
    border-top: 1px solid #EFEFEF;
    justify-content: space-between;
    box-sizing: border-box;
    /* display: none; */
}
.skipBtn{
    width:160px;
    height: 110px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #ffffff;
}
.skipBtn img{
    width:35px;
    height: 35px;
}
.skipBtn p{
    font-size: 22px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #6D7587;
    margin-top: 5px;
}
.skipBtn .redP{
    color:#E40212;
}
.midBtn{
    width:130px;
    /* border:1px solid red; */
    background: #ffffff;
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #EFEFEF;
    border-radius: 50% 50% 0 0;
    position: absolute;
    bottom:0;
    left:50%;
    transform: translate(-50%,0);
}
.midBtn img{
    width:120px;
    height: 120px;
}
</style>