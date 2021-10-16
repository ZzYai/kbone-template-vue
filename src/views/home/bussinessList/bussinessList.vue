<template>
  <div class="bussinessPopover">
    <!-- <div class="btns" id="titleHolder">
      <button
        class="btn"
        :class="{ btnActive: btnActive == '全部' }"
        @click="changeEnterprise({ name: '全部' })"
      >
        全部
      </button>
      <button
        v-for="(item, index) in searchBtn"
        :key="index"
        class="btn"
        :class="{ btnActive: btnActive == item.name }"
        @click="changeEnterprise(item)"
      >
        {{ item.name }}
      </button>
    </div> -->
    <div class="btnsHolder" :style="{ height: titleHeight + 20 + 'px' }"></div>
    <List
      class="bussinessList"
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
        <div class="titleDIV">
          <span>{{ item.enterprise }}</span>
        </div>
        <p class="pTwo">
          <span>共</span>
          <span class="fcRed">{{ item.count }}</span>
          <span>个商机</span>
          <span class="fcur" @click="goenterserve(item)">(查看)</span>
        </p>
      </div>
    </List>
  </div>
</template>

<script>
import { List } from 'vant';
export default {
  components: {
    List
  },
  data() {
    return {
      loading: false,
      finished: false,
      topage: 1,     //翻页
      titleHeight: 0,
      searchBtn: [
      ],
      enterpriseList: [
      ],
      btnActive: '全部'
    }
  },
  mounted() {
    // this.getHeight();
  },
  created() {
    // this.getData()
  },
  methods: {
    goenterserve(val) {
      //查看按钮跳转到服务
      this.$router.push({
        path: 'enterprise/enterpriseServe',
        name: 'enterpriseServe',
        query: {
          id: val.userid    //后期修改数据 改为val
        }
      })
    },
    // 获取调试
    getHeight() {
      // let a = document.getElementById("titleHolder").offsetHeight
      // this.titleHeight = a
    },
    // 筛选企业
    changeEnterprise(val) {
      this.btnActive = val.name
    },
    onLoad() {
      // 异步更新数据
      let _this = this;
      let data = {
        pageSize: 15,
        page: this.topage++
      }
      this.$api.enterprise.getopportunities(data).then((gdata) => {
        if (gdata) {
          let data = gdata.data.data;
          if (data.length == 0) {
            _this.loading = true;
            _this.finished = true;
            return
          }
          data.forEach((item, index) => {
            _this.enterpriseList.push(item)
            // _this.enterpriseList[index] = item;
          });
          _this.loading = false;
        }
      })

    },
    getData() {
      //获取对应标签
      this.$api.enterprise.getTags().then((gdata) => {
        if (gdata) {
          gdata.data.forEach((item, index) => {
            this.searchBtn[index] = item;
          });
        }

      })
    }

  }

}
</script>

<style scoped>
.bussinessPopover {
  width: 100%;
  height: 100%;
  background: #ffffff;
}
.btns {
  /* margin:20px; */
  /* border:1px solid red; */
  position: fixed;
  background: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #eeeeee;
  width: 100%;
}
.btns .btn {
  /* width: 70px; */
  padding: 5px 10px;

  /* height: 35px; */
  margin-bottom: 10px;
  margin-right: 10px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6a788c;
  background: #f9f9f9;
  border-radius: 5px;
  border: 1px solid #f2f2f2;
  font-size: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6a788c;
  /* line-height: 35px; */
}
.btns .btnActive {
  background: #eb0818;
  color: #ffffff;
}
.bussinessList {
  width: 100%;
  /* height: 80%; */
  height: 90%;
  overflow: hidden;
  overflow-y: scroll;
  box-sizing: border-box;
  margin-bottom: 20px;
  /* border:1px solid red; */
  padding: 0 20px 50px;
}
.enterpriseItem {
  display: flex;
  width: 100%;
  height: 80px;
  align-content: center;
  line-height: 80px;
  align-items: center;
  margin-bottom: 20px;
  justify-content: space-between;
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
.enterpriseItem span {
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6d7587;
}
.enterpriseItem .titleDIV {
  width: 45%;
  height: 100%;
  line-height: 80px;
  vertical-align: middle;
  text-align: left;
}
.enterpriseItem .titleDIV span {
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6d7587;
  display: inline-block;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 80px;
  white-space: nowrap;
}
.enterpriseItem .pTwo {
  width: 30%;
  text-align: center;
  white-space: nowrap;
}
.enterpriseItem .pTwo .fcRed,
.enterpriseItem .pTwo .fcur {
  color: red;
}
</style>