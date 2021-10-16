<template>
  <div class="enterpriseDetail">
    <div class="title">
      <div class="imgDiv">
        <!-- <img src="../../../assets/enterpriseName/tempTest-brand.png" alt="" /> -->
        <img :src="receive.logo" alt="" />
      </div>
      <p>{{ receive.enterprise }}</p>
      <img
        src="../../../assets/homeAddr/homeAddr-audio.svg"
        @click="VoiceIntroduction"
      />
      <!-- <button class="whiteBtn" @click="closeDetail">关闭</button> -->
    </div>
    <p class="pOne">企业介绍</p>
    <div class="divOne">
      {{ receive.introduction }}
    </div>
    <div class="divTwo">
      <div>
        <p>
          <span>地址:</span>
          <span>{{ receive.address }}</span>
        </p>
        <p>
          <span>总机:</span>
          <span>{{ receive.phone }}</span>
        </p>
      </div>
      <div class="imgTwoDiv" @click="onlineSay">
        <img
          class="imgTwo"
          src="../../../assets/homeAddr/homeAddr-onlineMessage.svg"
        />
      </div>
    </div>
    <div class="rule"></div>
    <p class="pOne">
      企业图集({{ receive.gallery ? receive.gallery.length : 0 }}张)
    </p>
    <div class="enterpriseImgList">
      <div class="imgDiv">
        <!-- @touchmove.prevent="phone_mouseM"
        @touchstart="phone_mouseS"
        @touchend="phone_mouseE" -->
        <img
          :style="{ marginLeft: i == 0 ? imgLeft / 16 + 'rem' : 0 }"
          :src="item"
          alt=""
          v-for="(item, i) in receive.gallery"
          :key="i"
          @click="preview(i)"
        />
      </div>
    </div>
    <button class="redBtn" @click="goEnterprise">进入企业官网</button>
  </div>
</template>

<script>
import { ImagePreview, Toast } from 'vant';
export default {
  props: {
    enterpriseId: {
      type: Number,
      default: 0
    },
    // currentSelectPoint : {
    //   type : [Object,Array]
    // }
  },
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
    Toast
  },
  data() {
    return {
      imgList: [
      ],
      imgLeft: 10,
      phone_mouseMIndex: 0,
      phone_mouseMX0: 0,
      phone_mouseMX1: 0,
      phone_mouseMX2: 0,
      receive: { // 接收到的数组

      }
    }
  },
  created() {
    // console.log('created')
    this.getDetail()
  },
  mounted() {
    
  },
  watch: {
    "$props.enterpriseId"() {
      this.getDetail()
    }
  },
  methods: {
    VoiceIntroduction() {    //语音介绍
      if (!this.receive.speech) {
        return
      }

      let audiodom = document.getElementsByClassName('audiodom');
      if (!audiodom.length) {
        let audio = document.createElement('audio');
        audio.src = this.receive.speech;
        audio.className = "audiodom"
        document.body.append(audio);
        audio.volume = 1;
        audio.play()
      }
    },
    getDetail() {
      let data = {
        id: this.enterpriseId
      }
      let toastLoading = Toast.loading({
        message: '加载中...',
        forbidClick: false,
        duration: 0,
        className: 'DetailLoading'
      });
      let token = localStorage.getItem('token');
      if (token) {
        this.$api.enterprise.getgetEnterpriseWebsite(data).then((resp) => {
          toastLoading.clear()
          if (resp) {
            this.receive = resp.data;
            // console.log(resp.data)
          }
        })
      } else {
        toastLoading.clear()
        this.$api.enterprise.getEnterpriseInfo(data).then((resp) => {
          if (resp) {
            this.receive = resp.data;
          }
        })
      }

    },
    preview(i) {
      ImagePreview({
        images: this.receive.gallery,
        startPosition: i
      });
    },
    // phone_mouseS(e) {
    //   this.phone_mouseMX0 = e.changedTouches[0].pageX;
    // },
    // phone_mouseE(e) {
    //   this.phone_mouseMX1 = e.changedTouches[0].pageX;
    //   // this.imgLeft= this.imgLeft+(this.phone_mouseMX1*2-this.phone_mouseMX0*2 )
    // },
    // phone_mouseM(e) {
    //   this.phone_mouseMX2 = e.changedTouches[0].pageX;
    //   //   console.log('起始位置' + this.phone_mouseMX0)
    //   //   console.log(this.phone_mouseMX2)
    //   this.imgLeft = this.imgLeft + (this.phone_mouseMX2 * 2 - this.phone_mouseMX0 * 2) / 10
    //   if (this.imgLeft >= 10) {
    //     this.imgLeft = 10
    //   }
    // },
    onlineSay() {
      this.$router.push({
        path: '/home/sayMessage',
        name: 'sayMessage',
        params: {
          id: this.enterpriseId,
          info: JSON.stringify(this.receive)
        }
      })
    },
    closeDetail() {
      this.$emit("closeDetail")
    },
    goEnterprise() {
      var _this = this;
      this.$store.commit("enterprise/setPositionMapPoint",this.receive)
      // console.log(this.$store.getters['enterprise/getPositionMapPoint'])
      this.$router.push({
        path: '/enterprise',
        query: {
          id: _this.enterpriseId,
        }
      });
      this.$store.commit('pageActive/setPageActive',12);    //默认跳转首页
      // let newData  = this.receive;
      // newData.id = this.enterpriseId;



    },
    thisOpen(){     //当前页面打开后
      // console.log(this.currentSelectPoint)
    }
  },
 

}
</script>
<style scoped>
.enterpriseDetail {
  /* height: 449px; */
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  /* border: 1px solid #F3F3F3; */
  overflow: hidden;
}
.title {
  width: 750px;
  height: 90px;
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  border-bottom: 1px dashed #ededed;
  margin: 0 auto;
}
/* .title .whiteBtn{
    width: 62px;
    height: 31px;
} */
/* .title-left{
    display: flex;
    align-items: center;
} */
.title .imgDiv {
  width: 150px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  box-sizing: border-box;
  padding: 10px;
}
.title .imgDiv img {
  width: auto;
  height: auto;
  max-height: 100%;
  max-width: 100%;
}
.title > img {
  margin-left: auto;
  margin-right: 20px;
  width: 150px;
  height: 90px;
  cursor: pointer;
}
.title p {
  font-size: 28px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6d7587;
  margin: 0 10px;
}
/* .title-left .blueBtn{
    width: 87px;
    height: 25px;
} */
.enterpriseDetail .pOne {
  /* width: 48px; */
  /* height: 17px; */
  font-size: 28px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 17px;
  text-align: left;
  margin-left: 20px;
  margin-top: 20px;
}
.enterpriseDetail .divOne {
  width: 100%;
  height: 210px;
  max-height: 210px;
  font-size: 26px;
  font-weight: 400;
  color: #6d7587;
  line-height: 35px;
  margin-top: 20px;
  padding: 0 20px;
  box-sizing: border-box;
  overflow: hidden;
  overflow-y: auto;
}
.enterpriseDetail .divTwo,
.enterpriseDetail .divThree {
  display: flex;
  align-items: center;
  margin-top: 19px;
  margin-left: 20px;
  /* border:1px solid red; */
}
.enterpriseDetail .divTwo {
  justify-content: space-between;
}
.enterpriseDetail .divThree div {
  display: flex;
  align-items: center;
}
.enterpriseDetail .divThree {
  justify-content: space-between;
  margin-right: 18px;
}
.enterpriseDetail .divThree > img {
  width: 114px;
  height: 32px;
  cursor: pointer;
}
/* .divTwo div .imgOne,
.divThree div .imgOne{
    width:13px;
    height: 16px;
    margin-right: 10px;
} */
.imgTwoDiv {
  width: 150px;
  height: 50px;
  margin-right: 20px;
}
.imgTwoDiv .imgTwo {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
.divTwo p,
.divThree p {
  /* width: 270px; */
  /* height: 17px; */
  font-size: 26px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6d7587;
  line-height: 35px;
  overflow: hidden;
}
.enterpriseDetail .rule {
  width: 700px;
  height: 1px;
  border: 1px dashed #ededed;
  margin-left: 30px;
  margin-top: 19px;
}
.enterpriseImgList {
  width: 750px;
  height: 150px;
  /* margin-left: 30px; */
  margin-top: 20px;
  display: flex;
  /* position: relative; */
  /* border:1px solid red; */
}
/* .enterpriseImgList .arrow{
    position: absolute;
    top:0;
    width:40px;
    height: 150px;
    background: #eeeeee;
    font-size: 26px;
    line-height: 67px;
    text-align: center;
    cursor: pointer;
}
.arrow-left{
    left:0;
}
.arrow-right{
    right:0;
}
.enterpriseImgList .arrow:hover{
    background: #EDEDED;
}
.enterpriseImgList .arrow:active{
    background: #cfcece;
} */
.enterpriseImgList {
  height: auto;
  overflow: hidden;
  overflow-x: auto;
}
.enterpriseImgList .imgDiv {
  width: auto;
  white-space: nowrap;
  height: auto;
  padding: 10px 0;
}

.enterpriseImgList .imgDiv img {
  height: 150px;
  margin-right: 10px;
  font-size: 0;
  display: inline-block;
}
.enterpriseDetail .redBtn {
  width: 100%;
  border-radius: 0;
  height: 80px;
  margin-top: 20px;
  font-size: 28px;
}
</style>