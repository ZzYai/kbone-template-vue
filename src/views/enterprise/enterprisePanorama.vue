<template>
  <div class="enterprisePanorama">
    <div class="loading" v-if="loading">
      <Loading type="spinner" size="60"></Loading>
    </div>
    <iframe
      :src="data_url"
      frameborder="0"
      scrolling="auto"
      style="width: 100%; height: 100%"
      @load="onloadingFinish"
    ></iframe>
  </div>
</template>

<script>
import { Loading } from 'vant'
export default {
  components: {
    Loading
  },
  computed: {
  },
  data() {
    return {
      data_url: null,
      loading: true
    }
  },
  created() {
    let lindata = decodeURIComponent(this.$route.params.durl);
    // console.log(JSON.parse(lindata))
    this.data_url = JSON.parse(lindata);
  },
  mounted() {


  },
  methods: {
    onloadingFinish() {
      this.loading = false;
    }
  }
}
</script>

<style>
.enterprisePanorama {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  z-index: 1800;
}
.loading {
  width: 100%;
  text-align: center;
  padding-top: 150px;
  position: absolute;
  top: 150px;
}
</style>