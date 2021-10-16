<template>
  <div class="home">
    <div class="titleDom">
      <p>首页</p>
    </div>
    <div class="titleImg">
      <Swipe class="my-swipe" :autoplay="1500" indicator-color="white">
        <SwipeItem
          v-for="(item, index) in titleimg"
          :key="index"
          class="swipeItems"
          :class="'swipeItem' + index"
          :style="'background-image:url(' + item.image + ')'"
        >
          <!-- <img :src="item.image" alt="" /> -->
        </SwipeItem>
      </Swipe>
    </div>
    <div class="enterpriseInfo">
      <div class="infoDiv">
        <!-- <img src="../../assets/enterprisePopover/tempTest-brand.png" alt=""> -->

        <div class="content">
          <Skeleton :row="6" :loading="isshowContent" />
          {{ receive.introduction ? receive.introduction : "暂无简介。" }}
        </div>
      </div>
    </div>
    <!-- 企业图集 -->
    <div class="enterpriseImg">
      <p>企业图集</p>
      <!-- <filterBtn
        :buttonList1="imgButtonList1"
        :typeWhich="3"
        @imgbut1getdata="imgbut1getdata"
      /> -->
      <div class="imgList" :style="{gridTemplateColumns: haveImgList?'1fr':'1fr 1fr'}">
        <div
          class="imgItem"
          v-for="(item, index) in imgList"
          :key="index"
          @click="preview(index)"
        >
          <img :src="item" />
        </div>

        <div class="EmptyVant" v-if="haveImgList">
          <Empty class="Emptyseat" image="search" description="没有更多啦" />
        </div>
        <div class="loadingZhan" v-if="imgLoading">
          <Loading type="spinner" size="50" />
        </div>
      </div>
    </div>
    <!-- 企业新闻 -->
    <div class="enterpriseNew">
      <p>企业新闻</p>
      <!-- <filterBtn
        :buttonList2="imgButtonList2"
        :typeWhich="1"
        @imgbut1getdata="imgbut1getdata"
      /> -->
      <div class="newList">
        <div
          class="newItem"
          v-for="(item, index) in newList"
          :key="index"
          @click="goDetails(item)"
        >
          <div class="topDiv">
            <img :src="item.image" />
          </div>
          <div class="bottomDiv">
            <p class="pshang">{{ item.title }}</p>
            <p class="inc">{{ item.desc }}</p>
            <p class="pxia">{{ item.created_at }}</p>
          </div>
        </div>
        <div class="EmptyVant" v-if="haveNewList">
          <Empty class="Emptyseat" image="search" description="没有更多啦" />
        </div>
        <div class="loadingZhan" v-if="newLoading">
          <Loading type="spinner" size="50" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filterBtn from "../../components/filterBtn"
import { Swipe, SwipeItem, Empty, ImagePreview, Toast, Skeleton, Loading } from 'vant';
export default {
  components: {
    filterBtn,
    Swipe,
    SwipeItem,
    Empty,
    Toast,
    Skeleton,
    Loading,
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  // props: ['Data'],
  data() {
    return {
      imgLoading: true,
      newLoading: true,
      haveImgList: false,
      haveNewList: false,
      isshowContent: true,      //简介空骨架
      enterpriseId: null,
      titleimg: [

      ],
      titleimgindex: 1,
      imgList: [    //图库
      ],
      imgButtonList1: [
      ],
      imgButtonList2: [

      ],
      newList: [
      ],
      receive: []
    }
  },
  created() {
    // console.log("这是首页", this.$route.query.id)
    this.enterpriseId = this.$route.query.id;
    this.getData();
    this.imgbut1getdata("", 1);
  },
  mounted() {
  },
  methods: {
    imgbut1getdata(val, typeval) {
      var data = {
        type: typeval,
        pageSize: 6,
        page: 1,
        tag: val,   //之后改成val对应的是tagid
        id: this.enterpriseId
      }
      this.$api.enterprise.getInfoTag(data).then(resp => {
        if (resp) {
          if (typeval == 1) {
            this.newLoading = false;
          }
          if (resp) {
            let data = resp.data.data;
            if (typeval == 1) {
              if (data && data.length != 0) {
                this.newList = data;
                this.haveNewList = false;
              } else {
                this.newList = [];
                this.haveNewList = true;
              }
            }
          }
        }

      }).catch(err => {
        console.log(err)
      })
      //废除  通过标签获取对应数据
      {
        //   this.$api.enterprise.getInfoTag(data).then((resp) => {
        //   // console.log(resp)
        //   if (resp) {
        //     let data = resp.data.data || resp.data;
        //     if (typeval == 1) {   //新闻
        //       this.newList = data;
        //       if (data.length == 0) {
        //         this.isnullNew = true;
        //       } else {
        //         this.isnullNew = false;
        //       }
        //     } else if (typeval == 3) {
        //       this.imgList = data;
        //       if (data.length == 0) {
        //         this.isnullImg = true;
        //       } else {
        //         this.isnullImg = false;
        //       }
        //     }
        //   }
        // }).catch(err => {
        //   console.warn(err)
        //   Toast.fail({
        //     message: "服务错误"
        //   })
        //   this.loading = false;
        //   this.finished = true;
        // })
      }

    },
    getData() {     //初始获取数据      废除   
      let data = {
        id: this.enterpriseId
      }
      this.$api.enterprise.getEnterpriseInfo(data).then((resp) => {
        this.isshowContent = false;
        if (resp) {
          this.receive = resp.data;
          this.titleimg = [];     //轮播图
          this.titleimg = this.receive.banner;
          this.imgLoading = false;
          if (resp.data.gallery.length) {
            this.haveImgList = false;
            this.imgList = resp.data.gallery.splice(0, 6);
          } else {
            this.haveImgList = true;
          }
        }
      })
      return
      //废除获取表情功能
      //保留data位置
      // //   图库
      // this.$api.enterprise.getClassify({ enterprise: this.enterpriseId, type: 3 }).then((resp) => {
      //   if (resp) {
      //     let arrdata = resp.data;
      //     arrdata.unshift({
      //       id: 0,
      //       name: "全部"
      //     })
      //     this.imgButtonList1 = arrdata;
      //   }
      // })


      // //新闻
      // this.$api.enterprise.getClassify({ enterprise: this.enterpriseId, type: 1 }).then((resp) => {
      //   if (resp) {
      //     let arrData = resp.data;
      //     arrData.unshift({
      //       id: 0,
      //       name: "全部"
      //     })
      //     this.imgButtonList2 = arrData;
      //   }
      // })

    },
    preview(i) {     //图片预览
      let _this = this;
      ImagePreview({
        images: _this.imgList,
        startPosition: i
      });
    },
    goDetails(item) {    //新闻前往详情
      var stra = JSON.stringify(item);
      this.$router.push({
        path: '/enterprise/severDetail',
        name: 'severDetail',
        params: {
          data: encodeURIComponent(stra),
          id: this.enterpriseId
        }
      });

    }

  }

}
/**
 * 8/26 10.48
 * 首页改变     去除标签  默认显示前6条，重置基本废除
 * 保留基本获取响应数据     去除获取标签
 *
 */
</script>

<style scoped>
.home {
  width: 100%;
  height: auto;
  overflow: hidden;
  padding-top: 100px;
}
.titleDom {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 90px;
  box-shadow: 1px 10px 10px rgba(100, 101, 102, 0.12);
  width: 100%;
  background: #fff;
  z-index: 1001;
}
.titleDom p {
  width: 100%;
  height: 90px;
  box-shadow: 1px 10px 10px rgba(100, 101, 102, 0.12);
  text-align: center;
  line-height: 90px;
  font-size: 30px;
}
.titleImg {
  width: 100%;
  height: auto;
  position: relative;
  overflow: hidden;
  background-image: url("../../assets/load.gif");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 90px;
}

.titleImg .my-swipe {
  height: 100%;
  line-height: 313px;
  text-align: center;
}
.titleImg .my-swipe img {
  height: 100%;
  height: 100%;
}
/* .titleImg .my-swipe .van-swipe-item {
} */

.titleImg img {
  width: 100%;
}
.swipeItems {
  font-size: 0;
  height: 300px;
  width: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 900px 100%;
}
.enterpriseInfo {
  width: 100%;
  /* height: 445px; */
  background: #fbfbfb;
}
.infoDiv {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-sizing: border-box;
  /* margin-top: 80px; */
}
.infoDiv img {
  width: 266px;
  height: 60px;
}
.infoDiv > div.content {
  /* margin-left: 60px; */
  /* text-indent: 2em; */
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  line-height: 40px;
  font-size: 28px;
  width: 100%;
}

.enterpriseImg > p,
.enterpriseNew > p {
  font-size: 32px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #6d7587;
  text-align: center;
  margin: 57px auto 31px;
}
.imgList {
  width: 100%;
  /* display: flex;
  flex-wrap: wrap;
  justify-content: space-between; */
  display: grid;
  grid-template-columns: 1fr 1fr;
  -ms-grid-template-columns: 1fr 1fr;
  grid-gap:30px;
  grid-template-rows: auto;
  box-sizing: border-box;
  padding: 0 50px;
}

.imgItem {
  /* width: 300px; */
  /* max-width: 300px; */
  width: auto;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f6f6;
  border-radius: 5px;
  box-shadow: 0 0 6px 6px #ededed;
  box-sizing: border-box;
  padding: 10px 0;
}
.imgItem img,
.topDiv img {
  width: auto;
  height: auto;
  max-height: 100%;
  max-width: 100%;
}
.newList {
  width: 100%;
  margin-bottom: 23px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  min-height: 430px;
  padding: 0 50px;
  box-sizing: border-box;
}
.EmptyVant {
  margin: 0 auto;
  height: 300px;
  width: 300px;
  overflow: hidden;
  margin-top: 70px;
}
.Emptyseat {
  margin: 0 auto;
  box-sizing: border-box;
  transform: scale(1.5);
}
.loadingZhan {
  /* 加载中 */
  width: 100%;
  text-align: center;
  min-height: 300px;
  padding-top: 60px;
  box-sizing: border-box;
}
.newItem {
  width: 100%;
  height: 140px;
  max-height: 155px;
  margin-bottom: 25px;
  margin-top: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px 10px #fafafa;
  box-shadow: 0 0 6px 6px #ededed;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.topDiv {
  width: 180px;
  max-width: 180px;
  height: 140px;
  max-height: 100px;
  display: flex;
  justify-content: center;
  align-content: center;
  background: #f6f6f6;
  margin-right: 20px;
}
.bottomDiv {
  width: 64%;
  height: auto;
  height: 100px;
  box-sizing: border-box;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #6d7587;
  margin-left: 15px;
}
.bottomDiv p {
  margin-top: 5px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 24px;
  line-height: 1;
  padding-top: 5px;
}
</style>
<style>
.van-skeleton__row,
.van-skeleton__title {
  height: 30px;
}
</style>