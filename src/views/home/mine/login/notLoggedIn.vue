<template>
  <div class="notLoggedIn">
    <!-- 未登录状态 -->
    <div class="imgDiv">
      <img src="../../../../assets/mine/mine-titleImg.svg"/>
    </div>
    <div class="editDiv whiteBtn" @click="browsingHistory = true">
      <span>浏览记录</span>
      <Icon name="arrow" />
    </div>
    <button class="loginping" @click="gotoLogin">平台登录</button>
    <Popup v-model="browsingHistory" position="top" @open="handeleOpenHistory">
      <notLoggedInHistory ref="notLoggedInHistory" />
    </Popup>
  </div>
</template>

<script>
import { Icon,Popup } from 'vant'
import notLoggedInHistory from '../mine/notLoggedInHistory.vue'
export default {
  data() {
    return {
      browsingHistory: false
    }
  },
  components: {
    Icon,
    Popup,
    notLoggedInHistory
  },
  methods: {
    gotoLogin() {  //前往登录
      this.$store.commit('user/setLoginStatus', 1)
    },
    handeleOpenHistory(){       //弹窗打开
    this.$nextTick(()=>{
      this.$refs.notLoggedInHistory.showHistories()
    })
    }
  },
  mounted(){
    if(this.$route.params.val){
      this.browsingHistory = true;
    }
  }
}
</script>

<style scoped  >
.notLoggedIn {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
}
.imgDiv {
  /* display: flex;
  align-items: center;
  justify-content: center; */
  height: 100px;
  vertical-align: middle;
  line-height: 100px;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 30px;
  margin: 0 auto;
  margin-top: 68px;
  margin-bottom: 76px;
}
.imgDiv img {
  width: 100%;
  vertical-align: middle;
}
.editDiv {
  width: 650px;
  height: 100px;
  /* background: #FFFFFF; */
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.02);
  border: 1px solid #ececec;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 40px auto;
  padding: 0 40px;
  box-sizing: border-box;
}
.editDiv span {
  font-size: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
}
.loginping {
  /* width: 650px; */
  width: 89%;
  border: none;
  height: 100px;
  line-height: 100px;
  margin: 0 auto;
  background: #e70011;
  font-size: 30px;
  color: #fff;
  display: block;
  outline: none;
  font-size: 26px;
  position: absolute;
  bottom: 200px;
  margin: 0 auto;
  left: 0;
  right: 0;

}
</style>