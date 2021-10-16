<template>
  <div class="personalEdit">
    <div class="divOne">
      <span>旧密码</span>
      <input type="text" v-model="oldPassword" placeholder="请输入密码" />
    </div>
    <div class="divOne">
      <span>新密码</span>
      <input type="text" v-model="newPassword" placeholder="请设置密码" />
    </div>
    <div class="divOne">
      <span>新密码</span>
      <input type="text" v-model="newPassword1" placeholder="请确认密码" />
    </div>
    <button class="redBtn" @click="confirmModify">保存信息</button>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  components: {
    Toast
  },
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      newPassword1: ""
    }
  },
  methods: {
    confirmModify() {    //确认修改
      if (!this.newPassword.trim()) {
        Toast.fail({
          message: "不可为空",
          duration: 2000,
          forbidClick: false,
          className: "failToast"
        })
        return
      }
      if (this.newPassword1 != this.newPassword) {
        Toast.fail({
          message: "两次密码不一致",
          duration: 2000,
          forbidClick: false,
          className: "failToast"
        })
        return
      }
      if(!this.verificationPass()) return;
      let data = {
        old: this.oldPassword,
        new: this.newPassword
      }
      this.$api.user.getPassWordEnterprise(data).then(resp => {
        // console.log(resp);
        if (resp) {
          Toast.success({
            message: resp.message,
            duration: 2000,
            forbidClick: false,
            className: "messageToast"
          })
        }
      })

    },

    verificationPass() {
      let reg_pass = /^(\w){6,20}$/;
      if (reg_pass.test(this.newPassword)) {
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
  },
  mounted() {

  }


}
</script>

<style scoped>
.personalEdit .redBtn {
  display: block;
  width: 650px;
  height: 100px;
  font-size: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  margin: 140px auto 20px;
}
.personalEdit .divOne {
  width: 650px;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.02);
  border: 1px solid #f3f3f3;
  display: flex;
  align-items: center;
  margin: 40px auto;
  padding: 0 40px;
  font-size: 30px;
  box-sizing: border-box;
}
.personalEdit .divOne {
  height: 100px;
}

.personalEdit div span {
  white-space: nowrap;
  width: 150px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #6d7587;
  /* border:1px solid red; */
  text-align: right;
}
.personalEdit div input {
  margin-left: 20px;
  width: 400px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgb(0, 0, 0);
}
</style>