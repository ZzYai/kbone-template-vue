<template>
  <div class="industryChain">
    <div class="industryChainTitle">
      <span>金普新区产业链集群列表</span>
      <!-- <button class="whiteBtn">关闭</button> -->
    </div>
    <div class="industryChainTitle-holder"></div>
    <List
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      class="industryChainList"
      @load="onLoad"
    >
      <div
        class="industryChainItem"
        v-for="(item, index) in chainList"
        :key="index"
      >
        <div class="imgDiv">
          <img :src="item.image ? item.image : errImg" />
          <!-- <img :src="item.image" /> -->
        </div>
        <div class="infoDiv">
          <p class="pOne">
            <span class="spanOne">{{ item.name }}</span>
            <span class="spanTwo">共有{{ item.count }}个关联企业</span>
          </p>
          <p class="pTwo">
            {{ item.desc }}
          </p>
          <div class="divOne">
            <div :style="{display : item.tag_1?'block':'none'}">{{ item.tag_1 }}</div>
            <div :style="{display : item.tag_2?'block':'none'}">{{ item.tag_2 }}</div>
            <div :style="{display : item.tag_3?'block':'none'}">{{ item.tag_3 }}</div>
          </div>
        </div>
        <div class="btnDiv">
          <button class="redBtn" @click="intoChain(item)">进入产业链</button>
          <p @click="knowMore(item)">了解更多</p>
        </div>
      </div>
    </List>
    <!-- <page/> -->
    <Popup
      v-model="knowMoreShow"
      position="top"
      @open="handleOpen"
      style="100%"
    >
      <knowMore ref="knowMoredom" :knowMoreData="knowMoreData" />
    </Popup>
  </div>
</template>

<script>
import { List } from 'vant';
import page from "../../../components/page"
import knowMore from "./knowMore.vue"
import { Popup } from 'vant'
export default {
  components: {
    page,
    Popup,
    knowMore,
    List
  },
  data() {
    return {
      errImg: require('../../../assets/errImg1.png'),
      chainList: [      //总数据

      ],
      topage: 1,     //翻页
      knowMoreShow: false,    //显示查看更多
      knowMoreData: {},        //查看更多信息
      loading: false,
      finished: false,
    }
  },
  methods: {

    getChainsInfo() {    //获取产业链所有
      this.$api.enterprise.getChains({
        pageSize: 10,
        page: this.topage++
      }).then(resp => {
        // console.log(resp)
        if (resp) {
          let data = resp.data.data;
          if (data.length == 0) {
            this.loading = true;
            this.finished = true;
          }
          data.forEach(item => {
            this.chainList.push(item);
          })
          this.loading = false;
        }
      });
    },
    intoChain(item) {     //进入产业链
      this.$router.replace({
        path: '/home/industryCorrelation',
        query: {
          id: item.id,
          name: JSON.stringify(item.name)
        }
      });
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        this.getChainsInfo();
        // 数据全部加载完成
      }, 1000);
    },
    knowMore(item) {
      this.knowMoreData = item;
      this.knowMoreShow = true;
    },
    handleOpen() {     //窗口打开
      this.$nextTick(() => {
        this.$refs.knowMoredom.obtainShow()
      })
    }
  },
  mounted() {
    this.getChainsInfo()
  }
}
</script>

<style scoped>
.industryChain {
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;
  padding-bottom: 120px;
}
.industryChainTitle {
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  background: #ffffff;
  border-bottom: 1px solid #eeeeee;
  padding-left: 20px;
}
.industryChainTitle-holder {
  height: 80px;
}
.industryChainTitle span {
  font-size: 22px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
}
.industryChainTitle .whiteBtn {
  width: 62px;
  height: 31px;
}
.industryChain .industryChainList {
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  padding-top: 20px;
}
.industryChain .industryChainItem {
  /* width: 710px; */
  width: 100%;
  height: 230px;
  background: #ffffff;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  border: 1px solid #f3f3f3;
  margin: 0 auto;
  margin-bottom: 20px;
  display: flex;
  padding: 24px 12px 12px;
  box-sizing: border-box;
  justify-content: space-around;
  box-sizing: border-box;
}
.industryChainItem .imgDiv {
  width: 158px;
  min-width: 158px;
  max-width: 158px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e6e6e6;
}
.industryChainItem img {
  width: auto;
  height: auto;
  max-height: 100%;
  max-width: 100%;
  background: #eeeeee;
  /* margin-right: 20px; */
}
.industryChainItem .infoDiv {
  width: 380px;
  margin-left: 15px;
  height: 100%;
}
.industryChainItem .btnDiv {
  margin-left: 20px;
  width: 20%;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
}
.industryChainItem .btnDiv button {
  height: 45px;
  line-height: normal;
  font-size: 18px;
  padding: 0 10px;
  vertical-align: middle;
  white-space: nowrap;
}
.industryChainItem .btnDiv p {
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6d7587;
  margin-top: 30px;
  text-decoration: underline;
  cursor: pointer;
}
.infoDiv .pOne {
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1;
  display: flex;
  align-content: center;
  align-items: center;
  vertical-align: middle;
  justify-content: space-between;
}
.infoDiv .pOne .spanOne {
  font-size: 24px;
  color: #6d7587;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: top;
  max-width: 210px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  /* padding-top: 5px; */
  line-height: normal;
}
.infoDiv .pOne .spanTwo {
  font-size: 20px;
  color: #e70011;
  /* margin-left: 20px; */
  height: 100%;
  vertical-align: top;
  white-space: nowrap;
  line-height: 1;
  margin-left: auto;
  margin-right: 0;
}
.infoDiv .pTwo {
  width: 100%;
  font-size: 18px;
  font-weight: 400;
  color: #a7aab1;
  line-height: 28px;
  margin-top: 10px;
  overflow: hidden;
  padding-top: 5px;
  height: 82px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.infoDiv .divOne {
  display: flex;
  margin-top: 10px;
}
.infoDiv .divOne div {
  background: #fafafa;
  border-radius: 5px;
  border: 1px solid #f0f0f0;
  padding: 5px 10px;
  /* height: 40px; */
  margin-right: 10px;
  line-height: 28px;
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  white-space: nowrap;
  color: #6d7587;
}
</style>