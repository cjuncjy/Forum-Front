<template>
  <el-dialog
    class="private-letter"
    title="私信"
    :visible.sync="dialogVisible"
    width="50%"
    :close-on-click-modal="false"
    :before-close="closeLetter"
  >
    <div class="letter-wrapper">
      <div class="header">
        {{ $t("privateLetter.from") }}: {{ this.toUserName }}
      </div>
      <div class="body" ref="body">
        <div class="letter-list" ref="list">
          <!-- <div class="letter-item txt-left">
            <div class="item-top">
              <span class="username">tiny</span>
              <span class="time">2020-4-27 15:23:45</span>
            </div>
            <div class="item-content">
              <span>你好啊</span>
            </div>
          </div>
          <div class="letter-item txt-right">
            <div class="item-top">
              <span class="username">admin</span>
              <span class="time">2020-4-27 15:23:45</span>
            </div>
            <div class="item-content">
              <span>你也好</span>
            </div>
          </div> -->
        </div>
      </div>
      <div class="footer">
        <el-input
          type="textarea"
          rows="3"
          :placeholder="$t('privateLetter.placeholder')"
          v-model="content"
        ></el-input>
        <el-button type="primary" @click="toSendMsg">{{
          $t("privateLetter.send")
        }}</el-button>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeLetter">{{
        $t("privateLetter.close")
      }}</el-button>
      <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "PrivateLetter",
  props: {
    fromUserId: {
      type: Number,
      default: 0
    },
    toUserId: {
      type: Number,
      default: 0
    },
    fromUserName: {
      type: String,
      default: ""
    },
    toUserName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dialogVisible: false,
      content: "",
      isDied: false
    };
  },
  methods: {
    $init(infoList) {
      this.dialogVisible = true;
      this.isDied = false;
      this.$nextTick(() => {
        let list = this.$refs.list;
        console.log("toUserId", this.toUserId);
        console.log("fromUserId", this.fromUserId);
        // 先从session中看看本次登陆有没有聊过天
        // let inner = localStorage.getItem(`${this.fromUserId}`);
        let inner = localStorage.getItem(`${this.toUserId}`);
        console.log("1", inner);
        if (inner) {
          list.innerHTML += JSON.parse(inner);
        }
        if (infoList) {
          // 说明是来看未读的
          let divStr = "";
          infoList.forEach(item => {
            divStr += `
         <div class="letter-item txt-left">
            <div class="item-top">
              <span class="username">${this.toUserName}</span>
              <span class="time">${item.time}</span>
            </div>
            <div class="item-content">
              <p>${item.content}</p>
            </div>
          </div>
      `;
          });
          list.innerHTML += divStr;
          // 更新滚动条
          this.updateScroll();
        }
      });
    },
    toSendMsg() {
      this.$socket.emit("sayTo", {
        fromUserId: this.fromUserId,
        fromUserName: this.fromUserName,
        toUserId: this.toUserId,
        toUserName: this.toUserName,
        content: this.content,
        time: this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
      });
      // 这里的信息中应该增加我发送出去的
      let list = this.$refs.list;
      let divStr = `
         <div class="letter-item txt-right">
            <div class="item-top">
              <span class="username">${this.fromUserName}</span>
              <span class="time">${this.$moment(new Date()).format(
                "YYYY-MM-DD HH:mm:ss"
              )}</span>
            </div>
            <div class="item-content">
              <p>${this.content}</p>
            </div>
          </div>
      `;
      list.innerHTML += divStr;
      this.content = "";
      // 更新滚动条
      this.updateScroll();
    },
    closeLetter() {
      this.dialogVisible = false;
      // 这里说明你看到了消息，应该把vuex中存储当前对话的信息清空
      this.$store.dispatch("user/clearMsg", this.toUserId);
      // 将和当前用户的聊天存一份到session中
      let inner = this.$refs.list.innerHTML;
      localStorage.setItem(`${this.toUserId}`, JSON.stringify(inner));
      // 把当前页面的交流信息清空了，避免影响其他的
      this.$refs.list.innerHTML = "";
      this.isDied = true;
    },
    updateScroll() {
      this.$nextTick(() => {
        this.$refs.body.scrollTop = this.$refs.body.scrollHeight;
        this.$refs.body.pageYOffset = this.$refs.body.scrollHeight;
      });
    }
  },
  mounted() {
    // 接受后台传过来的数据
    this.sockets.subscribe("message", data => {
      // this.msg = data.message;
      this.$nextTick(() => {
        if (!this.isDied) {
          let divStr = "";
          let list = this.$refs.list;
          console.log(list);
          divStr += `
         <div class="letter-item txt-left">
            <div class="item-top">
              <span class="username">${data.fromUserName}</span>
              <span class="time">${data.time}</span>
            </div>
            <div class="item-content">
              <p>${data.content}</p>
            </div>
          </div>
      `;
          list.innerHTML += divStr;
          this.$store.dispatch("user/myMessage", data);
          // 更新滚动条
          this.updateScroll();
        }
      });
    });
  }
};
</script>

<style scoped lang="scss">
.private-letter ::v-deep {
  box-sizing: border-box;
  .el-dialog {
    margin-top: 5vh !important;
    max-height: 90vh;
    // max-height: 80vh;
    overflow: auto;
    .el-dialog__header {
      border-bottom: 1px solid #e5e5e5;
    }
    // .el-dialog__footer {
    //   border-top: 1px solid #e5e5e5;
    // }
    .el-dialog__body {
      .letter-wrapper {
        border: 1px solid #ccc;
        .header {
          padding: 0 20px;
          height: 50px;
          line-height: 50px;
          font-size: 18px;
          border-bottom: 1px solid #ccc;
        }
        .body {
          padding: 10px 20px;
          max-height: 220px;
          min-block-size: 180px;
          overflow: auto;
          .letter-list {
            overflow: hidden;
            .letter-item {
              margin-bottom: 10px;
              // display: block;
              .item-top {
                line-height: 25px;
                .username {
                  font-size: 16px;
                  margin-right: 10px;
                }
                .time {
                  font-size: 10px;
                  color: #999;
                }
              }
              .item-content {
                font-size: 16px;
                line-height: 30px;
                // max-width: 50%;
                p {
                  display: inline-block;
                  box-sizing: border-box;
                  max-width: 80%;
                  background: #e5e5e5;
                  padding: 8px 12px;
                  border-radius: 5px;
                  text-align: left;
                }
              }
            }
          }
        }
        .footer {
          padding: 20px 0;
          border-top: 1px solid #e5e5e5;
          overflow: hidden;
          .el-button {
            margin-top: 10px;
            float: right;
            width: 100px;
          }
        }
      }
    }
  }
}
</style>
