<template>
  <div class="mine">
    <div class="isLogin" v-if="userInfo">
      <div class="imgDiv">
        <img src="../../../../assets/mine/mine-titleImg.svg" alt="" />
      </div>
      <div class="editDiv whiteBtn" @click="personalEdit = true">
        <span>个人设置</span>
        <Icon name="arrow" />
      </div>
      <div class="editDiv whiteBtn" @click="browsingHistory = true">
        <span>浏览记录</span>
        <Icon name="arrow" />
      </div>
      <div class="editDiv whiteBtn" @click="changePassword = true">
        <span>修改密码</span>
        <Icon name="arrow" />
      </div>
      <button class="redBtn" @click="signOut">退出登录</button>
    </div>
    <div class="operationLogin" v-else>
      <!-- <Popup v-model="enterpriseNameShow" > -->
      <login v-if="loginStatus == 1" @closeLogin="closeLogin" />
      <reg v-if="loginStatus == 2" @closeLogin="closeLogin" />
      <retrieve v-if="loginStatus == 3" @closeLogin="closeLogin" />
      <success
        v-if="loginStatus == 4 || loginStatus == 5"
        @closeLogin="closeLogin"
      />
      <notLoggedIn v-if="loginStatus == 0" />
      <!-- </Popup> -->
    </div>
    <Popup v-model="personalEdit" position="top" @open="handleOpen">
      <personalEdit ref="personalEdit" />
    </Popup>
    <!-- 历史 -->
    <Popup v-model="browsingHistory" position="top" @open="handeleOpenHistory">
      <browsingHistory ref="browsingHistory" />
    </Popup>
    <Popup v-model="changePassword" position="top">
      <changePwd />
    </Popup>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import login from "../login/login"
import reg from "../login/reg"
import retrieve from "../login/retrieve"
import success from '../login/success'
import notLoggedIn from '../login/notLoggedIn.vue'
import { Cascader, Popup, Field, Icon, Toast } from 'vant'
import personalEdit from "./personalEdit.vue"
import browsingHistory from "./browsingHistory.vue"
import changePwd from "./changePwd.vue"
export default {
  components: {
    login,
    reg,
    retrieve,
    success,
    notLoggedIn,
    Popup,
    Cascader,
    Field,
    Icon,
    personalEdit,
    browsingHistory,
    changePwd
  },
  computed: {
    ...mapState("user", ["userInfo", 'loginStatus'])
  },
  data() {
    return {
      enterpriseNameShow: true,
      personalEdit: false,
      browsingHistory: false,
      changePassword: false
    }
  },
  methods: {
    initialization() {      //初始
      let token = localStorage.getItem('token');
      if (token) {
        this.$api.user.getTestingCheck().then(resp => {
          if (resp) {
            this.$store.commit("user/setUserData", resp.data.result)
            this.$store.commit("user/setUserInfo", 1);
            this.$store.commit("user/setLoginStatus", 1);
          } else {
            this.$store.commit("user/setUserInfo", 0);
          }
        })
      } else {
        this.$store.commit("user/setUserInfo", 0);
        this.$store.commit("user/setLoginStatus", 0);
      }

    },
    closeLogin(val) {    //关闭
      this.$store.commit("user/setLoginStatus", val ? val : 1)
    },
    signOut() {      //退出登录
      localStorage.removeItem('token');
      this.$store.commit("user/setUserInfo", 0);
      this.$store.commit("user/setLoginStatus", 1);
      Toast.fail({
        message: "退出登录成功",
        className: "failToast",
        forbidClick: false,
        duration: 2000
      })
    },
    handleOpen() {   //个人设置打开
      this.$nextTick(() => {
        this.$refs.personalEdit.initialization()
      })
    },
    handeleOpenHistory() {   ///打开历史记录
      this.$nextTick(() => {
        this.$refs.browsingHistory.topage = 1;
        this.$refs.browsingHistory.enterpriseList.splice(0)
        this.$refs.browsingHistory.showHistories();
      })
    }
  },
  mounted() {
    this.initialization();//初始
    if (this.$route.params.val) {
      if (this.userInfo != 0 && this.loginStatus == 1) {
        this.browsingHistory = true;
      } else {
        this.browsingHistory = false;
      }
    }
    // if (this.$route.query.val) {
    //   if (this.userInfo != 0) {
    //     this.browsingHistory = true;
    //   }else{
    //     this.browsingHistory = false;
    //   }
    // }
  }
}
</script>

<style scoped>
.mine {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.imgDiv {
  /* border:1px solid red; */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 68px;
  margin-bottom: 76px;
  height: 100px;
}
.imgDiv img {
  height: 50px;
}
.isLogin .editDiv {
  width: 650px;
  height: 100px;
  /* background: #FFFFFF; */
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.02);
  border: 1px solid #f3f3f3;
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
.isLogin {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}
.isLogin .redBtn {
  display: block;
  width: 650px;
  height: 100px;
  font-size: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 200px;
  margin: auto;
}
.operationLogin {
  width: 100%;
  height: 100%;
}
</style>