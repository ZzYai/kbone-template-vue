<template>
  <div class="personalEdit">
    <div class="divOne">
      <span>姓名</span>
      <input
        type="text"
        v-model="requestInfo.user_nickname"
        placeholder="昵称"
      />
    </div>
    <div class="divTwo">
      <span>头像</span>
      <div class="imgDiv">
        <img :src="requestInfo.avatar" @error="imgerr" />
      </div>
      <span class="fcRed" @click="upload">上传</span>
      <input
        ref="input"
        hidden
        type="file"
        accept="image/png, image/jpeg, image/gif, image/jpg"
        @change="uploadImg($event)"
      />
    </div>
    <button class="redBtn" @click="modify">保存信息</button>
  </div>
</template>

<script>
import { Toast } from 'vant'
import upload from "../../../../utils/upload"
export default {
  components: {
    Toast
  },
  data() {
    return {
      requestInfo: {
        avatar: '',        //头像
        user_nickname: '',
      }
      //用户名昵称
    }
  },
  methods: {
    modify() {   //修改信息
      Toast.allowMultiple();
      let load = Toast.loading({
        message: '加载中',
        forbidClick: false,
        duration: 0
      })
      this.$api.user.getModifyInfo(this.requestInfo).then((resp) => {
        load.clear()
        // console.log(resp);
        if (resp) {
          Toast.success({
            message: resp.message,
            duration: 2000,
            forbidClick: false,
          });
        }
      })
    },
    initialization() {      //初始化
      this.$api.user.getTestingCheck().then(resp => {
        if (resp) {
          let data = resp.data.result;
          this.requestInfo.user_nickname = data.name;
          this.requestInfo.avatar = data.avatar;
          this.$store.commit("user/setUserData", data);
          if (!this.requestInfo.avatar) {
            this.requestInfo.avatar = require('../../../../assets/default.png');
          }
        } else {
          this.$store.commit("user/setUserInfo", 0);
          this.$store.commit("user/setLoginStatus", 1);
        }
      });
    },
    upload() {
      this.$refs.input.value = null;
      this.$refs.input.dispatchEvent(new MouseEvent('click'));
    },
    uploadImg(e) {
      let f = this.$refs.input.files[0];
      // console.log(f)
      upload(f, name => {
        if (name) {
          this.requestInfo.avatar = "http://" + name
        }
      })
    },
    imgerr(e) {       //图片出错
      e.target.setAttribute('src', require('../../../../assets/default.png'));
    }
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
}
.personalEdit .redBtn {
  margin: 140px auto 20px;
}
.personalEdit .divOne,
.personalEdit .divTwo {
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
.personalEdit .divOne >span{
  font-size: 30px;
  white-space: nowrap;
}
.personalEdit .divTwo {
  height: 200px;
}
.personalEdit div span {
  width: 60px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #6d7587;
}
.personalEdit div input {
  margin-left: 20px;
  width: 400px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  /* color: rgba(0, 0, 0, 0.2);
   */
  color: #242424;
}
.personalEdit .divTwo span{
  white-space: nowrap;
  font-size: 30px;
}
.personalEdit .divTwo .imgDiv {
  width: 150px;
  height: 150px;
  /* background: #eeeeee; */
  background: transparent;
  margin-left: 50px;
}
.personalEdit .divTwo .imgDiv img {
  width: 100%;
  height: 100%;
}
.personalEdit .divTwo .fcRed {
  margin-left: auto;
  color: #e92e3c;
  text-decoration: underline;
}
</style>