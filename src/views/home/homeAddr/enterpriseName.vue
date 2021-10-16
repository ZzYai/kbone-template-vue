<template>
  <div class="enterprisePopover">
    <!-- 企业名录 -->
    <div class="btns" id="titleHolder">
      <!-- <button
        class="btn"
        :class="{ btnActive: btnActive == '全部' }"
        @click="changeEnterprise({ name: '全部' })"
      >
        全部
      </button> -->
      <button
        v-for="(item, index) in searchBtn"
        :key="index"
        class="btn"
        :class="{ btnActive: btnActive == item.name }"
        @click="changeEnterprise(item)"
      >
        {{ item.name }}
      </button>
    </div>
    <div class="showSort">
      <div class="choice">
        <span :class="{ on: !ishot }" @click="ishotSort(false)">默认排序</span>
        <span :class="{ on: ishot }" @click="ishotSort(true)">按热度排序</span>
      </div>
    </div>
    <!-- <div class="btnsHolder" :style="{ height: titleHeight + 20 + 'px' }"></div> -->
    <List
      class="enterpriseList"
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
          <img :src="item.logo || require('../../../assets/LOGO.png')" />
        </div>
        <div class="titleDivtop">
          <span>{{ item.enterprise }}</span>
        </div>
        <div class="joinin">
          <p>
            已加入<span>{{ item.join }}</span
            >天
          </p>
        </div>
        <div class="hotin">
          <p>
            热度<span>{{ item.hot }}</span>
          </p>
        </div>
        <div class="seeShow">
          <span class="fcur" @click="seeDetail(item.id, item)">查看</span>
        </div>
      </div>
    </List>
  </div>
</template>

<script>
import { List } from 'vant';
import page from "../../../components/page"
export default {
  components: {
    page,
    List
  },
  props: {
    enterpriseNameTagData: Array
  },
  data() {
    return {
      ishot: false,  //排序方式
      // titleHeight: 0,
      loading: false,
      finished: false,
      tagid: null,
      topage: 1,   //翻页
      searchBtn: [
      ],
      enterpriseList: [
      ],
      btnActive: '全部',
    }
  },
  mounted() {
    // this.getHeight()
    this.loading = false;
    this.finished = false;
  },
  created() {
    //获取标签
    this.searchBtn = this.enterpriseNameTagData;
    // this.getData()

  },
  methods: {
    ishotSort(value) {      //点击改变排序方式
      if (this.ishot == value) {
        return
      }
      this.ishot = value;
      this.topage = 1;
      this.enterpriseList = [];
      this.finished = false;
      this.loading = true;
      this.onLoad()
    },
    // 获取调试
    getHeight() {
      let a = document.getElementById("titleHolder").offsetHeight;
      this.titleHeight = a;
    },
    // 筛选企业
    changeEnterprise(val) {
      if (this.btnActive == val.name) {
        return
      }
      this.topage = 1;
      this.btnActive = val.name;
      this.tagid = val.id;
      this.enterpriseList = [];
      this.finished = false;
      this.loading = true;
      this.onLoad()
    },

    seeDetail(id, item) {
      if (item.claim == 1) {
        this.$router.push({
          path: '/enterprise',
          query: {
            id: id,
          }
        });
      } else {
        this.$emit("seeDetail", id, item);
      }
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        this.getData()
      }, 200);
    },
    getData() {
      //获取信息
      let _this = this;
      let data = {
        page: this.topage++,
        pageSize: 15,
        tag: this.tagid,
        order: this.ishot ? 'hot' : 'id'
      }
      if (this.btnActive.trim() === '全部') {
        data.tag = ''
      }
      this.$api.enterprise.getEnterpriese(data).then((resp) => {
        // console.log(resp)
        if (resp) {
          if (resp.data.data.length == 0) {
            _this.loading = true;
            _this.finished = true;
            return
          }
          resp.data.data.forEach((item) => {
            _this.enterpriseList.push(item)
          });
          _this.loading = false;
        } else {
          _this.finished = true;
        }
      })
    }
  }
}
</script>

<style scoped>
.enterprisePopover {
  width: 100%;
  height: 100%;
  /* height: 800px; */
  background: #ffffff;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  border: 1px solid #f3f3f3;
  padding-bottom: 30px;
  box-sizing: border-box;
}
.btns {
  /* margin:20px; */
  /* position: fixed; */
  background: #ffffff;
  padding: 20px;
  border-bottom: 1px solid #eeeeee;
}
.btns .btn {
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6a788c;
  background: #f9f9f9;
  border-radius: 5px;
  border: 1px solid #f2f2f2;
  box-sizing: border-box;
  margin-bottom: 10px;
  margin-right: 10px;
  font-size: 22px;

  padding: 5px 15px;

  line-height: normal;
}
.btns .btnActive {
  background: #eb0818;
  color: #ffffff;
  border: none;
}
.enterpriseList {
  /* height: 800px; */
  height: 76%;
  overflow: auto;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  /* margin-bottom: 20px; */
  /* border:1px solid red; */
}
.enterpriseItem {
  display: flex;
  width: 100%;
  height: 80px;
  align-items: center;
  margin-bottom: 23px;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  vertical-align: middle;
  line-height: 80px;
  box-sizing: border-box;
}
/* .enterpriseItem:hover {
  background: #f5f5f5;
} */
.imgDiv {
  width: 150px;
  height: 80px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eeeeee;
  box-sizing: border-box;
}
.imgDiv img {
  width: auto;
  height: auto;
  max-height: 100%;
  max-width: 100%;
}
.enterpriseItem .titleDivtop span {
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6d7587;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  width: 100%;
  line-height: normal;
  vertical-align: middle;
  /* height: 30px; */
}
.enterpriseItem .titleDivtop {
  /* width: 32%; */
  max-width: 33%;
  box-sizing: border-box;
  flex-grow: 1;
}
.enterpriseItem span {
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6d7587;
}
.enterpriseItem .joinin {
  box-sizing: border-box;
  width: 19%;
  min-width: 19%;
  height: 100%;
}
.enterpriseItem .hotin {
  width: 13%;
  min-width: 13%;
  height: 100%;
  /* max-width: 14%; */
  box-sizing: border-box;
}
.enterpriseItem .joinin p,
.enterpriseItem .hotin p {
  font-size: 22px;
  color: #6d7587;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  white-space: nowrap;
}
.enterpriseItem .joinin p span,
.enterpriseItem .hotin p span,
.enterpriseItem .seeShow span {
  color: #eb0818;
}
.enterpriseItem .seeShow{
  height: 100%;
  white-space: nowrap;
}
.showSort {
  height: auto;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
}
.showSort .choice {
  display: inline-block;
  border-radius: 10px;
  overflow: hidden;
  height: 100%;
  width: auto;
  margin: 20px 0;
  margin-left: 20px;
}
.showSort .choice span {
  display: inline-block;
  padding: 15px 20px;
  background: #eeeeee;
  color: #6a788c;
  font-size: 20px;
  /* line-height: 1.2; */
  line-height: normal;
}
.showSort .choice span.on {
  background: #eb0818;
  color: rgb(245, 233, 233);
}
</style>