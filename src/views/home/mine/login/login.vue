<template>
  <div class="login">
    <div class="title">
      <img src="../../../../assets/homeAddr/home-search-left.png" />
      <span>登录金普新区数字化创新地图</span>
    </div>
    <p class="pOne">登录后可以查看更多企业并能够与企业建立在线联络</p>
    <form action="" class="formDiv" @submit.prevent="login">
      <div
        class="formInput"
        :class="formDivFocus == 1 ? 'formInputBorder' : ''"
      >
        <span>手机号码</span>
        <input
          type="text"
          v-model="userData.phone"
          placeholder="请输入11位手机号"
          @focus="formDivFocus = 1"
          @blur="formDivFocus = 0"
        />
      </div>
      <div
        class="formInput"
        :class="formDivFocus == 2 ? 'formInputBorder' : ''"
      >
        <span>登录密码</span>
        <input
          type="password"
          v-model="userData.password"
          placeholder="请输入密码(6-12位)"
          @focus="formDivFocus = 2"
          @blur="formDivFocus = 0"
        />
      </div>
      <div class="formSkip">
        <span class="fcBlue fcur" @click="reg">注册账户</span>
        <span class="fcur" @click="retrieve">忘记密码</span>
      </div>
      <div class="btns">
        <button class="redBtn">登录平台</button>
      </div>
    </form>
  </div>
</template>

<script>
import { Notify, Toast } from 'vant'
export default {
  components: {
    Notify,
    Toast
  },
  data() {
    return {
      formDivFocus: 0,
      userData: {
        phone: '',
        password: ''
      }
    }
  },
  methods: {
    closeLogin() {
      this.$emit("closeLogin");
    },
    // 登录
    login() {
      //   console.log("开始登录");
      if (!this.verificationPhone()) return;
      if(this.userData.password.trim() == ''){
        Toast.fail({
          duration: 2000, // 持续展示 toast
          forbidClick: false,
          message: "请输入密码",
          className: "failToast"
        });
        return
      }
      if (!this.verificationPass()) return;
      Toast.allowMultiple();
      let toastLogin = Toast.loading({
        duration : 0,
        message: '登录中...',
        forbidClick: true,
      });
      this.$api.user.getLogin(this.userData).then(resp => {
        toastLogin.clear();
        if (resp) {
          localStorage.removeItem('token');
          Toast.success(resp.message);
          let token = resp.data.token;
          localStorage.setItem('token', token);
          let data = resp.data.data;
          this.$store.commit('user/setUserData', data);
          // localStorage.setItem("password",window.btoa((this.userData.password).trim()))
          setTimeout(() => {
            this.$store.commit("user/setUserInfo", 1);
            this.$router.push({
              path: '/home/homeAddr'
            });
          }, 1000);

        }
      })
    },
    // 注册
    reg() {
      this.$store.commit("user/setLoginStatus", 2)
    },
    // 找回密码
    retrieve() {
      this.$store.commit("user/setLoginStatus", 3)
    },
    verificationPhone() {
      var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (reg_tel.test(this.userData.phone)) {
        return true
      } else {
        Toast.fail({
          duration: 2000, // 持续展示 toast
          forbidClick: false,
          message: "请输入正确的手机号",
          className: "failToast"
        });
        return false
      }
    },
    verificationPass() {
      let reg_pass = /^(\w){6,20}$/;
      if (reg_pass.test(this.userData.password)) {
        return true
      } else {
        Toast.fail({
          duration: 2000, // 持续展示 toast
          forbidClick: false,
          message: "密码格式错误",
          className: "failToast"
        });
        return false
      }

    },

  }
}
</script>

<style src="./login.css">
</style>