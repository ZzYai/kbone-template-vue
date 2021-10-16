<template>
  <div class="homeAddr">
    <!-- 搜索 -->
    <div class="searchDiv">
      <!--上部 -->
      <div class="searchDiv-top">
        <form class="searchDiv-top-left" @submit.prevent>
          <img src="../../../assets/homeAddr/home-search-left.png" alt="" />
          <input
            type="search"
            @keyup.13="search"
            ref="input"
            placeholder="搜索企业类型，如建材或骊住通世泰建材"
            v-model="requestInfo.name"
          />
          <img
            class="searchImg"
            src="../../../assets/homeAddr/homeAddr-searchDiv-search.svg"
            @click="search"
          />
        </form>
        <!-- 企业名录 v-model="enterpriseShow"-->
        <div
          class="searchDiv-top-right"
          @click="enterpriseNameShowFun"
          :class="{ enterpriseShow: enterpriseShow }"
        >
          <img
            src="../../../assets/homeAddr/homeAddr-book-red.svg"
            v-if="enterpriseShow"
          />
          <img src="../../../assets/homeAddr/homeAddr-book-black.svg" v-else />
          <!-- 企业名录 -->
          <span>企业名录</span>
        </div>
      </div>
      <!-- 下部 -->
      <div class="searchDiv-bottom">
        <!-- <div
          class="searchBtn"
          :class="{ onthis: item.id == tageon }"
          @click="chnageSearchInfo('')"
        >
          <img :src="null" />
          <p>全部</p>
        </div> -->
        <div
          class="searchBtn"
          :class="{ onthis: item.id == tageon }"
          v-for="(item, index) in searchBtn"
          @click="chnageSearchInfo(item)"
          :key="index"
        >
          <img :src="item.icon" />
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <!-- 地图 -->
    <div id="container"></div>
    <!-- 企业名录弹窗 -->
    <Popup
      v-model="enterpriseNameShow"
      position="bottom"
      style="width: 100%; height: 85%"
      @close="enterpriseShow = false"
    >
      <enterpriseName
        @seeDetail="seeDetail"
        :enterpriseNameTagData="enterpriseNameTagData"
      />
    </Popup>
    <!-- 企业详情弹窗 -->
    <Popup
      v-model="enterpriseDetailShow"
      position="bottom"
      @open="detailShowOpen"
    >
      <enterpriseDetail ref="enterpriseDetail" :enterpriseId="enterpriseId" />
    </Popup>
    <Popup
      v-model="isClaimShow"
      position="bottom"
      style="width: 100%; height: 85%"
    >
      <!-- 认领企业 -->
      <isClaim :isClaimShowData="isClaimShowData"></isClaim>
    </Popup>
    <!-- 加载中 -->
    <Loading v-if="loadingShow" />
    <!-- <Overlay :show="loadingShow" @click="loadingShow = false">
            <Loading type="spinner" color="#1989fa" />
        </Overlay> -->
  </div>
</template>

<script>
import { Popup } from 'vant';
import Loading from "../../../components/Loading.vue"
import enterpriseName from "./enterpriseName"
import enterpriseDetail from "./enterpriseDetail"
import isClaim from "./isClaim.vue"
export default {
  components: {
    Popup,
    enterpriseName,
    enterpriseDetail,
    isClaim,
    Loading
  },
  data() {
    return {
      cp: null,
      // fragment: null,   //创建文档碎片
      loadingShow: false,   // 加载中
      // 请求数据
      requestInfo: {
        tag: '',
        name: '',
        searchKey: '',
      },
      tageon: null,//标签标示
      // 企业名录显示
      enterpriseNameShow: false,     //打开企业名录
      enterpriseNameTagData: [], //企业名录标签数据
      // 企业详情显示
      enterpriseDetailShow: false,    //企业详情
      enterpriseShow: false,    //企业名录按钮选中
      isClaimShow: false,      //展示是否认领
      isClaimShowData: null,
      // 点集合
      points: [],   //所有标注点
      // 信息窗口
      // markers: [],
      tenList: [],      //所有企业位置
      searchBtn: [],  //  标签
      enterpriseId: '',
      arrMarkersNow: {},   //当前视口添加的点
      arrLabelNow: {},     //当前视口添加的信息口
      timers: new Date().getTime(),
      // currentSelectPoint : null,       //当前选中企业的定位   废除
    }
  },
  created() {
    this.gettageme();     //获取标签
    // this.fragment = document.createDocumentFragment();    //文档碎片
  },
  mounted() {
    this.tageon = "全部";
    this.getMapInfo();
  },
  methods: {
    detailShowOpen() {     //企业详情打开触发
      // console.log("打开")
      this.$nextTick(() => {
        this.$refs.enterpriseDetail.thisOpen()
      })

    },
    gettageme() { //获取标签
      this.$api.enterprise.getTags().then((gdata) => {
        if (gdata) {
          this.searchBtn = gdata.data;
          this.searchBtn.unshift({
            icon: require('../../../assets/homeAddr/all.svg'),
            id: '全部',
            name: "全部"
          })
          this.enterpriseNameTagData = gdata.data;
        }
      })
    },
    getMapInfo(value) {   //所有企业位置
      this.loadingShow = true;
      this.$api.user.getMapInfo(this.requestInfo).then((resp) => {
        if (resp) {
          this.tenList = resp.data;
          if (resp.data.length != 0 && value == "search") {
            this.setMap({
              latitude: resp.data[0].latitude,
              longitude: resp.data[0].longitude
            });
          } else {
            this.setMap()
          }
          this.addMaker()
        }
        this.loadingShow = false;
      })
    },
    // 搜索方法
    search() {
      this.$refs.input.blur();    //点击搜索后收起软键盘
      this.requestInfo.name = this.$refs.input.value;
      this.getMapInfo("search");
      // this.requestInfo.searchKey 
    },
    // 点击按钮搜索企业
    chnageSearchInfo(val) {
      // console.log(val)
      // console.log(this.searchBtn)
      if (this.tageon == val.id || val.id == "全部") {
        this.tageon = "全部";
        this.requestInfo.tag = '';
      } else {
        this.tageon = val.id;
        this.requestInfo.tag = val.name;
      }
      this.getMapInfo("search");

    },
    seeDetail(id, item) {   // 查看企业详情
      this.enterpriseId = id;
      this.enterpriseNameShow = false;
      this.enterpriseShow = false;      //关闭企业名录选中
      // this.enterpriseDetailShow = true;
      // this.currentSelectPoint = value;     废除
      this.isClaimShowData = {
        enterprise: item.enterprise,
        id: id
      }
      this.isClaimShow = true;
    },
    // 显示企业名录
    enterpriseNameShowFun() {
      this.enterpriseNameShow = true;
      this.enterpriseShow = true;
    },
    // 初始化地图
    setMap(pointObj) {
      let name = '金州区'
      var map = new BMap.Map("container");
      let linpoint = new BMap.Point(121.796584,39.055261);
      let pointNow = pointObj && pointObj.latitude ? new BMap.Point(pointObj.longitude, pointObj.latitude) : linpoint;
      map.centerAndZoom(pointNow, 16);//设置中心点和显示级别。中国。
      map.enableScrollWheelZoom(true) //开启鼠标滚轮缩放 
      // 开启缩放 平移控件
      map.addControl(new BMap.NavigationControl({
        // 控件的停靠位置（可选，默认左上角）
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        // 控件基于停靠位置的偏移量（可选）
        offset: new BMap.Size(20, 80)
      }));//地图左上角的缩放
      this.cp = map.getBounds()
      // 开启定位
      // let locationControl = new BMap.GeolocationControl({
      //   // 控件的停靠位置（可选，默认左上角）
      //   anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
      //   // 控件基于停靠位置的偏移量（可选）
      //   offset: new BMap.Size(20, 150),
      //   enableAutoLocation: false,
      // })
      // locationControl.addEventListener('locationSuccess', function (e) {
      //   console.log("定位成功", e)
      // });
      // locationControl.addEventListener('locationError', function (e) {
      //   console.log("定位失败", e)
      // });
      // map.addControl(locationControl);//地图左上角的缩放

      // var geolocation = new BMap.Geolocation();
      // geolocation.getCurrentPosition(function (r) {
      //     // console.log(r)
      //   if (this.getStatus() == BMAP_STATUS_SUCCESS) {
      //       var mk = new BMap.Marker(r.point);
      //       map.addOverlay(mk);
      //       map.panTo(r.point);
      //       let url = 'https://api.map.baidu.com/geoconv/v1/?';
      //       url += 'coords='+r.point.lat+','+r.point.lng;
      //       url += '&from=1&to=5&ak=fN0HqITIonKvk179rxqsWSHepzOGTUyX&output=jsonp&callback=kk';
      //       var dom = document.createElement('script');
      //       dom.src = url; 
      //       document.body.appendChild(dom)
      //       window.kk = function(resp){
      //         console.log(resp)
      //       }
      //   }
      //   else {
      //     switch (this.getStatus()) {
      //       case 1:
      //         console.log("城市列表。对应数值“1”")
      //         break
      //       case 2:
      //         console.log("位置结果未知。对应数值“2”")
      //         break
      //       case 3:
      //         console.log("导航结果未知。对应数值“3”")
      //         break
      //       case 4:
      //         console.log("非法密钥。对应数值“4”")
      //         break
      //       case 5:
      //         console.log("非法请求。对应数值“5”")
      //         break
      //       case 6:
      //         console.log("没有权限。对应数值“6”")
      //         break
      //       case 6:
      //         console.log("务不可用。对应数值“7”")
      //         break
      //       case 6:
      //         console.log("超时。对应数值“8”")
      //         break
      //     }
      //   }
      // }, { enableHighAccuracy: true })
      //关于状态码
      //BMAP_STATUS_SUCCESS    检索成功。对应数值“0”。
      //BMAP_STATUS_CITY_LIST    城市列表。对应数值“1”。
      //BMAP_STATUS_UNKNOWN_LOCATION    位置结果未知。对应数值“2”。
      //BMAP_STATUS_UNKNOWN_ROUTE    导航结果未知。对应数值“3”。
      //BMAP_STATUS_INVALID_KEY    非法密钥。对应数值“4”。
      //BMAP_STATUS_INVALID_REQUEST    非法请求。对应数值“5”。
      //BMAP_STATUS_PERMISSION_DENIED    没有权限。对应数值“6”。(自 1.1 新增)
      //BMAP_STATUS_SERVICE_UNAVAILABLE    服务不可用。对应数值“7”。(自 1.1 新增)
      //BMAP_STATUS_TIMEOUT    超时。对应数值“8”。(自 1.1 新增)







      // console.log(dingwei)
      window.map = map;//将map变量存储在全局
      map.setMapStyleV2({
        styleId: '6c1da45ce84b31360b9c1245ba649338'
      });
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
    },
    // 添加标     
    addMaker() {
      // let timer1 = new Date().getTime();
      let list = this.tenList;
      let _this = this;
      let arrOverlays = [];
      for (let i = 0; i < list.length; i++) {
        let pt = new BMap.Point(list[i].longitude, list[i].latitude);
        pt.claim = list[i].claim;
        pt.point = list[i].point;
        pt.myid = list[i].id;
        pt.enterprise = list[i].enterprise;
        pt.logo = list[i].logo;
        arrOverlays.push(pt);
      }
      this.moveendAddOverlay(arrOverlays);
      map.addEventListener("moveend", () => {     //每次移动触发当前视口的点
        this.moveendAddOverlay(arrOverlays)
      });

      console.log('时间', new Date().getTime() - this.timers);

    },
    moveendAddOverlay(points) {     //地图移动号展示标点
      if (!map) {
        return
      }
      let logo = String(require('../../../assets/LOGO.png'));
      let _this = this;
      let arrMarkers = points;    //所有已经创建好的
      var cp = map.getBounds(); // 返回map可视区域，以地理坐标表示  
      var sw = cp.getSouthWest(); // 返回矩形区域的西南角  
      var ne = cp.getNorthEast(); // 返回矩形区域的东北角  
      var zoom = map.getZoom(); //当前缩放级别 
      var swlng = sw.lng,
        swlat = sw.lat,
        nelng = ne.lng,
        nelat = ne.lat;
      let arrMarkersNow = this.arrMarkersNow;   //已经创建的点
      let arrLabelNow = this.arrLabelNow;   //已经创建的信息口
      for (let i = 0; i < arrMarkers.length; i++) {
        let thisMarker = arrMarkers[i];
        let opts = {
          position: thisMarker,
          offset: new BMap.Size(20, -30)
        }
        let logo1 = thisMarker.logo ? thisMarker.logo : logo;
        let label = new BMap.Label('<img style="' + 'width:20px;height:20px;margin-right:10px' + '" ' + 'src="' + logo1 + '">' + '<span>' + thisMarker.enterprise + '</span>', opts)
        label.setStyle({
          color: 'gray',
          borderRadius: '5px',
          borderColor: '#ccc',
          padding: ' 0 10px',
          fontSize: '16px',
          lineHeight: '30px',
          fontFamily: '微软雅黑',
          cursor: 'pointer',
          display: 'flex',
          height: '30px',
          alignItems: 'center',
        });
        //代表当前视窗
        if ((thisMarker.lng > swlng && thisMarker.lat > swlat) && (thisMarker.lng < nelng && thisMarker.lat < nelat)) {
          if (!arrMarkersNow['markers' + i]) {
            let markers;
            if (thisMarker.claim) {    //如果是已经认领的企业 为1
              if (thisMarker.point) {   //如果有定位图标
                var myIcon = new BMap.Icon(thisMarker.point, new BMap.Size(24, 24));
                myIcon.imageSize = new BMap.Size(24, 24)
                myIcon.anchor = new BMap.Size(12, 24)
                markers = new BMap.Marker(thisMarker, {
                  icon: myIcon
                });
              } else {
                markers = new BMap.Marker(thisMarker)
              }
              label.addEventListener('click', () => {
                _this.enterpriseId = thisMarker.myid;
                _this.enterpriseDetailShow = true;
              })
              markers.addEventListener('click', () => {
                _this.enterpriseId = thisMarker.myid;
                _this.enterpriseDetailShow = true;
              })
            } else {
              if (thisMarker.point) {
                var myIcon = new BMap.Icon(list[i].point, new BMap.Size(24, 24));
                myIcon.imageSize = new BMap.Size(24, 24)
                myIcon.anchor = new BMap.Size(12, 24)
                markers = new BMap.Marker(thisMarker, {
                  icon: myIcon
                });
              } else {
                markers = new BMap.Marker(thisMarker)
              }
              label.addEventListener('click', () => {
                _this.isClaimShow = true;
                _this.isClaimShowData = {
                  id: thisMarker.myid,
                  enterprise: thisMarker.enterprise
                };
              })
              markers.addEventListener('click', () => {
                _this.isClaimShow = true;
                _this.isClaimShowData = {
                  id: thisMarker.myid,
                  enterprise: thisMarker.enterprise
                };
              });
            }
            arrMarkersNow['markers' + i] = markers;
            arrLabelNow['label' + i] = label;
            map.addOverlay(label);
            map.addOverlay(markers);
          }
        } else {
          map.removeOverlay(arrMarkersNow['markers' + i]);
          map.removeOverlay(arrLabelNow['label' + i]);
          arrMarkersNow['markers' + i] = undefined;
          arrLabelNow['label' + i] = undefined;
        }
      }
    }
  }
}
</script>

<style scoped>
.homeAddr {
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
  position: relative;
  user-select: none;
}
#container {
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 1;
}
.searchDiv {
  width: 100%;
  height: 220px;
  background: transparent;
  border-radius: 5px;
  z-index: 2;
  position: fixed;
  top: 20px;
  left: 0;
  right: 0;
  box-sizing: border-box;
  padding: 0 15px;
}
.searchDiv-top {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.searchDiv-top div,
.searchDiv-top form {
  height: 100%;
  background: #ffffff;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
}

.searchDiv-top .searchDiv-top-left {
  width: 560px;
  display: flex;
  align-items: center;
  padding-left: 17px;
  padding-right: 20px;
  box-sizing: border-box;
  margin-right: 15px;
  justify-content: space-between;
}
.searchDiv-top .searchDiv-top-right {
  width: 145px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6d7587;
  border: none;
  box-sizing: border-box;
  padding: 0 15px;
}
.searchDiv-top-right span {
  margin-left: 10px;
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  white-space: nowrap;
}
.searchDiv-top-right img,
.searchDiv-top-left img {
  width: 25px;
  border: none;
}
.searchDiv-top-left img {
  width: 30px;
}
.searchDiv-top .enterpriseShow {
  background: #eb0818;
  color: #ffffff;
}
.searchDiv-top-left input {
  width: 80%;
  height: 100%;
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #bdbdbd;
  outline: none;
  border: none;
  background: transparent;
  /* padding-left: 14px; */
  box-sizing: border-box;
}
.searchDiv-top-left .searchImg {
  width: 25px;
  cursor: pointer;
}

.searchDiv-bottom::-webkit-scrollbar {
  display: none;
}
.searchDiv-bottom {
  width: 100%;
  min-height: 130px;
  margin-top: 15px;
  background: #ffffff;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  display: flex;
  align-items: center;
  /* justify-content: space-around; */
  justify-content: flex-start;
  flex-wrap: nowrap;
  overflow: hidden;
  overflow-x: auto;
}
.searchBtn {
  margin: 10px 0;
  text-align: center;
  width: 100px;
  min-width: 100px;
  max-width: 100px;
}
.searchBtn img {
  width: 60px;
  cursor: pointer;
  height: 60px;
  background: #b6b6b6;
  border-radius: 10px;
}
.searchDiv-bottom .searchBtn p {
  text-align: center;
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6a788c;
  margin-top: 8px;
}
.searchDiv-bottom .searchBtn.onthis p {
  color: #eb0818;
  font-weight: 600;
}
.isClaimShow {
  border: 1px solid red;
  width: 100%;
  bottom: 0;
  background: #fff;
  height: 500px;
}
</style>