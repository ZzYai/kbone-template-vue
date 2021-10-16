<template>
  <div class="isClaim">
    <div class="titlebox">
      <div class="toplogo">
        <img :src="require('../../../assets/LOGO.png')" />
        <h2>认领企业</h2>
      </div>
      <p class="showP">科技金普，助力企业成长</p>
    </div>

    <div class="box">
      <div class="entTitle publicInp">
        <div class="left">
          <span>企业名称</span>
        </div>
        <div class="right">
          <span>{{ isClaimShowData ? isClaimShowData.enterprise : "无" }}</span>
        </div>
      </div>
      <div class="inpPhone publicInp">
        <div class="left">
          <span>手机号码</span>
        </div>
        <div class="right">
          <input
            type="phone"
            name="phone"
            v-model="infoData.phone"
            placeholder="手机号"
          />
        </div>
      </div>
      <div class="inppass publicInp">
        <div class="left">
          <span>登录密码</span>
        </div>
        <div class="right">
          <input
            type="password"
            name="password"
            v-model="infoData.password"
            placeholder="密码"
          />
        </div>
      </div>
      <div class="inpispass publicInp">
        <div class="left">
          <span>确认密码</span>
        </div>
        <div class="right">
          <input
            type="password"
            name="ispassword"
            v-model="infoData.ispassword"
            placeholder="确认密码"
          />
        </div>
      </div>
      <div class="code">
        <div class="codebox publicInp">
          <div class="left">
            <span>验证码</span>
          </div>
          <div class="right">
            <input
              type="text"
              name="code"
              v-model="infoData.code"
              placeholder="请输入验证码"
            />
          </div>
        </div>
        <div
          class="daojishi"
          :class="{ sender: codeInfo != '获取' }"
          @click="obtain"
        >
          {{ codeInfo }}
        </div>
      </div>
      <div class="upload">
        <div class="left">
          <span>上传执照</span>
        </div>
        <div class="right">
          <input type="text" disabled placeholder="仅支持JPG,png格式图片" />
          <input
            type="file"
            name="license"
            style="display: none"
            id="license"
            ref="license"
            accept="image/png, image/jpeg ,image/jpg"
            @change="verificationPicFile"
          />
          <!-- <span @click="uploadLicense">选择图片</span> -->
        </div>
        <div class="handleUploadDiv" @click="uploadLicense">选择图片</div>
      </div>
      <p class="tishi">*以下信息自动识别 无需填写</p>
      <div class="publicInput">
        <div class="left"><span>企业名称</span></div>
        <div class="right">
          <input
            type="text"
            disabled
            placeholder="上传后自动识别"
            :value="claimData.Name"
          />
        </div>
      </div>
      <div class="publicInput">
        <div class="left"><span>信用代码</span></div>
        <div class="right">
          <input
            type="text"
            disabled
            placeholder="上传后自动识别"
            :value="claimData.RegNum"
          />
        </div>
      </div>
      <div class="publicInput">
        <div class="left"><span>企业类型</span></div>
        <div class="right">
          <input
            type="text"
            disabled
            placeholder="上传后自动识别"
            :value="claimData.Type"
          />
        </div>
      </div>
      <div class="publicInput">
        <div class="left"><span>法人姓名</span></div>

        <div class="right">
          <input
            type="text"
            disabled
            placeholder="上传后自动识别"
            :value="claimData.Person"
          />
        </div>
      </div>
      <div class="publicInput">
        <div class="left">
          <span>注册资本</span>
        </div>

        <div class="right">
          <input
            type="text"
            disabled
            placeholder="上传后自动识别"
            :value="claimData.Capital"
          />
        </div>
      </div>
      <div class="publicInput">
        <div class="left">
          <span>企业住所</span>
        </div>
        <div class="right">
          <input
            type="text"
            disabled
            placeholder="上传后自动识别"
            :value="claimData.Address"
          />
        </div>
      </div>
      <button class="submit" @click="confirmReceipt">确认领取</button>
    </div>
  </div>
</template>

<script>
import upload from '../../../utils/upload.js'
import { Toast } from 'vant'
import { mapState } from 'vuex'
export default {
  components: {
    Toast
  },
  props: {
    isClaimShowData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    ...mapState('user', ['codeCD'])
  },
  watch: {
    isClaimShowData: {
      handler(value) {
        // console.log(value)
      },
      deep: true, // 深度监听
      immediate: true, // 初次监听即执行  
    }
  },
  data() {
    return {
      timer: null,     //设置定时器存储
      codeInfo: '获取',    //验证码
      license: '',       //营业执照
      infoData: {
        phone: '',
        password: '',
        ispassword: '',
        code: ''
      },
      claimData: {
        Name: '',    //名称
        Type: '',    //类型
        Address: '',     //住所
        Person: '',      //法定代表人
        Capital: '',     //注册资本
        SetDate: '',      //成立日期
        Period: '',       //营业期限
        Business: '',       //经营范围

        ComposingForm: '',
        RecognizeWarnCode: '',
        RecognizeWarnMsg: '',
        RegNum: '',
        RequestId: '',
      }
    }
  },
  mounted() {
  },
  methods: {
    obtain() {     //获取验证码
      if (this.codeInfo != "获取") {
        return
      }
      if (!this.verificationPhone()) return;
      let loadingCode = Toast.loading({
        message: "加载中...",
        duration: 0,
        forbidClick: false,
        className: "DetailLoading"
      });
      this.$api.claim.getCode({ phone: this.infoData.phone, type: 1 }).then(resp => {
        loadingCode.clear()
        if (resp) {
          Toast.success({
            duration: 2000, // 持续展示 toast
            forbidClick: false,
            message: resp.message,
            className: "successToast"
          });
        }
        this.codeCDfn()
      })
    },
    codeCDfn() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      let num = this.codeCD;
      this.timer = setInterval(() => {
        this.codeInfo = (--num) + '(s)';
        if (num <= 0) {
          clearInterval(this.timer)
        }
      }, 1000)
    },
    confirmReceipt() {     //确认领取按钮点击
      if (!this.verificationPhone()) return;
      if (this.infoData.password && this.infoData.ispassword && this.infoData.password != this.infoData.ispassword) {
        Toast.fail({
          message: "两次密码不一致",
          duration: 2000,
          forbidClick: false,
          className: "failToast"
        });
        return
      }
      let loadingCHU = Toast.loading({
        message: "处理中...",
        duration: 0,
        forbidClick: false,
        className: 'DetailLoading'
      })
      let thisData = this.claimData;
      let data = {
        id: this.isClaimShowData.id,   //
        RegNum: thisData.RegNum,          //信用代码
        Name: thisData.Name,            //企业名
        Person: thisData.Person,            //法人
        Address: thisData.Address,           //详细地址
        license: this.license,           //营业执照
        phone: this.infoData.phone,           //手机号
        password: this.infoData.ispassword,            //密码
        code: this.infoData.code          //验证码
      }
      // console.log(data)
      this.$api.claim.getClaim(data).then(resp => {
        loadingCHU.clear()
        if (resp) {
          alert(resp.message)
        }
      }).catch(err => {
        console.warn(err)
      })
    },
    uploadLicense() {      //上传执照
      this.$nextTick(() => {
        this.$refs.license.value = '';
        Object.keys(this.claimData).forEach((item) => { this.claimData[item] = '' })
        this.$refs.license.click();
      })
    },
    verificationPicFile(e) {
      var fileTypes = [".jpg", ".png"];
      let filePath = this.$refs.license.value;
      let _this = this;
      if (filePath) {
        var isNext = false;
        var fileEnd = filePath.substring(filePath.indexOf("."));
        for (var i = 0; i < fileTypes.length; i++) {
          if (fileTypes[i] == fileEnd) {
            isNext = true;
            break;
          }
        }
        if (!isNext) {
          alert('不接受此文件类型');
          return false;
        }
        let f = this.$refs.license.files[0];    //获取文件
        let loadingFile = Toast.loading({
          message: "处理中...",
          duration: 0,
          forbidClick: false,
          className: "DetailLoading"
        })
        new Promise((resolve, reject) => {
          if (0) {    //废除
            // if (window.FileReader) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
              let url = reader.result;
              resolve(url)
            }
            reader.readAsDataURL(f);
          } else {
            upload(f, name => {
              if (name) {
                let url = "https://" + name;
                _this.license = url;
                resolve(url)
              }
            })
          }
        }).then((resp) => {
          _this.$api.claim.getBizLicense({ image: resp }).then(resp => {
            loadingFile.clear()
            if (resp) {
              let data = JSON.parse(resp.data)
              Object.assign(_this.claimData, data)
            }
          })
        }).catch(() => {
          loadingFile.clear()
        })
      } else {
        return false
      }
    },
    verificationPhone() {     //手机号验证
      var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (reg_tel.test(this.infoData.phone)) {
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
  },
}
</script>

<style scoped>
.isClaim {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px 30px;
}
.isClaim .toplogo {
  width: 100%;
  text-align: left;
}
.showP {
  width: 100%;
  text-align: center;
  font-size: 28px;
  color: #979799;
  line-height: 50px;
}
.titlebox {
  width: 90%;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: space-between;
}
.toplogo img {
  width: 50px;
  height: 50px;
  vertical-align: middle;
}
.toplogo h2 {
  font-size: 30px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 20px;
  font-weight: 500;
  color: #4a4c51;
}

.box {
  width: 90%;
  margin: 30px auto 0;
  /* min-height: 900px; */
  height: 950px;
  overflow: hidden;
  overflow-y: auto;
}
.box > div {
  height: 70px;
  width: 100%;
  line-height: 70px;
  vertical-align: middle;
  margin-bottom: 20px;
}
.entTitle > div {
  display: inline-block;
  box-sizing: border-box;
}
.entTitle span {
  font-size: 28px;
  color: #203054;
  margin: 0 35px;
}
.entTitle .right span {
  margin: 0;
}
.box .entTitle {
  background: transparent;
}
/* .entTitle{
} */
.publicInp {
  background: #f8f8f8;
  border-radius: 10px;
  display: flex;
}
.publicInp .left {
  width: 30%;
  max-width: 30%;
  text-align: center;
  font-size: 24px;
  /* vertical-align: middle; */
  /* line-height: 70px; */
  box-sizing: border-box;
}
.left span {
  font-size: 24px;
  display: inline-block;
  line-height: normal;
  vertical-align: middle;
}
.publicInp .right {
  width: 70%;
  max-width: 70%;
  overflow: hidden;
}
.publicInp .right input {
  outline: none;
  border: none;
  height: 100%;
  width: 100%;
  background: transparent !important;
  font-size: 28px;
  letter-spacing: 1px;
}
.publicInp .right input:focus {
  background: transparent;
}
.code {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.codebox {
  border-radius: 8px;
  width: 68%;
  background: #f8f8f8;
}
.code .codebox .left {
  width: 40%;
  max-width: 40%;
}
.codebox .right {
  width: 60%;
  max-width: 60%;
}
.daojishi {
  width: 26.5%;
  text-align: center;
  color: #fff;
  background: #eb0819;
  border-radius: 8px;
  font-size: 26px;
  letter-spacing: 1px;
  font-weight: 500;
}
.upload {
  background: #f8f8f8;
  border-radius: 10px;
  display: flex;
}
.upload .left {
  width: 27%;
  text-align: center;
  font-size: 24px;
}
.upload .right {
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 12px;
}
.upload .right input[type="text"] {
  height: 100%;
  width: 290px;
  outline: none;
  /* padding: 0 20px; */
  font-size: 26px;
  /* float: left; */
  /* border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  border: 1px solid #dfdfe1; */
  box-sizing: border-box;
  background: transparent;
}
.upload .handleUploadDiv {
  background: #eb0819;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  color: #fff;
  font-size: 24px;
  width: 26%;
  height: 100%;
  text-align: center;
}
.tishi {
  text-align: center;
  color: #eb0819;
  font-size: 26px;
  margin: 20px 0;
  margin-top: 30px;
}
.publicInput {
  width: 100%;
  display: flex;
  background: #f8f8f8;
  border-radius: 10px;
  height: 70px;
}
.publicInput .left{
  width: 30%;
  box-sizing: border-box;
  vertical-align: middle;
  text-align: center;
}
.publicInput .right{
  width: 70%;
  box-sizing: border-box;
  vertical-align: middle;
}
.publicInput .right input {
  background: transparent;
  font-size: 24px;
  vertical-align: middle;
}
.submit {
  width: 100%;
  outline: none;
  border: none;
  background: #eb0819;
  color: #fff;
  height: 75px;
  border-radius: 12px;
  font-size: 28px;
  margin-top: 30px;
  margin-bottom: 10px;
}
.sender {
  background: #f3f3f3;
  color: #c8c8c8;
}
</style>