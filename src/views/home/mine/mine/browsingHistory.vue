<template>
  <!-- 历史记录 -->
  <div class="browsingHistorygen">
    <div class="browseHistoryDiv">
      <List
        class="browseHistory"
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
            <img :src="item.logo" />
          </div>
          <div class="showtitle">
            <span>{{ item.enterprise }}</span>
            <p>{{ item.created_at }}</p>
          </div>
          <button class="redBtn" @click="goEnterprise(item.userid)">
            官网
          </button>
          <button class="deleteBtn" @click="handleDelete(item.id)">删除</button>
        </div>
      </List>
    </div>
  </div>
</template>

<script>
import { List, Toast } from 'vant';
export default {
  components: {
    List,
    Toast
  },
  computed: {

  },
  data() {
    return {
      loading: false,
      finished: false,
      topage: 1,       //翻页
      enterpriseList: [
      ],
    }
  },
  methods: {
    handleDelete(id) {     //删除
      let toastDelete = Toast.loading({
        duration: 0,
        message: '删除中...',
        forbidClick: true,
      });
      let token = localStorage.getItem('token');
      if (token) {
        this.$api.user.getDeleteHistories({ id: id }).then(resp => {
          // console.log(resp);
          toastDelete.clear();
          if (resp) {
            Toast.success({
              className: "successToast",
              message: resp.message,
              duration: 2000,
              forbidClick: false
            });
          }
          //重新获取
          this.topage = 1;
          this.enterpriseList.splice(0)
          this.showHistories()
        })
      } else {
        toastDelete.clear();
        Toast.fail({
          message: "请重新登录",
          duration: 2000,
          forbidClick: false,
          className: "failToast"
        });
        this.$store.commit("user/setUserInfo", 0);
        this.$store.commit("user/setLoginStatus", 1)
      }
    },
    goEnterprise(id) {        //前往官网
      console.log(id);
      this.$router.push({
        path: 'enterprise/enterpriseHome',
        name: 'enterpriseHome',
        query: {
          id: id   //后期修改数据 改为val
        }
      })
    },
    showHistories() {      //查看历史记录
      this.$api.user.getHistories({
        pageSize: 10,
        page: this.topage++
      }).then(resp => {
        // console.log(resp)
        if (resp) {
          let data = resp.data.data;
          if (data.length == 0) {
            this.loading = true;
            this.finished = true;
            return
          }
          data.forEach((item, index) => {
            this.enterpriseList.push(item)
          });
          this.loading = false;
        } else {
          this.finished = true;
          this.$store.commit("user/setUserInfo", 0);
          this.$store.commit("user/setLoginStatus", 1)
        }
      })
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        this.showHistories();
        // 加载状态结束
        // 数据全部加载完成
      }, 1000);
    },
  },
  mounted() {
    // this.showHistories()
    // console.log(this.$store.getters["user/getUserData"]);
  }

}
</script>

<style scoped>
.browsingHistorygen {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.browseHistoryDiv{
  width: 100%;
  height: 100%;
}
.browseHistory {
  width: 100%;
  height: 900px;
  overflow: auto;
  background: #ffffff;
  /* padding: 20px; */
  box-sizing: border-box;
}
.enterpriseItem {
  display: flex;
  width: 100%;
  height: 80px;
  align-items: center;
  margin-bottom: 20px;
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
.enterpriseItem .showtitle p {
  margin-top: 10px;
  font-size: 24px;
}
.enterpriseItem .showtitle span {
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6d7587;
}
.enterpriseItem .redBtn {
  margin-left: auto;
  /* width:200px; */
  width: 70px;
  height: 40px;
  font-size: 22px;
  white-space: nowrap;
  line-height: normal;
  font-weight: 500;
}
.enterpriseItem .deleteBtn {
  outline: none;
  background: #eb0818;
  border: none;
  color: #fff;
  width: 70px;
  height: 40px;
  margin: 0 15px;
  border-radius: 5px;
  font-size: 22px;
  font-weight: 500;
  white-space: nowrap;
  line-height: normal;
}
</style>