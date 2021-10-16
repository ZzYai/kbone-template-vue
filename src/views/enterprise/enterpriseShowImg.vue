<template>
  <div class="enterpriseShowImg">
    <div class="titledom">
      <span @click="goback"> <i>&lt;</i> 返回 </span>
      <p>{{ item.title }}</p>
    </div>
    <div class="desc">
      {{
        item.desc
      }}
    </div>
    <div class="showimg">
      <div
        class="showitem"
        v-for="(item, index) in imglist"
        :key="index"
        @click="preview(index)"
      >
        <img :src="item" />
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';
export default {
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component
  },
  data() {
    return {
      item: {},
      imglist: [],
    }
  },
  created() {
    let item = JSON.parse(this.$route.query.item)
    this.item = item;
    this.imglist = item.content;
    // console.log(item)
  },
  methods: {
    goback() {     //返回按钮
    //   window.history.forward(1)
      this.$router.go(-1);

    },
    preview(i) {
      ImagePreview({
        images: this.imglist,
        startPosition: i
      });
    }
  }
}
</script>

<style scoped>
.enterpriseShowImg {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 110px;
  padding-bottom: 20px;
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
  font-size: 28px;
  color: rgb(24, 48, 80);
  height: 40px;
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
.desc {
  min-height: 30px;
  height: auto;
  padding: 15px;
  background: #fff;
  width: 92%;
  box-shadow: 1px 10px 10px rgba(100, 101, 102, 0.12);
  margin: 10px auto;
  letter-spacing: 2px;
  line-height: 1.2;
  font-size: 24px;
  text-indent: 2em;
}
.showimg {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 0 20px;
}
.showimg .showitem {
  width: 100%;
  height: 300px;
  text-align: center;
  background: rgb(9, 10, 12);
  box-sizing: border-box;
  margin: 15px 0;
}
.showimg .showitem img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>