<template>
  <div class="enterprise">
    <div class="sidebarBtn" @click="handleSidebar">
      <!-- 侧边栏按钮 -->
      <img src="../../assets/sidebar.svg" />
    </div>
    <router-view></router-view>
    <Popup
      v-model="showSideNavigation"
      position="left"
      style="width: 80%; height: 100%"
    >
      <enterpriseTabbar @changePage="changePage" @handleOff="handleOff" />
    </Popup>
    <!-- <button class="redBtn" :class="positionBtn.positionMap" @click="returnAddr">
      返回地图
    </button> -->
    <!-- <button class="gohome" @click="gohomepage">返回首页</button> -->
    <!-- <router-link
      class="gohome"
      :class="positionBtn.positionBack"
      :to="{ path: '/enterprise/enterpriseHome', query: { id: enterpriseId } }"
      >返回首页
    </router-link> -->
  </div>
</template>

<script>
import enterpriseTabbar from "../../components/enterpriseTabbar.vue"
// import { mapState } from 'vuex'
import { SwitchCell, Toast, Popup } from 'vant'
import { mapState } from 'vuex'
export default {
  components: {
    enterpriseTabbar,
    Toast,
    Popup
  },
  computed: {
    ...mapState('enterprise', ['positionBtn'])
  },
  data() {
    return {
      showSideNavigation: false,     //侧边栏
      titleShow: 1,
      enterpriseId: null,
      receive: [],
    }
  },
  created() {
    // console.log("这是起始页", this.$route.query);
    if (!this.$route.query.id) {
      this.$router.push('/home')
      return
    }
    this.testingLogin()
  },
  mounted() {

    if (this.$route.name == "enterpriseHome") {
      this.$store.commit('pageActive/setPageActive', 12)
    }
    // console.log(this.$store.getters['enterprise/getPositionMapPoint'])

    // console.log(this.$store.getters["enterprise/getPositionMapPoint"])
  },
  methods: {
    handleOff() {      //关闭侧边栏
      this.showSideNavigation = false;
    },
    handleSidebar() {    //打开侧边栏
      this.showSideNavigation = true;
    },
    testingLogin() {     //检测登录状态   更改
      let token = localStorage.getItem('token');
      if (token) {
        this.$api.user.getTestingCheck().then(resp => {
          if (resp) {
            this.enterpriseId = this.$route.query.id;
            this.getData();
          } else {
            localStorage.removeItem('token');
            // window.location.reload();
            this.testingLogin();
            return
          }
        });
      } else {
        console.log("用户未登录");
        //获取本地浏览记录
        let _this = this;
        this.enterpriseId = this.$route.query.id;
        this.$api.enterprise.getEnterpriseInfo({ id: this.$route.query.id }).then(resp => {
          if (resp) {
            this.receive = resp.data;
            let BrowseRecordsobj = localStorage.getItem('BrowseRecords');
            let arr = JSON.parse(BrowseRecordsobj);
            if (arr && arr.length) {
              let valueA = arr.forEach((item, index) => { //先在这里这里面找是否有当前企业
                if (item.userid == _this.enterpriseId) {
                  item.created_at = _this.$ms.nowTime();
                  return true
                }
              })
              if (!valueA) {   //证明数组里没有当前企业
                arr.push({      //没有就加入当前企业
                  created_at: this.$ms.nowTime(),
                  id: arr.length,
                  enterprise: resp.data.enterprise,
                  logo: resp.data.logo,
                  userid: Number(this.enterpriseId)
                })
              }
              for (var i = 0; i < arr.length; i++) {
                for (var j = i + 1; j < arr.length; j++) {
                  if (arr[i].userid == arr[j].userid) {
                    //如果第一个等于第二个，splice方法删除第二个
                    arr.splice(j, 1);
                    j--;
                  }
                }
              }
              localStorage.setItem('BrowseRecords', JSON.stringify(arr))
            } else {
              let BrowseRecordsobj = [
                {
                  created_at: this.$ms.nowTime(),
                  id: 0,
                  enterprise: resp.data.enterprise,
                  logo: resp.data.logo,
                  userid: Number(this.enterpriseId)
                }
              ]
              localStorage.setItem('BrowseRecords', JSON.stringify(BrowseRecordsobj))
            }
          } else {
            Toast.fail({
              message: "获取官网信息失败",
              className: "failToast",
              forbidClick: false,
              duration: 2000
            })
          }
        })
      }
    },
    getData() {
      let data = {
        id: this.enterpriseId
      }
      this.$api.enterprise.getgetEnterpriseWebsite(data).then((resp) => {
        if (resp) {
          this.receive = resp.data;
          // console.log(resp)
        } else {
          Toast.fail({
            message: "请重新登录",
            className: "failToast",
            forbidClick: false,
            duration: 2000
          })
          this.$router.push('/home/mine');
          this.$store.commit("user/setUserInfo", 0);
          this.$store.commit("user/setLoginStatus", 0)
        }
      })
    },
    // 返回地图
    returnAddr() {
      this.$router.replace({
        path: '/home'
      })
    },

    changePage(val) {
      var _this = this;
      // console.log(val)
      switch (val) {
        case 6:
          let linurl = JSON.stringify(_this.receive.panorama)
          this.$router.push({
            path: '/enterprise/enterprisePanorama',
            name: 'enterprisePanorama',
            params: {
              durl: encodeURIComponent(linurl)
            },
            query: {
              id: _this.enterpriseId
            }
          })
          break;
        case 7: this.$router.push({
          path: '/enterprise/enterpriseServe',
          name: 'enterpriseServe',
          query: {
            id: _this.enterpriseId,
          }
        })
          break;
        case 8: this.$router.push({
          path: '/enterprise/enterpriseImg',
          name: 'enterpriseImg',
          query: {
            id: _this.enterpriseId,
          }
        })
          break;
        case 9: this.$router.push({
          path: '/enterprise/enterprisePPT',
          name: 'enterprisePPT',
          query: {
            id: _this.enterpriseId,
            pdfval: encodeURIComponent(JSON.stringify(_this.receive.pdf))
          }

        });
          break;
        case 10:
          var linstr = JSON.stringify(_this.receive);
          this.$router.push({
            path: '/enterprise/enterpriseWe',
            name: 'enterpriseWe',
            params: {
              data: encodeURIComponent(linstr)
            },
            query: {
              id: _this.enterpriseId
            }
          })
          break;
        case 11:      //企业宣传
          this.$router.push({
            path: '/enterprise/enterprisePublicity',
            name: 'enterprisePublicity',
            query: {
              id: _this.enterpriseId
            }
          })
          break;
        case 12:
          this.$router.push({
            path: '/enterprise/enterpriseHome',
            name: 'enterpriseHome',
            query: {
              id: _this.enterpriseId,
              // content : JSON.stringify(_this.receive)
            }
          })
          break;
        case 13:
          this.$router.push({
            path: '/enterprise/enterpriseNews',
            name: 'enterpriseNews',
            query: {
              id: _this.enterpriseId,
            }
          })
          break;
      }
      this.$store.commit("pageActive/setPageActive", val);
      this.showSideNavigation = false;
    }
  }
}
</script>

<style scoped>
.enterprise {
  /* padding-top: 70px; */
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  /* margin-bottom: 70px; */
  box-sizing: border-box;
  /* position: absolute; */
}
.placehoder {
  height: 70px;
}
.enterprise > .redBtn {
  width: 120px;
  height: 50px;
  position: fixed;
  top: 15px;
  left: 20px;
  line-height: 50px;
  font-size: 22px;
  opacity: 0.5;
}
.gohome {
  width: 120px;
  height: 50px;
  position: fixed;
  top: 15px;
  right: 20px;
  font-size: 22px;
  opacity: 0.5;
  background: #eb0818;
  color: #fff;
  outline: none;
  border-radius: 5px;
  border: none;
  text-align: center;
  line-height: 51px;
  display: inline-block;
  z-index: 999;
}
.sidebarBtn {
  /* 侧边栏按钮 */
  position: fixed;
    z-index: 1850;
  /* top: 20px;
  right: 90px;
  z-index: 1850;
  background: transparent;
  width: 55px;
  height: 55px;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 24px; */
  top: 120px;
  left: 0;
  width: 90px;
  height: 90px;
  background: #fdfdfd;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  box-sizing: border-box;
  padding-right: 10px;
}
.sidebarBtn img {
  width: 80px;
  height: 80px;
  /* transform: translate(-13px, -13px); */
}
.footer {
  border: 1px solid red;
  width: 100%;
  height: 80px;
  background: blue;
}
</style>

<style>
/*单独对按钮定位处理  */
.enterprise .redBtn.enterprisePanoramaA {
  left: auto;
  right: 220px;
}
.enterprise .gohome.enterprisePanoramaB {
  left: auto;
  right: 85px;
}

.enterprise .redBtn.enterpriseServeA {
  left: auto;
  right: 180px;
}
.enterprise .gohome.enterpriseServeB {
  left: auto;
  right: 40px;
}

.enterprise .redBtn.enterpriseImgA {
  left: auto;
  right: 180px;
}
.enterprise .gohome.enterpriseImgB {
  left: auto;
  right: 40px;
}
</style>