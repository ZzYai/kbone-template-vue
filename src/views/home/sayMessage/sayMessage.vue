<template>
  <div class="sayMessage">
    <div class="leftMessage">
      <p class="pOne">与您联系过的企业</p>
      <ul class="leftMessageUl">
        <li
          v-for="(item, index) in leftMessage"
          :key="index"
          :class="{ onthis: index == isthis }"
          @click="handleChoice(item)"
        >
          <img :src="item.img || item.logo" />
          <div>
            <p class="pTwo">{{ String(item.name) }}</p>
            <!-- <p class="pThree">{{ item.enterprise }}</p> -->
            <span>{{ item.created_at }}</span>
          </div>
        </li>
      </ul>
      <!-- <button class="whiteBtn">关闭聊天</button> -->
    </div>
    <div class="rightMessage" ref="rightMessage">
      <p class="pFour">商机沟通</p>
      <ul class="domframe" ref="domframe" @scroll="handchange">
        <li
          v-for="(item, index) in rightMessage"
          :key="index"
          :class="item.type == 1 ? 'domliright' : 'domlileft'"
        >
          <template v-if="item.type == 1">
            <!-- <div
              class="statusDivOne"
              :style="{
                background: item.status == 'isRead' ? '#04c27c' : '#fa6400',
              }"
            >
              {{ item.status == "isRead" ? "已读" : "未读" }}
            </div> -->
            <p class="statusPOne">
              {{ item.message }}
            </p>
          </template>
          <template v-else>
            <p class="statusPTwo">
              {{ item.message }}
            </p>
            <!-- <div
              class="statusDivTwo"
              :style="{
                background: item.status == 'isRead' ? '#04c27c' : '#fa6400',
              }"
            >
              {{ item.status == "isRead" ? "已读" : "未读" }}
            </div> -->
          </template>
        </li>
      </ul>
      <div class="textareaDiv">
        <textarea
          placeholder="请输入"
          ref="textareaDom"
          name=""
          id=""
          cols="30"
          rows="10"
          v-model="sendInfoData.message"
        ></textarea>
        <div @click="fouseTop">
          <!-- <p>按Enter键发送，按Ctrl+Enter键换行</p> -->
          <button class="whiteBtn" @click="handleSend($event)">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  components: {
    Toast
  },
  data() {
    return {
      linbo: true,
      webSocket: null,
      isthis: null,   //选中当前项
      leftMessage: [
      ],
      rightMessage: [
      ],
      topage: 1,
      sendData: {
        chat_id: 0,
        page: 1,
        pageSize: 15,
        id: 0
      },
      sendInfoData: {     //创建发送参数
        method: "send",
        message: "",
        sender: 0,
        receiver: 0
      }
    }

  },
  mounted() {
    //初始化 
    this.initial();
    this.handchange();              //上划加载更多消息    详细信息

  },
  methods: {
    handleChoice(item) {     //选择联系人
      this.leftMessage.forEach((items, index) => {
        if (items.chat_id == item.chat_id) {
          this.isthis = index;
        }
      })
      this.rightMessage.splice(0);   //清空所有消息
      this.getChatInfo(item);
    },
    handleSend(e) {      //发送
      e.stopPropagation()
      if (!this.webSocket) {
        Toast.fail({
          message: '请选择联系人',
          forbidClick: false,
          duration: 2000,
          className: 'failToast'
        });
        return
      }
      if (!this.sendInfoData.message) {
        Toast.fail({
          message: '不可为空',
          forbidClick: false,
          duration: 2000
        });
        return
      }
      let json = this.sendInfoData;
      this.todomvalue(this.sendInfoData.message)
      this.webSocket.send(JSON.stringify(json));
      this.sendInfoData.message = '';
    },
    todomvalue(value) {      //向页面添加数据
      this.rightMessage.push({
        type: 1,
        message: value
      });
      this.$nextTick(() => {
        if (this.$refs.domframe) {
          this.$refs.domframe.scrollTop = this.$refs.domframe.scrollTop + 50;
        }
      })
    },
    connectWebSocket() {
      this.webSocket = new WebSocket("wss://jinpu.mishihudong.com/wss?userid=" + this.sendData.chat_id)

      this.webSocket.onmessage = (e) => {
        if (e.data != 'Opened') {
          let a = JSON.parse(e.data)
          if (a.method == "new_message") {
            this.todomvalue(a.message)
          }
        }
      }
      this.webSocket.onopen = () => {
        console.log("连接成功")
      }
      this.webSocket.onclose = (e) => {
        this.webSocket = null;
        console.log("关闭连接")
      }
      this.webSocket.onerror = () => {
        console.log('WebSocket连接发生错误')
      }
      Toast.clear()
    },
    initial() {
      let loadingInfo = Toast.loading({
        message: '加载中...',
        duration: 0,
        forbidClick: false
      })
      this.$api.user.getTestingCheck().then(resp => {  //登录检测
        if (resp) {
          let sendid = resp.data.result.id;
          this.sendData.chat_id = sendid;     //个人用户id  用于获取详细信息的
          this.sendInfoData.sender = sendid;    //用于创建连接
          this.$api.chat.getChatInfo().then(resp => {   //获取联系人列表
            if (resp) {
              let arrvalue = resp.data.find((el) => {
                return el.receive == this.$route.params.id
              });
              if (resp.data.length) {           //如果有联系人，放入页面
                this.leftMessage = resp.data;
              }
              loadingInfo.clear()
              if (arrvalue) {           //如果 有值，站到了企业跳入的
                this.handleChoice(arrvalue);    //直接触发点击，获取详细信息
              } else {      //没有  或者直接进来
                if (!this.$route.params.info) {   //判断是否有企业调过来
                  return
                }
                let da = JSON.parse(this.$route.params.info);   //有的话拿到值
                this.leftMessage.unshift({            //在数组前面加入暂存本地信息
                  name: da.enterprise,
                  receive: this.$route.params.id, //接收人的id
                  created_at: this.$ms.nowTime(),
                  phone: da.phone,
                  sender: sendid,
                  logo: da.logo,
                  bendi: true
                })
              }
            }
          })
        } else {
          loadingInfo.clear()
          this.$router.push({
            path: '/home/mine'
          })
        }
      });
      // 123
      this.$nextTick(() => {
        // let dom = this.$refs.rightMessage;
        // let dom1 = this.$refs.domframe;
        // let height = window.innerHeight;
        // dom1.style.height = (height - 450 ) / 16 + 'rem';
        // window.onresize = function () {
        //   let height = dom.offsetHeight;
        //   dom1.style.height = (height - 450) / 16 + 'rem';
        // }
      })



    },
    getChatInfo(item) {      //获取对应消息信息
      let loadingInfo = Toast.loading({
        message: '加载中...',
        duration: 0,
        forbidClick: false
      });
      let data = { ...this.sendData };      //拿到请求详细信息参数
      data.id = 0;                      //重置id为0
      if (item.bendi) {     //本地的    如果是本地企业跳入
        this.sendInfoData.receiver = this.$route.params.id; //本地拿企业id  给连接参数接收人id赋值
        this.connectWebSocket()             //启动连接
        return
      }
      this.sendInfoData.receiver = item.receive;    //如果不是本地跳入  拿到对应信息放入接收人id
      data.chat_id = item.chat_id;
      this.connectWebSocket()         //启动连接
      this.$api.chat.getChatDetails(data).then(resp => {      //开始获取详细信息
        if (resp) {
          let arr = resp.data.data;
          this.rightMessage = arr.reverse();      //放入页面
          this.sendData.id = arr[arr.length - 1].id;
          this.$nextTick(() => {
            if (this.$refs.domframe) {
              this.$refs.domframe.scrollTop = this.$refs.domframe.scrollHeight;
            }
          })
          loadingInfo.clear()
        }
      }).catch((err => {
        console.err(err);
        loadingInfo.clear();
        Toast.fail({
          message: '连接故障',
          duration: 2000,
          forbidClick: false
        })
      }))


    },
    handchange(e) {
      if (this.linbo) {
        this.linbo = false;
        return
      }
      if (!this.$refs.domframe) {
        return
      }
      let top = this.$refs.domframe.scrollTop;
      if (top == 0) {
        let data = { ...this.sendData };
        this.$api.chat.getChatDetails(data).then(resp => {
          if (resp) {
            let arr = resp.data.data;
            this.sendData.id = arr[arr.length - 1].id;
            this.rightMessage.unshift(...arr.reverse())
          }

        })
        return
      }
    },
    fouseTop() {
      this.$nextTick(() => {
        this.$refs.textareaDom.focus()
      })
    }
  },
  destroyed() {

    if (this.webSocket) {
      this.webSocket.close()
    }
  }
}
</script>

<style scoped>
.sayMessage {
  width: 100%;
  height: 100%;
  background: #ffffff;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f3f3;
  display: flex;
  justify-content: space-between;
  align-content: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
}
.leftMessage {
  width: 35%;
  height: 100%;
  border-right: 1px solid #f2f2f2;
  box-sizing: border-box;
  padding-bottom: 190px;
}
.rightMessage {
  width: 65%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
}
.sayMessage .pOne {
  width: 100%;
  height: 60px;
  background: #ffffff;
  border-radius: 5px 0px 0px 0px;
  border: 1px solid #f7f7f7;
  font-size: 22px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.5);
  line-height: 60px;
  padding-left: 20px;
  box-sizing: border-box;
}
.leftMessage .leftMessageUl {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
.rightMessage ul {
  /* height: 64%; */
  flex-grow: 1;
  overflow: hidden;
  overflow-y: auto;
  width: 100%;
  /* border: 1px solid red; */
}
.leftMessage li,
.rightMessage li {
  width: 100%;
  list-style: none;
  display: flex;
  padding: 20px;
  box-sizing: border-box;
}
.leftMessage li {
  width: 100%;
  height: 120px;
  align-items: center;
  padding-right: 0;
}
.rightMessage li div {
  width: 60px;
  height: 30px;
  border-radius: 5px;
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  line-height: 32px;
}
.rightMessage li p {
  /* width: 340px; */
  /* height: 100px; */
  border-radius: 5px;
  padding: 16px;
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  box-sizing: border-box;
}
.domframe .domliright {
  position: relative;
  justify-content: flex-end;
}
.domframe p {
  position: relative;
}
.leftMessage li:hover {
  background: #f8fbff;
}
.leftMessage li img {
  width: 49px;
  height: 49px;
  min-width: 40px;
  min-height: 40px;
  max-width: 55px;
  max-height: 55px;
  margin-right: 18px;
}
.leftMessage li > span {
  margin-left: auto;
}
.leftMessage li > div {
  width: 136px;
  flex: 1;
}
.leftMessageUl li .pTwo {
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 5px;
  font-size: 20px;
  color: #6d7587;
  padding-right: 5px;
}
.leftMessageUl li.onthis {
  background: #5e6c6b1f;
}
.sayMessage .pThree {
  width: 136px;
  /* height: 17px; */
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
  /* border:1px solid red; */
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
/* .sayMessage .leftMessage .pTWo {
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6d7587;
} */
.leftMessage .whiteBtn {
  width: 257px;
  height: 40px;
  /* background: #F9F9F9; */
  border-radius: 5px;
  border: 1px solid #f2f2f2;
  display: block;
  margin: 20px auto 0;
}
.sayMessage .pFour {
  width: 100%;
  height: 60px;
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  background: #ffffff;
  border-radius: 5px 0px 0px 0px;
  border: 1px solid #f7f7f7;
  border-left: none;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.5);
  line-height: 60px;
  padding-left: 20px;
  box-sizing: border-box;
}
.statusPOne {
  background: #34425f;
  color: #ffffff;
  margin-left: 10px;
}
.statusPTwo {
  background: #fafcff;
  color: #34425f;
  border: 1px solid #d6d6d6;
  margin-right: 10px;
  position: relative;
}
/* .statusPTwo::after {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  background: #34425f;
  top: 50%;
  transform: translateY(-8px);
  left: -15px;
  border-top: 10px solid #fff;
  border-right: 15px solid #34425f;
  border-bottom: 10px solid #fff;
  border-left: 0;
  font-size: 0;
  overflow: hidden;
  box-sizing: border-box;
} */
.textareaDiv {
  width: 100%;
  height: 340px;
  border-top: 1px solid #f2f2f2;
  padding: 20px 10px;
  box-sizing: border-box;
  margin-bottom: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.textareaDiv textarea {
  width: 100%;
  height: 200px;
  resize: none;
  border: none;
  outline: none;
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  line-height: 28px;
}
.textareaDiv div {
  /* display: flex;
  align-items: center;
  justify-content: flex-end; */
  margin-top: 10px;
  text-align: right;
  width: 100%;
}
/* .textareaDiv div p {
  width: 300px;
  height: 23px;
  font-size: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #dcdcdc;
  line-height: 23px;
} */
.textareaDiv div .whiteBtn {
  width: 150px;
  height: 60px;
  /* margin-left: auto; */
  font-size: 22px;
  margin-right: 15px;
  background: red;
  color: #fff;
  /* border:1px solid blue; */
  /* position: fixed;
  bottom:130px;
  right:25px; */
}
</style>