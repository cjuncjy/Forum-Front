<template>
  <div class="QuestDetails">
    <div class="wrapper w" id="top">
      <div class="container">
        <div class="author">
          <div class="username">{{ questInfo.username }}</div>
          <div class="time">
            {{ $t("quest.createAt") }}：{{
              moment(questInfo.createAt).format("YYYY-MM-DD HH:mm:ss")
            }}
          </div>
          <div class="time">
            {{ $t("quest.updateAt") }}：{{
              moment(questInfo.updateAt).format("YYYY-MM-DD HH:mm:ss")
            }}
          </div>
        </div>
        <div class="title">
          <h2>{{ questInfo.title }}</h2>
        </div>
        <div class="labels">
          <div class="list">
            <a
              href="javascript:;"
              class="badge-tag"
              v-for="(item, index) in questInfo.labels"
              :key="index"
              >{{ $t(`label['${item.labelName}']`) }}</a
            >
          </div>
          <div
            class="edit"
            v-if="curUserId === questInfo.userId && !questInfo.adoptedId"
          >
            <a href="javascript:;" @click="toEdit">{{ $t("quest.edit") }}</a>
          </div>
        </div>
        <div class="content">
          <div id="editor"></div>
        </div>
        <div class="footer">
          <div
            class="like"
            @click="toLike"
            :class="questInfo.isLiked ? 'actived' : ''"
          >
            <svg-icon icon-class="like"></svg-icon
            ><span>
              {{ questInfo.isLiked ? $t("quest.liked") : $t("quest.like") }}({{
                questInfo.likes
              }})</span
            >
          </div>
          <div class="comment" @click="toJump('#toComment')">
            <svg-icon icon-class="message"></svg-icon
            ><span> {{ $t("quest.comment") }}({{ commentList.length }})</span>
          </div>
          <div class="read">
            {{ $t("quest.readNum") }}：{{ questInfo.views }}
          </div>
        </div>
      </div>
    </div>
    <div class="comment-list w">
      <div class="comment-container">
        <div class="total">
          <h1>{{ commentList.length }} {{ $t("quest.answerNum") }}</h1>
        </div>
        <div class="card" v-for="(item, index) in commentList" :key="index">
          <div class="header">
            <div class="name">
              {{ item.fromUserName }}
              <span style="color:#000" v-if="item.toUserName">@</span>
              <span> {{ item.toUserName }}</span>
            </div>
            <div class="time">
              {{ moment(item.createAt).format("YYYY-MM-DD HH:mm:ss") }}
            </div>
          </div>
          <div class="content">
            <p style="line-height: 25px;">{{ item.content }}</p>
          </div>
          <div class="footer">
            <div
              class="comment"
              @click="showReply(item)"
              v-if="!questInfo.adoptedId"
            >
              <svg-icon icon-class="message"></svg-icon
              ><span> {{ $t("quest.comment") }}</span>
            </div>
            <div
              class="adopted"
              v-if="curUserId === questInfo.userId && !questInfo.adoptedId"
              @click="toAdopted(item.id)"
            >
              <svg-icon icon-class="right"></svg-icon>
              <span> {{ $t("quest.adopte") }}</span>
            </div>
            <div
              class="adopted adoptedActive"
              v-if="item.id === questInfo.adoptedId"
            >
              <svg-icon icon-class="right"></svg-icon>
              <span> {{ $t("quest.adopted") }}</span>
            </div>
          </div>
        </div>
        <div class="total w-answer">
          <h1>{{ $t("quest.writeComment") }}</h1>
        </div>
        <div class="answer-input" id="toComment">
          <el-input
            @focus="isNeedLogin"
            type="textarea"
            :disabled="!!questInfo.adoptedId"
            :placeholder="
              questInfo.adoptedId
                ? $t('quest.resolvedPH')
                : $t('quest.resolvePH')
            "
            resize="none"
            :autosize="{ minRows: 3, maxRows: 6 }"
            v-model="content"
          ></el-input>
          <el-button
            type="primary"
            size="small"
            @click="toComment()"
            :disabled="!!questInfo.adoptedId"
            >{{ $t("quest.submit") }}</el-button
          >
        </div>
      </div>
    </div>
    <Login ref="login" v-if="loginVisible" />
    <el-dialog
      :title="$t('quest.commentReply')"
      :visible.sync="replyVisible"
      width="30%"
      :close-on-click-modal="false"
      class="replyDialog"
    >
      <div class="target">
        {{ $t("quest.reply") }}@
        <span class="user">{{ curCommentItem.fromUserName }}</span
        >:
        <span class="content">{{ curCommentItem.content }}</span>
      </div>
      <div class="reply">
        <el-input
          type="textarea"
          v-model="replyOther"
          maxlength="140"
          show-word-limit
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="replyVisible = false">{{
          $t("quest.cancle")
        }}</el-button>
        <el-button type="primary" @click="toComment(true)">{{
          $t("quest.sure")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import "codemirror/lib/codemirror.css"; // codemirror
import "tui-editor/dist/tui-editor.css"; // editor ui
import "tui-editor/dist/tui-editor-contents.css"; // editor content
import Editor from "tui-editor";
import Login from "../Login";
import {
  getQuestDetails,
  questComment,
  getCommentById,
  toLikeQuest,
  questAdopted
} from "@/api/question";
import moment from "moment";
import { jump } from "@/utils/common.js";
export default {
  name: "QuestDetails",
  data() {
    return {
      questInfo: {},
      content: "",
      commentList: [],
      replyVisible: false,
      curCommentItem: {},
      replyOther: "",
      loginVisible: false
    };
  },
  components: {
    Login
  },
  computed: {
    curUserId() {
      return this.$store.getters.userInfo.id;
    }
  },
  methods: {
    moment,
    $init() {
      // this.initEditor();
      this.getDetails();
    },
    initEditor() {
      const viewer = Editor.factory({
        el: document.querySelector("#editor"),
        viewer: true,
        height: "500px",
        initialValue: this.questInfo.content
      });
    },
    getDetails(tag) {
      const id = this.$route.params.id;
      getQuestDetails(id).then(res => {
        if (res.code === 0) {
          this.questInfo = res.data;
          this.initEditor();
        }
      });
      if (!tag) {
        this.getCommentList(id);
      }
    },
    toEdit() {
      this.$router.push({
        name: "askQuest",
        params: { id: this.questInfo.id }
      });
    },
    toComment(replyUser) {
      if (!this.$store.getters.isLogin) {
        this.$message.warning("请先登录");
        return;
      }
      let obj = {};
      if (replyUser) {
        obj = {
          toUserId: this.curCommentItem.fromUserId,
          questionId: this.questInfo.id,
          content: this.replyOther
        };
      } else {
        obj = {
          questionId: this.questInfo.id,
          content: this.content
        };
      }
      questComment(obj).then(res => {
        if (res.code === 0) {
          this.$message.success("评论成功");
          this.content = "";
          this.replyOther = "";
          this.replyVisible = false;
          this.$init();
        }
      });
    },
    getCommentList(questionId) {
      getCommentById(questionId).then(res => {
        if (res.code === 0) {
          this.commentList = res.data;
        }
      });
    },
    toJump(target) {
      const top = document.querySelector("#top").offsetHeight;
      jump(target, top);
    },
    showReply(item) {
      if (!this.isNeedLogin()) {
        this.replyVisible = true;
        this.curCommentItem = item;
      }
    },
    toLike() {
      if (!this.isNeedLogin()) {
        toLikeQuest(this.questInfo.id).then(res => {
          if (res.code === 0) {
            this.getDetails(true);
          }
        });
      }
    },
    isNeedLogin() {
      const login = this.$store.getters.isLogin;
      if (login) {
        return false;
      } else {
        this.loginVisible = true;
        this.$nextTick(() => {
          this.$refs.login.init();
        });
        return true;
      }
    },
    toAdopted(commentId) {
      questAdopted(commentId, this.questInfo.id).then(res => {
        if (res.code === 0) {
          this.$message.success("操作成功");
          this.getDetails();
        }
      });
    }
  },
  mounted() {
    this.$init();
  }
};
</script>

<style scoped lang="scss">
.QuestDetails {
  padding-bottom: 20px;
  .wrapper {
    position: relative;
    padding: 30px;
    background: #fff;
    box-sizing: border-box;
    .container {
      .author {
        margin-bottom: 20px;
        .username {
          font-size: 18px;
          color: #409eff;
          display: inline-block;
        }
        .time {
          display: inline-block;
          margin-left: 20px;
          color: #999;
        }
      }
      .title {
        margin-bottom: 20px;
        h2 {
          font-size: 28px;
        }
      }
      .labels {
        margin-bottom: 20px;
        .list {
          display: inline-block;
        }
        .edit {
          display: inline-block;
          font-size: 13px;
          margin-left: 10px;
          a {
            color: #409eff;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
      .content {
        margin-bottom: 20px;
      }
    }
  }
  .comment-list {
    position: relative;
    margin-top: 20px;
    .comment-container {
      .total {
        font-size: 20px;
        margin: 10px 0;
      }
      .card {
        margin-top: 20px;
        padding: 20px;
        background: #fff;
        .header {
          display: flex;
          height: 30px;
          line-height: 30px;
          margin-bottom: 10px;
          .name {
            font-size: 16px;
            color: #409eff;
          }
          .time {
            margin-left: 20px;
            color: #999;
          }
        }
        .content {
          line-height: 15px;
          margin: 15px 0;
          font-size: 16px;
          margin-bottom: 20px;
        }
        .footer {
          display: flex;
          .like,
          .comment,
          .adopted {
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            padding: 5px 10px;
          }
          .adopted {
            color: #28a745;
            border: 1px solid #28a745;
            &:hover {
              color: #fff;
              background: #28a745;
            }
          }
          .comment {
            margin-left: 0;
          }
        }
      }
      .w-answer {
        margin-top: 20px;
      }
      .answer-input {
        overflow: hidden;
        background: #fff;
        padding: 20px;
        .el-button {
          margin-top: 10px;
          float: right;
        }
      }
    }
  }
  ::v-deep .replyDialog {
    .el-dialog__header {
      border-bottom: 1px solid #eee;
    }
    .target {
      .user {
        color: #409eff;
      }
      .content {
        padding: 0;
      }
    }
    .reply {
      margin-top: 10px;
    }
  }
}
.footer {
  font-size: 16px;
  .like,
  .comment,
  .adopted {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    padding: 5px 15px;
    border: 1px solid #409effee;
    color: #409effee;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      color: #fff;
      background: #409eff;
    }
    transition: all 0.3s;
  }
  .comment,
  .adopted {
    margin-left: 20px;
  }
  .read {
    display: inline-block;
    font-size: 14px;
    margin: 20px;
    color: #999;
  }
  .actived {
    background: #409eff;
    color: #fff;
  }
  .adoptedActive {
    margin-left: 0;
    background: #28a745;
    color: #fff !important;
  }
}
</style>
