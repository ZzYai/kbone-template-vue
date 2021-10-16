<template>
  <div class="enterpriseImg">
    <!-- <p class="pOne">企业图集</p> -->
    <DropdownMenu :class="'DropdownTop'">
      <DropdownItem
        v-model="value1"
        :options="option1"
        @change="
          imgList = [];
          finished = false;
        "
      />
      <p class="titleTop">企业图集</p>
    </DropdownMenu>
    <!-- <filterBtn :buttonList="imgButtonList"/> -->
    <List
      class="imgList"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div
        class="imgItem"
        v-for="(item, index) in imgList"
        :key="index"
        @click="preview(item)"
      >
        <img
          :src="item.image ? item.image : errImg"
          :style="{ width: item.image ? 'auto' : '180px' }"
        />
        <div class="showbot">
          <div class="showneitop">
            <span>{{ item.tag }}</span>
            <p>{{ item.title }}</p>
          </div>
          <div class="showneibot">{{ item.desc }}</div>
        </div>
      </div>
    </List>
    <!-- <div class="pageComponent">
             <page/>
        </div> -->
  </div>
</template>

<script>
// import filterBtn from "../../components/filterBtn"
// import page from "../../components/page"
// import shade from "../../components/shade"
import { List, Toast } from 'vant';
import { ImagePreview } from 'vant';
import { DropdownMenu, DropdownItem } from 'vant';
export default {
  components: {
    // filterBtn,
    // page,
    List,
    DropdownMenu,
    DropdownItem,
    Toast,
    // shade
    [ImagePreview.Component.name]: ImagePreview.Component
  },
  data() {
    return {
      enterpriseId: null,
      loading: false,
      finished: false,
      topage: 1,     //翻页
      value1: 0,
      sendValue: 0,
      errImg: require('../../assets/errImg.png'),
      option1: [

      ],
      imgList: [

      ],
      tempImg: '',
      bigImgShow: false

    }
  },
  watch: {
    value1(val) {
      this.finished = false;
      this.loading = false;
      this.option1.forEach(item => {
        if (item.value == val) {
          this.sendValue = item.text;
          return
        }
      });
      if (val == "全部" || val == 0) {
        this.sendValue = 0;
      }
      this.topage = 1;
    }
  },
  created() {
    this.enterpriseId = this.$route.query.id;
    this.getData()
  },
  methods: {
    changeVant(val) {
      let _this = this;
      var data = {
        type: 3,
        pageSize: 10,
        page: this.topage++,
        tag: val,   //之后改成val对应的是tagid
        id: this.$route.query.id
      }
      this.$api.enterprise.getInfoTag(data).then((resp) => {
        // console.log(resp)
        if (resp) {
          let data = resp.data.data || resp.data;
          if (data.length != 0) {
            data.forEach(item => {
              _this.imgList.push(item);
            })
            this.finished = false;
            this.loading = false;
          } else {
            this.loading = false;
            this.finished = true;
          }
        }

      }).catch(err => {
        console.warn(err)
        Toast.fail({
          message: "服务错误"
        })
        this.loading = false;
        this.finished = true;
      })
    },
    getData() {
      this.$api.enterprise.getClassify({ enterprise: this.enterpriseId, type: 3 }).then((resp) => {
        //获取对应标签
        // console.log(resp)
        if (resp) {
          resp.data.forEach((item, index) => {
            this.option1[index] = {
              text: item.name,
              value: item.id
            }
          })
          this.option1.unshift({
            text: '全部标签',
            value: 0
          })
        }

      })
    },
    onLoad() {
      setTimeout(() => {
        // // 加载状态结束
        this.changeVant(this.sendValue);
      }, 1000);
    },
    preview(item) {
      //更改为图集点击打开
      this.$router.push({
        path: 'enterpriseShowImg',
        name: 'enterpriseShowImg',
        query: {
          id: this.enterpriseId,
          item: JSON.stringify(item)
        }
      })


      // ImagePreview({
      //   images: this.imgList.map((item) => {
      //     return item.image
      //   }),
      //   startPosition: i
      // });
    },
    closeShade(ev) {
      if (!this.$refs.bigImgRef.contains(ev.target)) {
        this.bigImgShow = false
      }
    }
  }
}
</script>
<style >
.DropdownTop .van-dropdown-menu__item {
  justify-content: flex-start;
}
.DropdownTop .van-dropdown-menu__item .van-dropdown-menu__title {
  margin-left: 40px;
}
</style>
<style scoped>
.enterpriseImg {
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 90px;
}
.pOne {
  text-align: center;
  font-size: 26px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #6d7587;
  margin: 72px auto 31px;
}
.imgList {
  margin: 25px auto;
  /* height: 1100px; */
  height: 97%;
  box-sizing: border-box;
  /* display: grid;
  grid-template-rows: repeat(5, 180px);
  grid-template-columns: repeat(2, 340px);
  grid-row-gap: 10px;
  grid-column-gap: 10px; */
  /* margin:20px auto 0; */
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  box-sizing: border-box;
  padding: 0 30px;
}
.imgItem {
  /* width: 340px; */
  /* min-width: 42%; */
  /* max-width: 42%; */
  width: 100%;
  height: 360px;
  display: flex;
  margin: 15px 0;
  align-items: center;
  justify-content: center;
  /* background: #f6f6f6; */
  /* background: #f32a37; */
  background: rgb(9, 10, 12);
  border-radius: 5px;
  cursor: pointer;
  position: relative;
}
.imgItem .showbot {
  position: absolute;
  bottom: 15px;
  left: 0;
  z-index: 100;
  width: 100%;
  text-align: left;
  box-sizing: border-box;
}
/* .imgItem .showbot .showneitop{
} */
.imgItem .showbot .showneibot {
  box-sizing: border-box;
  padding: 0 20px;
  color: #fff;
  font-size: 26px;
  margin-top: 10px;
  line-height: 1.3;

  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.imgItem .showbot span {
  display: inline-block;
  width: 80px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background: #f32a37;
  color: #fff;
  border-radius: 5px;
  margin: 0 20px;
  font-size: 22px;
  vertical-align: middle;
}
.imgItem .showbot p {
  display: inline-block;
  color: #fff;
  font-size: 30px;
  height: 100%;
  height: 40px;
  line-height: 40px;
  vertical-align: middle;
  /* border: 1px solid red; */
  margin: 0;
  width: 76%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.imgList::after {
  content: "";
  display: block;
  clear: both;
}
.imgItem img {
  width: auto;
  height: auto;
  max-height: 100%;
  max-width: 100%;
}
.pageComponent {
  margin: 20px auto 20px;
}
</style>
<style >
.DropdownTop {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  width: 100%;
  z-index: 1800;
}
.DropdownTop .titleTop {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  z-index: 1001;
}
.enterpriseImg .van-dropdown-menu__bar {
  height: 90px;
  /* position: fixed; */
}
.enterpriseImg .van-ellipsis {
  font-size: 30px;
  line-height: 80px;
}
.enterpriseImg .van-cell {
  font-size: 30px;
  line-height: 100px;
  height: 100px;
}
.enterpriseImg .van-list__finished-text,
.enterpriseImg .van-list__loading {
  width: 700px;
  padding: 0;
  margin-top: 20px;
  /* border:1px solid red; */
  font-size: 24px;
}
.enterpriseImg .van-loading__text {
  font-size: 24px;
}
.enterpriseImg .van-dropdown-menu__title::after {
  border: 6px solid;
  border-color: transparent transparent #dcdee0 #dcdee0;
  right: -15px;
  margin-top: -7px;
}
.enterpriseImg .van-dropdown-menu__title--active::after {
  border-color: transparent transparent currentColor currentColor;
}
</style>