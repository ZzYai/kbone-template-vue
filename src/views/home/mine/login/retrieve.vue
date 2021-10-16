<template>
  <div class="login">
    <!-- 找回密码 -->
    <div class="closeBtn">
      <button class="whiteBtn" @click="closeLogin">关闭</button>
    </div>
    <div class="title">
      <img src="../../../../assets/homeAddr/home-search-left.png" alt="" />
      <span>找回密码</span>
    </div>
    <p class="pOne">科技金普，助力企业成长</p>
    <form action="" class="formDiv" @submit.prevent="retrieve">
      <div
        class="formInput"
        :class="formDivFocus == 1 ? 'formInputBorder' : ''"
      >
        <span>手机号码</span>
        <input
          type="text"
          placeholder="请输入11位手机号"
          @focus="formDivFocus = 1"
          @blur="formDivFocus = 0"
          v-model="userData.phone"
        />
      </div>
      <div
        class="formInput"
        :class="formDivFocus == 2 ? 'formInputBorder' : ''"
      >
        <span>新的密码</span>
        <input
          type="password"
          placeholder="请输入密码(6-12位)"
          @focus="formDivFocus = 2"
          @blur="formDivFocus = 0"
          v-model="userData.password1"
        />
      </div>
      <div
        class="formInput"
        :class="formDivFocus == 3 ? 'formInputBorder' : ''"
      >
        <span>确认密码</span>
        <input
          type="password"
          placeholder="请输入密码(6-12位)"
          @focus="formDivFocus = 3"
          @blur="formDivFocus = 0"
          v-model="userData.password2"
        />
      </div>
      <div class="formCode">
        <div
          class="formCodeInput"
          :class="formDivFocus == 4 ? 'formInputBorder' : ''"
        >
          <span>验证码</span>
          <input
            type="text"
            placeholder="请输入验证码"
            @focus="formDivFocus = 4"
            @blur="formDivFocus = 0"
            v-model="userData.code"
          />
        </div>
        <div
          :class="time > 0 ? 'formCodeBtn' : 'formCodeBtnRed'"
          @click="sendCode"
        >
          {{ codeContent }}
        </div>
      </div>
      <div class="btns">
        <button class="redBtn">确认修改</button>
      </div>
    </form>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { mapState } from 'vuex'
export default {
  components: {
    Toast
  },
  data() {
    return {
      formDivFocus: 0,
      codeContent: '获取验证码',
      timer: null,
      time: 0,
      userData: {
        phone: '',
        password1: '',
        password2: '',
        code: ''
      }
    }
  },
  computed: {
    ...mapState("user", ["codeCD"])
  },
  methods: {
    // 登录
    retrieve() {    //确认修改
      if (!this.verificationPhone()) return;
      if (!this.verificationPass()) return;
      if (this.userData.password1 != this.userData.password2) {
        Toast.fail({
          duration: 2000, // 持续展示 toast
          forbidClick: false,
          message: "两次密码不一致",
          className: "failToast"
        });
        return
      }
      if (this.userData.code.trim() == "") {
        Toast.fail({
          duration: 2000, // 持续展示 toast
          forbidClick: false,
          message: "请输入验证码",
          className: "failToast"
        });
        return
      }
      let data = {
        account: this.userData.phone,
        password: this.userData.password1,
        code: this.userData.code
      }
      this.$api.user.getpasswordReset(data).then(resp => {
        // console.log(resp);
        if (resp) {
          Toast.success({
            duration: 2000, // 持续展示 toast
            forbidClick: false,
            message: resp.message,
            className: "successToast"
          });
          setTimeout(() => {
            this.$store.commit('user/setLoginStatus', 5)
          }, 1500)
        }
      })
    },
    // 发送验证码
    sendCode() {
      if (this.time <= 0) {
        if (!this.verificationPhone()) return;
        // console.log("发送验证码");
        Toast.allowMultiple();
        let toast1 = Toast.loading({
          message: '加载中...',
          forbidClick: false,
        });
        this.$api.user.getVerificationCode({
          phone: this.userData.phone,
          type: 2      //2找回密码
        }).then(resp => {
          toast1.clear();
          if (resp) {
            Toast.success({
              message: resp.message,
              forbidClick: false,
              duration: 2000,
              className: "successToast"
            });
            this.timerFun();
          }
        })
      }
    },
    timerFun() {
      this.time = this.codeCD
      this.timer = setInterval(() => {
        this.time -= 1
        this.codeContent = this.time + '(' + 's' + ')'
        if (this.time <= 0) {
          clearInterval(this.timer)
          this.timer = null
          this.codeContent = '获取验证码';
        }
      }, 1000)
    },
    closeLogin() {
      this.$emit('closeLogin', 1)
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
      if (reg_pass.test(this.userData.password1)) {
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
<style lang="less">
@toast-max-width: 10%!important;
// @toast-font-size: 40px;
</style>
<style src="./login.css">
</style>