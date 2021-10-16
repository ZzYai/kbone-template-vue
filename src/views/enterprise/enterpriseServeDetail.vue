<template>
  <div class="enterpriseServeDetail">
    <div class="titledom">
      <span @click="goback"> <i>&lt;</i> 返回 </span>
      <p>{{cunData.type == 'serve'?'服务库详情':'新闻详情'}}</p>
    </div>
    <div
      class="waijing"
      :style="{ height: thisdata && thisdata.url ? 'auto' : 0 }"
    >
      <iframe :src="thisdata ? thisdata.url : null"></iframe>
    </div>
    <div class="divTitle">
      <div class="imgDiv">
        <img :src="cunData.image" />
      </div>
      <div class="detailInfo">
        <p class="titleTop">{{ cunData.title }}</p>
        <p class="pTwo">{{ cunData.desc }}</p>
        <p class="pThree">{{ cunData.created_at }}</p>
        <img
          src="../../assets/homeAddr/homeAddr-onlineMessage.svg"
          @click="gocontact"
        />
      </div>
    </div>
    <div class="detailInfoTitle">产品服务详情</div>
    <div class="detailPPT" v-html="cunData.content"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cunData: {},
      linData: null,
      thisdata: null,
    }
  },
  computed: {
  },
  created() {
    this.cunData = JSON.parse(decodeURIComponent(this.$route.params.data));
    // console.log(this.cunData)
  },
  mounted() {
    this.getData()

  },
  methods: {
    gocontact() {   //在线沟通
      this.$router.push({
        path: '/home/sayMessage',
        name: 'sayMessage',
        params: {
          id: this.$route.params.id,
          info: JSON.stringify(this.linData)
        }
      })
    },
    getData() {
      this.$api.enterprise.getEnterpriseInfo({ id: this.$route.params.id }).then(resp => {
        if (resp) {
          this.linData = resp.data;
        }
      });
      this.$api.enterprise.getopportunity({ id: this.cunData.id }).then(resp => {
        if (resp) {
          this.thisdata = resp.data;
        }
      })
    },
    goback() {     //返回按钮
      //   window.history.forward(1)
      this.$router.go(-1);

    },

  }
}
</script>
<style >
.detailPPT p img {
  width: 100% !important;
  max-width: 100% !important;
}
</style>
<style>
.pTwo p {
  font-size: 26px;
  line-height: 28px;
  margin: 10px 0;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>
<style scoped>
.enterpriseServeDetail {
  width: 100%;
  height: 100%;
  padding-top: 100px;
  box-sizing: border-box;
  /* margin: 20px auto; */
}
.titledom {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 90px;
  width: 100%;
  background: #fff;
  z-index: 1800;
}
.titledom span {
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 26px;
  color: rgb(24, 48, 80);
  height: 40px;
  line-height: 40px;
}
.titledom span i {
  display: inline-block;
  height: 100%;
  line-height: 40px;
}
.titledom p {
  width: 100%;
  height: 90px;
  box-shadow: 1px 10px 10px rgba(100, 101, 102, 0.12);
  text-align: center;
  line-height: 90px;
  font-size: 30px;
}
.waijing {
  width: 100%;
  height: auto;
  margin-top: 8px;
}
.waijing iframe {
  width: 100%;
}
.divTitle {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}
.divTitle .imgDiv {
  width: 250px;
  height: 277px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f6f6;
  margin-top: 20px;
  margin-right: 20px;
}
.imgDiv img {
  width: auto;
  height: auto;
  max-height: 280px;
  max-width: 200px;
}
.detailInfo {
  width: 425px;
  margin-top: 10px;
  box-sizing: border-box;
  padding-top: 20px;
}
.detailInfo p {
  color: #6d7587;
  margin-bottom: 24px;
}
.pOne {
  font-size: 30px;
  text-align: center;
  padding: 30px 0;
  color: rgb(102, 102, 102);
  box-sizing: border-box;
}
.titleTop,
.pTwo,
.pThree {
  font-size: 26px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}
.pTwo {
  max-height: 400px;
  overflow: hidden;
  overflow-y: auto;
}

.detailInfo img {
  width: 150px;
  /* height: 40px; */
  cursor: pointer;
}
.detailInfoTitle {
  width: 100%;
  height: 55px;
  background: #fbfbfb;
  border: 1px solid #ededed;
  margin-top: 49px;
  line-height: 55px;
  text-align: center;
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #6d7587;
}
.detailPPT {
  margin-top: 10px;
  width: 100%;
  /* border:1px solid red; */
  /* display: flex;
        align-items: center;
        justify-content: center; */
}
</style>