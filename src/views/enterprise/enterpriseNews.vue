<template>
  <div class="enterpriseNews">
    <!-- <p>产品服务库</p> -->
    <DropdownMenu :class="'DropdownTop'">
      <DropdownItem
        v-model="value1"
        :options="option1"
        @change="
          newList = [];
          finished = false;
        "
      />
      <p class="titleTop">企业新闻</p>
    </DropdownMenu>
    <!-- <filterBtn :buttonList="imgButtonList"/> -->
    <List
      class="newList"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div
        class="newItem"
        v-for="(item, index) in newList"
        :key="index"
        @click="serveDetail(item.id, item)"
      >
        <div class="topDiv">
          <img :src="item.image?item.image:errImg"  />
        </div>
        <div class="bottomDiv">
          <p class="Ptop">{{ item.title }}</p>
          <p>{{ item.desc }}</p>
          <p class="Pbot">{{ item.created_at }}</p>
        </div>
      </div>
    </List>
    <!-- <div class="pageComponent">
             <page/>
        </div>  -->
  </div>
</template>

<script>
import { List } from 'vant';
// import filterBtn from "../../components/filterBtn"
import page from "../../components/page"
import { DropdownMenu, DropdownItem } from 'vant';
export default {
  components: {
    // filterBtn,
    page,
    DropdownMenu,
    DropdownItem,
    List
  },
  data() {
    return {
      errImg: require('../../assets/errImg.png'),
      loading: false,
      finished: false,
      topage: 1,     //翻页    
      value1: 0,
      sendValue: 0,
      option1: [
      ],
      newList: [
      ],
    }
  },
  watch: {
    value1(val) {
      let _this = this;
      this.option1.forEach(item => {
        if (item.value == val) {
          _this.sendValue = item.text
          return
        }
      })
      if (val == "全部" || val == 0) {
        _this.sendValue = 0
      }
      this.newList = [];
      this.topage = 1;
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    // console.log("产品服务query", this.$route.query.id);
  },
  methods: {
    changeVant(val) {
      let _this = this;
      var data = {
        type: 1,
        pageSize: 12,
        page: this.topage++,
        tag: val,   //之后改成val对应的是tagid
        id: this.$route.query.id
      }
      this.$api.enterprise.getInfoTag(data).then((resp) => {
        if (resp) {
          if (resp.data.data.length != 0) {
            resp.data.data.forEach(item => {
              _this.newList.push(item);
            })
            this.finished = false;
            this.loading = false;
          } else {
            this.loading = false;
            this.finished = true;
          }
        }
      })

    },
    getData() {

      //获取全部标签
      this.$api.enterprise.getClassify({ enterprise: this.$route.query.id,type: 1 }).then((resp) => {
        if (resp) {
          this.option1 = resp.data.map((item) => {
            return {
              text: item.name,
              value: item.id
            }
          })
          this.option1.unshift({
            text: '全部标签',
            value: 0
          });
        }

      })
    },
    onLoad() {
      setTimeout(() => {
        this.changeVant(this.sendValue);
      }, 1000);
    },
    serveDetail(id, item) {
      var stra = JSON.stringify(item);
      this.$router.push({
        path: '/enterprise/severDetail',
        name: 'severDetail',
        params: {
          data: encodeURIComponent(stra),
          id: this.$route.query.id
        }
      });
      // this.$store.commit("enterprise/setenterpriseNewsData", item)
    }
  }

}
</script>

<style scoped>
.enterpriseNews{
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding-top: 90px;
  box-sizing: border-box;
}
.enterpriseNews > p {
  font-size: 26px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #6d7587;
  text-align: center;
  margin: 57px auto 31px;
}
.imgItem img,
.topDiv img {
  width: auto;
  height: auto;
  max-height: 100%;
  max-width: 100%;
}
.newList {
  margin: 25px auto;
  height: 97%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding: 0 25px;
  overflow: hidden;
  overflow-y: auto;
}
.newItem {
  height: 180px;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 0 10px 10px #f0f0f0;
  cursor: pointer;
  margin: 15px 0;
  box-sizing: border-box;
  padding: 0 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
}
.imgList::after,
.newList::after {
  content: "";
  display: block;
  clear: both;
}

.topDiv {
  width: 230px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f6f6;
  box-sizing: border-box;
  padding: 15px 0;
  margin-right: 20px;
}
.bottomDiv {
  width: 60%;
  height: auto;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #6d7587;
}
.bottomDiv p {
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 8px;
  font-size: 24px;
  padding-top: 8px;
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
  transform: translate(-50%,-50%);
  font-size: 30px;
  z-index: 1001;
}
.DropdownTop .van-dropdown-menu__item{
  justify-content: flex-start;
  
}
.DropdownTop .van-dropdown-menu__item .van-dropdown-menu__title{
  margin-left: 40px;
  
}
.enterpriseNews .van-dropdown-menu__bar {
  height: 90px;
}
.enterpriseNews .van-ellipsis {
  font-size: 30px;
  line-height: 80px;
}
.enterpriseNews .van-cell {
  font-size: 30px;
  line-height: 100px;
  height: 100px;
}
.enterpriseNews .van-list__finished-text,
.enterpriseNews .van-list__loading {
  width: 700px;
  padding: 0;
  /* border:1px solid red; */
  margin-top: 20px;
  font-size: 24px;
}
.enterpriseNews .van-loading__text {
  font-size: 24px;
}
.enterpriseNews .van-dropdown-menu__title::after {
  border: 6px solid;
  border-color: transparent transparent #dcdee0 #dcdee0;
  right: -15px;
  margin-top: -7px;
}
.enterpriseNews .van-dropdown-menu__title--active::after {
  border-color: transparent transparent currentColor currentColor;
}
</style>