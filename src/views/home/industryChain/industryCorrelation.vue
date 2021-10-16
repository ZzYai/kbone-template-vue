<template>
  <div class="industryCorrelation">
    <div class="correlationTitleDiv" id="titleHolder">
      <div class="correlationTitle">
        <span>{{ JSON.parse($route.query.name) }}</span>
        <button class="redBtn" @click="returnChain">返回</button>
      </div>
      <div class="classification">
        <Field
          v-model="fieldValue"
          is-link
          label=" "
          readonly
          class="fieldclass"
          label-class="fieldlabel"
          label-width="50px"
          placeholder="请选择分类"
          @click="show = true"
        />
        <div class="alldata" :class="{ on: tosenddata.all }" @click="handleall">
          <span>全部</span>
        </div>
      </div>
    </div>
    <div :style="{ height: titleHeight + 20 + 'px' }"></div>
    <List
      class="chainList"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div
        class="enterpriseItem"
        v-for="(item, index) in enterpriseList"
        :key="index"
      >
        <div class="imgDiv">
          <img :src="item.logo" alt="" />
        </div>
        <span>{{ item.enterprise }}</span>
        <p class="pTwo">
          <!-- <span>共</span>
          <span class="fcRed">39</span>
          <span>个商机</span> -->
          <span class="fcur" @click="goEnterprise(item)">(查看官网)</span>
        </p>
      </div>
    </List>
    <Popup
      v-model="show"
      round
      position="bottom"
      class="Cascaderpopup"
      @open="getClassifyInfo"
    >
      <Cascader
        :class="'choiceClass'"
        v-model="cascaderValue"
        title="请选择分类"
        :options="options"
        :field-names="fieldNames"
        @close="show = false"
        @change="changeValue"
      />
    </Popup>
    <!-- <page :page="1" :pageSize="8" :total="100" @pageChange="pageChange"/> -->
  </div>
</template>

<script>
import { List, Cascader, Popup, Field } from 'vant';
// import page from "../../../components/page"
export default {
  components: {
    // page,
    List,
    Cascader,
    Popup,
    Field
  },
  data() {
    return {
      titleHeight: 0,
      loading: false,     //加载
      finished: false,    //加载
      show: false,     //展示弹窗
      fieldValue: null,   //  暂时停留数据
      cascaderValue: null,   //弹窗里数据
      options: [],
      fieldNames: {      //修改默认数据
        text: 'name',
        value: 'id'
      },

      enterpriseList: [
      ],
      tosenddata: {
        pageSize: 10,
        classify: 1,
        all: 1,
        level: 0
      },     //要发送请求的同一参数
      topage: 1    //翻页
    }
  },
  mounted() {
    this.getHeight();
    this.tosenddata.classify = this.$route.query.id;
  },
  methods: {
    goEnterprise(item) {     //前往官网
      // console.warn("后期使用userid", item)
      this.$router.push({
        path: 'enterprise/enterpriseHome',
        name: 'enterpriseHome',
        query: {
          id: item.userid    //到时替换userid
        }
      })
    },
    changeValue({ value, selectedOptions, tabIndex }) {       //每次选中数据触发
      let data = {
        pageSize: 10,
        pid: value,
        chain: Number(this.$route.query.id)
      }
      this.$api.enterprise.getIndustryChains(data).then(resp => {
        if (resp) {
          let lindata = resp.data.data;
          if (lindata.length != 0) {
            let linjie = [];
            lindata.forEach(item => {
              linjie.push(item);
            });
            this.$set(selectedOptions[tabIndex], 'children', linjie);
          } else {
            this.show = false;
          }
        }
      });
      // console.log(selectedOptions[tabIndex]);
      this.enterpriseList.splice(0)
      this.tosenddata.classify = selectedOptions[tabIndex].id;
      this.tosenddata.level = tabIndex;
      this.tosenddata.all = 0;
      this.finished = false;
      this.loading = true;
      this.topage = 1;
      this.onLoad();
      this.fieldValue = selectedOptions.map((option) => {
        return option.name
      }).join('/');

    },
    getClassifyEnterpriseInfo() {   //请求对应企业数据
      //默认1全部企业
      this.tosenddata.page = this.topage++;
      let data = { ...this.tosenddata };
      // console.log(data)
      this.$api.enterprise.getClassifyEnterprise(data).then(resp => {
        let lindata = resp.data.data;
        // console.log(lindata)
        if (lindata.length != 0) {
          lindata.forEach((item) => {
            this.enterpriseList.push(item);
          });
          this.loading = false;
        } else {
          this.loading = true;
          this.finished = true;
        }
      })
    },
    handleall() {
      //点击全部
      // console.log("点击全部")
      this.tosenddata.all = 1;
      this.enterpriseList.splice(0);
      this.topage = 1;
      this.fieldValue = '';
      this.tosenddata.level = 0;
      this.tosenddata.classify = this.$route.query.id;
      this.loading = false;
      this.finished = false;

    },
    getClassifyInfo() {     //页面初始  搜索分类
      let _this = this;
      this.options.splice(0);
      let data = {
        pageSize: 10,
        pid: 0,
        chain: Number(this.$route.query.id)
      }
      this.$api.enterprise.getIndustryChains(data).then(resp => {
        if (resp) {
          let lindata = resp.data.data;
          lindata.forEach((item, index) => {
            _this.options.push(item);
          });
        }
      });
    },
    // 获取调试
    getHeight() {
      let a = document.getElementById("titleHolder").offsetHeight
      this.titleHeight = a
    },
    returnChain() {
      this.$router.replace({
        path: '/home/industryChain'
      })
    },
    changeLevelOne(val) {
      this.levelOneActive = val.text
    },
    changeLevelTwo(val) {
      this.levelTwoActive = val.text
    },
    changeLevelThree(val) {
      this.levelThreeActive = val.text
    },
    pageChange() {

    },

    onLoad() {
      setTimeout(() => {
        this.getClassifyEnterpriseInfo()
      }, 500);
    },
  },

}
</script>
<style>
.van-cell__title {
  width: 100px !important;
}
.Cascaderpopup {
  height: 800px;
}
.choiceClass {
  height: 100%;
  overflow: hidden;
}
.fieldlabel {
  line-height: 30px;
  padding-top: 5px;
}
.choiceClass .van-cascader__header {
  padding: 38px 20px;
  height: auto;
}
.choiceClass .van-cascader__header .van-cascader__title {
  font-size: 30px;
  display: inline-block;
  width: auto;
  height: auto;
}
.choiceClass .van-tabs {
  height: 100%;
}
.choiceClass .van-tabs .van-tabs__content .van-cascader__options {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
.choiceClass .van-tabs span {
  font-size: 30px;
  padding: 10px;
}
.van-field__control {
  font-size: 28px;
  text-align: left;
}
.van-list__finished-text {
  font-size: 22px;
}
</style>
<style scoped>
.industryCorrelation {
  width: 100%;
  /* height: 800px; */
  background: #ffffff;
}
.correlationTitleDiv {
  position: fixed;
  background: #ffffff;
  width: 100%;
  border-bottom: 1px solid #eeeeee;
  padding-bottom: 20px;
  /* height: 100%; */
}
.correlationTitle {
  /* width: 700px; */
  width: 100%;
  box-sizing: border-box;
  padding: 0 25px;
  margin: 20px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.correlationTitle span {
  font-size: 24px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
}
.correlationTitle .redBtn {
  width: 80px;
  height: 40px;
  font-size: 20px;
}

.industryCorrelation .divOne {
  width: 700px;
  margin: 0 auto;
  display: flex;
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  /* line-height: 20px; */
}
.industryCorrelation .divOne span {
  width: 80px;
  color: rgba(0, 0, 0, 0.75);
  height: 38px;
  line-height: 38px;
  text-align: right;
}
.divOne .levellOne {
  /* border:1px solid red; */
  width: 620px;
}
.divOne .levellOne button {
  margin-left: 14px;
  padding: 5px 10px;
  margin-bottom: 10px;
  font-size: 18px;
  /* height: 28px; */
}
.chainList {
  /* width: 700px; */
  width: 100%;
  overflow: hidden;
  margin: 0 auto 20px;
  box-sizing: border-box;
  /* padding: 0 20px; */
  padding-bottom: 100px;
}
.enterpriseItem {
  display: flex;
  width: 100%;
  height: 120px;
  align-items: center;
  margin-bottom: 23px;
  box-sizing: border-box;
  padding: 0 25px;
}

.imgDiv {
  width: 152px;
  height: 80px;
  margin-right: 23px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eeeeee;
}
.imgDiv img {
  width: auto;
  height: auto;
  max-height: 100%;
  max-width: 100%;
}
.enterpriseItem p,
.enterpriseItem > span {
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6d7587;
}
.enterpriseItem .pTwo {
  margin-left: auto;
}
.enterpriseItem .pTwo .fcur {
  padding: 10px;
  border-radius: 5px;
  /* background: #f32a37; */
  color: #f32a37;
  font-size: 24px;
  margin-right: 15px;
}
.fieldclass {
  font-size: 30px;
  line-height: 30px;
  vertical-align: middle;
}
.classification {
  position: relative;
  vertical-align: middle;
  height: auto;
  box-sizing: border-box;
  padding: 0 10px;
  font-size: 30px;
}

.classification .alldata {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: auto;
  left: 25px;
  font-size: 22px;
  box-sizing: border-box;
  color: #242424;
  background: #fafafa;
  border-radius: 5px;
  border: none;
  width: 80px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  display: inline-block;
}
.classification .alldata span{
  display: inline-block;
  width: 100%;
  line-height: 1;
}
.classification .alldata.on {
  background: #f32a37;
  color: #fff;
}
</style>