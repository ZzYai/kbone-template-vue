<template>
  <!-- 历史记录 -->
  <div class="browsingHistorygen">
    <div class="browsingHistorygenDIV">
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
        <button class="redBtn" @click="goEnterprise(item.userid)">官网</button>
        <button class="deleteBtn" @click="handleDelete(index)">删除</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
export default {
  components: {
    Toast
  },
  computed: {

  },
  data() {
    return {
      loading: false,
      finished: false,
      BrowseRecordsobj: [],
      enterpriseList: [
      ],
    }
  },
  methods: {
    handleDelete(i) {     //删除
      this.BrowseRecordsobj.splice(i, 1);
      localStorage.setItem('BrowseRecords', JSON.stringify(this.BrowseRecordsobj));
    },
    goEnterprise(id) {        //前往官网
      this.$router.push({
        path: 'enterprise/enterpriseHome',
        name: 'enterpriseHome',
        query: {
          id: id
        }
      })
    },
    showHistories() {      //查看历史记录
      this.BrowseRecordsobj = JSON.parse(localStorage.getItem('BrowseRecords'));
      this.enterpriseList = this.BrowseRecordsobj;
      // console.log(this.BrowseRecordsobj)

    },

  },
  mounted() {

  }

}
</script>

<style scoped>
.browsingHistorygen {
  width: 100%;
  height: 900px;
  overflow: hidden;
  background: #ffffff;
  padding: 20px;
  box-sizing: border-box;
}
.browsingHistorygenDIV{
  height: 100%;
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
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
  white-space: nowrap;
  line-height: normal;
}
</style>