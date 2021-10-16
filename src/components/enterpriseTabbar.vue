<template>
  <div class="homeTabbar">
    <div class="imgtitle">
      <img src="../assets/LOGO.png" />
      <span>金普新区数字化创新地图</span>
    </div>
    <div class="tabbar">
      <p>官网导航</p>
      <div class="boxBar">
        <div class="skipBtn" @click="changePage(12)">
          <img
            src="../assets/homeTabbar/home-red.svg"
            alt=""
            v-if="pageActive == 12"
          />
          <img src="../assets/homeTabbar/home-black.svg" v-else />
          <p :class="{ redP: pageActive == 12 }">首页</p>
        </div>
        <div class="skipBtn" @click="changePage(6)">
          <img
            src="../assets/homeTabbar/homeTabbar-addr-red.svg"
            v-if="pageActive == 6"
          />
          <img src="../assets/homeTabbar/homeTabbar-addr-black.svg" v-else />
          <p :class="{ redP: pageActive == 6 }">企业全景</p>
        </div>
        <div class="skipBtn" @click="changePage(7)">
          <img
            src="../assets/homeTabbar/servelib-red.svg"
            v-if="pageActive == 7"
          />
          <img src="../assets/homeTabbar/servelib-black.svg" v-else />
          <p :class="{ redP: pageActive == 7 }">产品服务库</p>
        </div>
        <div class="skipBtn" @click="changePage(8)">
          <img
            src="../assets/homeTabbar/picture-red.svg"
            v-if="pageActive == 8"
          />
          <img src="../assets/homeTabbar/picture-black.svg" v-else />
          <p :class="{ redP: pageActive == 8 }">企业图集</p>
        </div>
        <div class="skipBtn" @click="changePage(13)">
          <img
            src="../assets/homeTabbar/homeTabbar-message-red.svg"
            v-if="pageActive == 13"
          />
          <img src="../assets/homeTabbar/homeTabbar-message-black.svg" v-else />
          <p :class="{ redP: pageActive == 13 }">企业新闻</p>
        </div>
        <div class="skipBtn" @click="changePage(9)">
          <img
            src="../assets/homeTabbar/homeTabbar-bussiness-red.svg"
            v-if="pageActive == 9"
          />
          <img
            src="../assets/homeTabbar/homeTabbar-bussiness-black.svg"
            v-else
          />
          <p :class="{ redP: pageActive == 9 }">企业PPT</p>
        </div>
        <div class="skipBtn" @click="changePage(10)">
          <img
            src="../assets/homeTabbar/about-red.svg"
            alt=""
            v-if="pageActive == 10"
          />
          <img src="../assets/homeTabbar/about-black.svg" v-else />
          <p :class="{ redP: pageActive == 10 }">联系我们</p>
        </div>
        <!-- <div class="midBtn" @click="changePage(5)">
            <img src="../assets/homeTabbar/homeTabbar-midBtn.svg" alt="">
        </div> -->
        <!-- <div class="skipBtn" @click="changePage(11)">
            <img src="../assets/homeTabbar/homeTabbar-message-red.svg"  v-if="pageActive==11">
            <img src="../assets/homeTabbar/homeTabbar-message-black.svg" v-else>            
            <p :class="{'redP':pageActive==11}">企业宣传</p>
        </div> -->
      </div>
    </div>
    <div class="boxFun">
      <p>功能导航</p>
      <div class="function">
        <div @click="gobackHome">
          <p>返回地图</p>
          <i><img src="../assets/right.svg" /></i>
        </div>
        <div @click="myFootprint('yes')">
          <p>我的足迹</p>
          <i><img src="../assets/right.svg" /></i>
        </div>
        <div @click="myFootprint">
          <p>个人中心</p>
          <i><img src="../assets/right.svg" /></i>
        </div>
      </div>
    </div>
    <div class="handleOff" @click="handleOff">
      <button>关闭</button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
export default {
  computed: {
    ...mapState("pageActive", ['pageActive']),
  },
  // props:{
  //     btnList:{
  //         type:Array,
  //         default:()=>[]
  //     }
  // },
  // 监听,当路由发生变化的时候执行

  data() {
    return {
      btnActive: 1
    }
  },
  mounted() {
    // console.log(this.pageActive)

  },
  methods: {
    handleOff() {      //关闭侧边栏
      this.$emit('handleOff');
    },
    changePage(val) {
      this.$store.commit("pageActive/setPageActive", val)
      // this.btnActive = val
      this.$emit("changePage", val)
    },
    gobackHome() {
      this.$router.replace({
        path: '/home'
      })
    },
    myFootprint(value) {
      let a = value == 'yes' ? 'yes' : "";
      this.$router.push({
        name: 'mine',
        params: {
          val: a
        }
      })
    }
  }
}
</script>

<style  scoped>
.homeTabbar {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #ffffff;
  padding: 35px 52px;
}
.imgtitle {
  width: 100%;
  margin: 65px 0 70px;
  box-sizing: border-box;
  height: 40px;
}
.imgtitle img {
  width: 40px;
  height: 40px;
  vertical-align: middle;
}
.imgtitle span {
  vertical-align: middle;
  margin-left: 20px;
  font-size: 30px;
  font-weight: 600;
  white-space: nowrap;
}
.tabbar {
  width: 100%;
  height: auto;
}
.tabbar > p {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.1;
  /* font-family: PingFangSC-Regular,PingFangSC; */
  font-style: normal;
}
.tabbar .boxBar {
  margin-top: 57px;
  /* display: flex;
  justify-content: flex-start;
  flex-wrap: wrap; */
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-template-rows: auto;
  -ms-grid-template-columns: 33% 33% 33%;
  -ms-grid-template-rows: auto;
  grid-template-columns: 33% 33% 33%;
  grid-template-rows: auto;
  width: 100%;
  height: auto;
  text-align: center;
}
.boxBar .skipBtn {
  flex: 0 0 33%;
  width: 110px;
  text-align: center;
  min-width: 110px;
  max-width: 110px;
  margin-bottom: 57px;
  box-sizing: border-box;

  /* margin-right: 45px; */
  /* margin: 0 25px; */
}
.boxBar .skipBtn img {
  margin-bottom: 23px;
  width: 40px;
  height: 40px;
}
.boxBar .skipBtn p {
  font-size: 22px;
  white-space: nowrap;
}
.boxFun {
  margin: 30px 0 50px;
  width: 100%;
}
.boxFun > p {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.1;
  font-family: PingFang SC;
}
.function {
  width: 100%;
  margin-top: 64px;
}
.function > div {
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-bottom: 58px;
  box-sizing: border-box;
  padding-right: 20px;
}
.function > div p {
  font-size: 22px;
  display: inline-block;
}
.function > div i {
  float: right;
  vertical-align: top;
  height: 40px;
  margin: 0;
  line-height: 40px;
}
.function > div i img {
  width: 26px;
  height: 6;
  vertical-align: middle;
}
.handleOff {
  width: 100%;
  text-align: center;
}
.handleOff button {
  outline: none;
  width: 380px;
  height: 60px;
  background: #f9f9f9;
  border-radius: 5px;
  border: 1px solid #e6e6e6;
  font-size: 20px;
  font-weight: 400;
  color: #6a788c;
}
</style>