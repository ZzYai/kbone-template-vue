<template>
  <div class="enterprisePPT">
    <div class="titledom">
      <p>企业介绍PPT</p>
    </div>
    <div class="content-pdf">
      <pdf
        :class="'pdfdom'"
        :src="srcobj"
        :page="index + 1"
        v-for="(item, index) in numPages"
        :key="index"
      ></pdf>
    </div>
    <Loading
      :class="'loading'"
      type="spinner"
      size="60px"
      v-if="isload"
    ></Loading>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import { Loading } from 'vant'
export default {
  components: {
    Loading,
    pdf
  },
  data() {
    return {
      isload: false,
      imglist: null,
      srcobj: null,
      numPages: 0,    //页面总数
      timer: null
    }
  },
  created() {
    this.godata()
  },
  methods: {
    godata() {
      if (this.$route.query.pdfval != undefined && this.$route.query.pdfval != 'undefined') {
        var lindata = decodeURIComponent(this.$route.query.pdfval)
        this.imglist = JSON.parse(lindata);
        this.complete()

      } else {
        console.err(this.$route.query.pdfval)
      }

    },
    complete() {   //加载完成
      this.srcobj = pdf.createLoadingTask(this.imglist);
      this.srcobj.promise.then(pdf => {
        this.numPages = pdf.numPages;
        // this.load()
      });
    },
    load() {
      let dom = document.querySelectorAll('pdfdom');
      if (dom.length > 2) {
        if (!this.timer) {
          clearTimeout(timer)
        }
        setTimeout(() => {
          this.isload = false
        }, 2000)
      } else {
        this.timer = setTimeout(this.load, 2000);
      }
    }
  }
}
</script>
<style>
.pdfdom {
  /* border: 1px solid red; */
  width: 100%;
}
.content-pdf > span {
  width: 100%;
  background-image: url("../../assets/load.gif");
  background-position: center center;
  background-size: 100px 100px;
  background-repeat: no-repeat;
}
</style>
<style scoped>
.enterprisePPT {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: wrap;
  padding-bottom: 110px;
  padding-top: 110px;
}
.titledom{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 110px;
  width: 100%;
  background: #fff;
  z-index: 1001;
}
.titledom p{
  width: 100%;
  height: 90px;
  box-shadow: 1px 10px 10px rgba(100, 101, 102, 0.12);
  text-align: center;
  line-height: 90px;
  font-size: 30px;
}
.content-pdf {
  width: 100%;
  height: 100%;
}
.loading {
  margin-top: 20px;
}
.enterprisePPT img {
  width: 100%;
}
.pdfdom {
  width: 100%;
  background-image: url("../../assets/load.gif");
  background-position: center center;
  background-size: 100px 100px;
  background-repeat: no-repeat;
}
</style>