<template>
  <div class="knowMore">
    <div class="titleDiv">
      <div class="imgDiv">
        <img :src="chainsData.image" alt="" />
      </div>
      <div class="infoDiv">
        <p class="pOne">{{ chainsData.name }}</p>
        <p class="pTwo">{{ chainsData.desc }}</p>
        <div class="divOne">
          <div :style="{display: chainsData.tag_1?'block':'none'}">{{ chainsData.tag_1 }}</div>
          <div :style="{display: chainsData.tag_2?'block':'none'}">{{ chainsData.tag_2 }}</div>
          <div :style="{display: chainsData.tag_3?'block':'none'}">{{ chainsData.tag_3 }}</div>
        </div>
      </div>
    </div>
    <div class="detailText">详细介绍</div>
    <div class="editText" v-html="chainsData.content"></div>
    <!-- <button class="redBtn" @click="returnChain">返回</button> -->
  </div>
</template>

<script>
export default {
  props: {
    knowMoreData: {
      type: Object
    }
  },
  data() {
    return {
      chainsData: {}
    }
  },
  methods: {
    obtainShow() {
      this.chainsData = this.knowMoreData;
    },
    returnChain() {      //返回
      this.$emit("returnChain")
    }
  }
}
</script>

<style scrop>
.knowMore {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
  padding: 20px;
}
.titleDiv {
  display: flex;
  width: 100%;
  height: 160px;
  margin-top: 20px;
}
.titleDiv .imgDiv {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 160px;
  background: #eeeeee;
}
.titleDiv .imgDiv img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
.titleDiv .infoDiv {
  width: 448px;
  height: 100%;
  margin-left: 20px;
}
.titleDiv .infoDiv .pOne {
  font-size: 24px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #6d7587;
}
.titleDiv .infoDiv .pTwo {
  width: 520px;
  height: 68px;
  font-size: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #a7aab1;
  line-height: 23px;
  overflow: hidden;
  margin-top: 10px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.titleDiv .infoDiv .divOne {
  display: flex;
  margin-top: 10px;
}
.titleDiv .infoDiv .divOne div {
  /* width: 80px; */
  padding: 5px 10px;
  /* height: 30px; */
  background: #fafafa;
  border-radius: 5px;
  border: 1px solid #f0f0f0;
  font-size: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6d7587;
  line-height: 28px;
  text-align: center;
  margin-right: 10px;
  min-width: 100px;
  min-height: 30px;
}
.detailText {
  width: 700px;
  height: 50px;
  background: #fafafa;
  border-radius: 5px;
  border: 1px solid #e2e2e2;
  line-height: 48px;
  text-align: center;
  margin-top: 20px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6a788c;
}
.editText {
  width: 100%;
  height: 450px;
  overflow: hidden;
  overflow-y: auto;
  font-size: 26px;
  text-indent: 2em;
  box-sizing: border-box;
  padding: 10px;
  padding-top: 20px;

}
/* .knowMore .redBtn{
    margin-top: 20px;
    width:100%;
    height: 62px;
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
} */
</style>