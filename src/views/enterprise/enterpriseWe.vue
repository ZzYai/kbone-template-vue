<template>
  <div class="enterpriseWe">
    <div class="titledom">
      <p>联系我们</p>
    </div>
    <!-- 地图 -->
    <div id="container"></div>
    <div class="showInfo">
      <h6>{{ mydata.enterprise }}</h6>
      <div class="enterpriseInfo">
        <div class="showLogo">
          <img :src="mydata.logo" />
          <!-- <p :style="'background-image:url(' + mydata.logo + ')'"></p> -->
        </div>
        <div class="ingo">
          <!-- {{ mydata.address }} -->
          <div><span>联系人:</span>&nbsp;&nbsp; {{ mydata.name }} &nbsp;{{ mydata.phone }}</div>
          <div><span>总机:</span> &nbsp;&nbsp;{{ mydata.landline }}</div>
          <div>
            <span>地址:</span> &nbsp;
            <p>{{ mydata.address }}</p>
          </div>
        </div>
        <!-- <div class="infobot">
          <div class="infoLeft">
            <p><span>区域:</span> {{ mydata.region }}</p>
            <p><span>街道:</span> {{ mydata.street }}</p>
            <p><span>社区:</span> {{ mydata.community }}</p>
          </div>
          <div class="infoRight">
            <p><span>法定代表人:</span> {{ mydata.legal }}</p>
            <p><span>分机: &nbsp;&nbsp; </span> {{ mydata.extension }}</p>
          </div>
        </div> -->
      </div>
      <!-- <p class="introduction">{{ mydata.introduction }}</p> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mydata: null
    }
  },
  created() {
    var linda = decodeURIComponent(this.$route.params.data);
    this.mydata = JSON.parse(linda);
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(this.mydata)
      this.getMapInfo()
    })

  },
  methods: {
    getMapInfo() {
      let pointMap1 = this.$store.getters['enterprise/getPositionMapPoint'];
      let pointMap2 = {
        lat: this.mydata.latitude,
        lng: this.mydata.longitude,
        logo: this.mydata.logo,
        point: this.mydata.point,
      }
      let pointMap = {}
      if (pointMap1.lat && pointMap1.lng) {
        pointMap = pointMap1
      } else if (pointMap2.lat && pointMap2.lng) {
        pointMap = pointMap2
      } else {
        this.$route.push({
          path: '/home'
        })
        return
      }

      let name = '金州区'
      var map = new BMap.Map("container");
      let point = new BMap.Point(pointMap.lng, pointMap.lat)
      // let point = new BMap.Point(39.060119,121.875750)
      map.centerAndZoom(point, 12);//设置中心点和显示级别。中国。
      map.enableScrollWheelZoom(true) //开启鼠标滚轮缩放 
      // 开启缩放 平移控件
      //设置缩放按钮位置及类型
      var ove = { anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM }
      //添加缩放按钮
      map.addControl(new BMap.NavigationControl(ove));
      var geolocation = new BMap.Geolocation();

      // 获取行政区域 边框
      let bdary = new BMap.Boundary();
      map.clearOverlays();
      bdary.get(name, function (rs) {
        if (rs) {
          var EN_JW = "180, 90;";         //东北角
          var NW_JW = "-180,  90;";       //西北角
          var WS_JW = "-180, -90;";       //西南角
          var SE_JW = "180, -90;";        //东南角
          //4.添加环形遮罩层
          var ply1 = new BMap.Polygon(rs.boundaries[0] + SE_JW + SE_JW + WS_JW + NW_JW + EN_JW + SE_JW, { strokeColor: "none", fillColor: "rgb(246,246,246)", fillOpacity: 1, strokeOpacity: 0.5 }); //建立多边形覆盖物
          map.addOverlay(ply1);
          // 获取到边界的点数组后，添加一个多边形覆盖物。boundaries boundariesstrokeColor: "#00000001"
          let count = rs.boundaries.length;
          for (let i = 0; i < count; i++) {
            let ply = new BMap.Polygon(rs.boundaries[i], {
              strokeWeight: 5, strokeColor: "#e02020", fillColor: ''
            })
            map.addOverlay(ply);  //添加覆盖物  
          }
        }
      })
      // console.log(pointMap)
      let marker;
      if (pointMap.point) {
        var myIcon = new BMap.Icon(pointMap.point, new BMap.Size(24, 24));
        myIcon.imageSize = new BMap.Size(24, 24)
        myIcon.anchor = new BMap.Size(12, 24)
        marker = new BMap.Marker(point, {
          icon: myIcon
        })
        map.addOverlay(marker);
      } else {
        marker = new BMap.Marker(point);
        map.addOverlay(marker);
      }

      var opts = {
        width: 0,
        height: 0,
        enableCloseOnClick: false
      };
      let html = `
        <div style="width: 250px;height: 90px;overflow:hidden">
          <div style="width: 70%;height: 100%;float: left;">
            <h6 style="font-size: 14px;font-weight: 500;white-space: nowrap;">${this.mydata.enterprise} </h6>
            <p style="font-size: 12px;margin-top: 5px; text-indent: 2em;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 5;overflow: hidden;line-height: 1.2;">${(this.mydata.introduction)}</p>
          </div>
          <div style="overflow: hidden;padding-top: 15px;">
            <img style="width: 100%;height: 100%;" src="${pointMap.logo}" alt="">
          </div>
        </div>`
      var infoWindow = new BMap.InfoWindow(html, opts);
      // map.openInfoWindow(infoWindow, point); // 开启信息窗口
      // 点标记添加点击事件
      marker.addEventListener('click', function () {
        return
        map.openInfoWindow(infoWindow, point); // 开启信息窗口
      });

    }
  }
}
</script>

<style scoped>
.enterpriseWe {
  width: 100%;
  height: 100%;
  padding-top: 90px;
  box-sizing: border-box;
  overflow: hidden;
  overflow-y:auto ;
}
.titledom {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 90px;
  width: 100%;
  background: #fff;
  z-index: 1001;
}
.titledom p {
  width: 100%;
  height: 90px;
  box-shadow: 1px 10px 10px rgba(100, 101, 102, 0.12);
  text-align: center;
  line-height: 90px;
  font-size: 30px;
}
#container {
  width: 100%;
  height: 500px;
}
.showInfo {
  height: auto;
  width: 100%;
  margin-top: 20px;
}
.showInfo > h6 {
  width: 100%;
  text-align: center;
  font-size: 30px;
  font-weight: 500;
  padding: 10px 0;
}
.enterpriseInfo {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 20px auto;
  margin-bottom: 25px;
  /* border-bottom: 1px solid #ccc; */
  /* border-top: 1px solid #ccc; */
  width: 90%;
}
.showLogo {
  /* width: 150px; */
  width: 100%;
  /* height: 150px; */
  height: auto;
  /* margin-right: 50px; */
  /* margin-left: 45px; */
  /* vertical-align: middle; */
  /* line-height: 150px; */
  border-bottom: 1px solid #ccc;
  border-top: 1px solid #ccc;
  text-align: left;
}
.showLogo img {
  max-width: 150px;
  max-height: 150px;
  margin: 30px 50px;
  /* border: 1px dashed #ccc; */
  padding: 1px;
}
.showLogo p {
  width: 100%;
  height: 70%;
}
.ingo {
  height: auto;
  margin: 22px 0;
  box-sizing: border-box;
  padding: 0 50px;
  width: 100%;
  /* width: 100%;
  padding: 0 50px;
  box-sizing: border-box; */
}
.ingo > div {
  margin: 20px 0;
  font-size: 26px;
  height: auto;
  box-sizing: border-box;
}
.ingo > div::after{
  content: "";
  clear: both;
  display: block;
}
.ingo > div span {
  min-width: 100px;
  display: inline-block;
  font-size: 28px;
  text-align: right;
}
.ingo > div p{
  width: 76%;
  display: inline-block;
  box-sizing: border-box;
  vertical-align: top;
  letter-spacing: 1px;
  line-height: 1.2;
  font-size: 28px;
}
.introduction {
  width: 100%;
  height: auto;
  padding: 0 50px;
  letter-spacing: 3px;
  text-indent: 2em;
  font-size: 26px;
  line-height: 1.5;
  box-sizing: border-box;
}
.infobot {
  width: 100%;
  padding: 0 50px;
  padding-bottom: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
}
.infobot .infoLeft {
  width: 49%;
  box-sizing: border-box;
  max-width: 49%;
  min-width: 49%;
}
.infobot .infoRight {
  width: 49%;
  max-width: 49%;
  min-width: 49%;
  box-sizing: border-box;
}
.infobot p {
  line-height: 1.3;
  font-size: 24px;
}
.infobot p span {
  display: inline-block;
  min-width: 70px;
}
</style>