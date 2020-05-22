<template>
  <div class="article-details">
    <div class="content" v-loading="loading">
      <p class="title">
        {{ articleInfo.title }}
      </p>
      <div class="info">
        <div class="left">
          <el-popover
            placement="bottom"
            trigger="hover"
            v-if="articleInfo.userId !== $store.getters.userInfo.id"
          >
            <el-button style="width:100%" @click="letter">私信</el-button>
            <span class="author" slot="reference" style="cursor:pointer;"
              >{{ $t("article.author") }} / {{ articleInfo.username }}</span
            >
          </el-popover>
          <span class="author" style="cursor:pointer;" v-else
            >{{ $t("article.author") }} / {{ articleInfo.username }}</span
          >
          <span class="time"
            >{{ $t("article.posted") }} /
            {{
              moment(articleInfo.createAt).format("YYYY-MM-DD HH:mm:ss")
            }}</span
          >
        </div>
        <div class="right">
          <span class="read-num"
            ><svg-icon icon-class="eye-open"></svg-icon>{{ articleInfo.views }}
            {{ $t("article.read") }}</span
          >
          <span class="commend"
            ><svg-icon icon-class="message"></svg-icon
            >{{ articleInfo.commentCount }} {{ $t("article.comment") }}
          </span>
          <span class="like"
            ><svg-icon icon-class="like" />{{ articleInfo.likeCount }}
            {{ $t("article.like") }}</span
          >
        </div>
      </div>
      <p class="abstract">
        {{ $t("article.summary") }}：{{ articleInfo.summary }}
      </p>
      <div class="main-content">
        <article class="details">
          <!-- <RichEditor
            v-model="articleInfo.content"
            disabled
            :toolbar="[[]]"
            class="editor"
          ></RichEditor> -->
          <!-- <div id="editor"></div> -->
          <!-- <div class="ql-editor" v-html="articleInfo.content"></div> -->
          <div id="editor"></div>
        </article>
      </div>
      <div class="comment" id="toComment">
        <div class="write-comment">
          <div class="title">
            {{ $t("article.toComment") }}
          </div>
          <div class="container">
            <el-input
              v-model="comment"
              type="textarea"
              ref="textarea"
              show-word-limit
              :placeholder="$t('article.commentPH')"
              rows="4"
              @focus="isNeedLogin"
              maxlength="140"
              resize="none"
            ></el-input>
          </div>
          <div class="btn">
            <el-button type="primary" @click="toComment()">{{
              $t("article.submit")
            }}</el-button>
          </div>
        </div>

        <div class="comment-list">
          <div
            class="comment-cell"
            v-for="(item, index) in commentList"
            :key="index"
          >
            <div class="comment-main">
              <div class="main-avatar">
                <!-- <img src="" alt=""> -->
                <div class="noImg" v-if="!item.avatarPath">
                  <svg-icon icon-class="avatar_default"></svg-icon>
                </div>
                <div class="img" v-else>
                  <img :src="item.avatarPath" width="60" height="60" alt="" />
                </div>
              </div>
              <div class="content">
                <div class="username">
                  {{ item.fromUserName }}
                  <span style="color:#666" v-if="item.toUserId"
                    >{{ $t("article.reply") }}@</span
                  >
                  {{ item.toUserName }}
                  <span class="index">{{ index + 1 }}L</span>
                </div>
                <div class="text">{{ item.content }}</div>
                <div class="footer">
                  <span class="time">{{
                    moment(item.createAt).format("YYYY-MM-DD HH:mm:ss")
                  }}</span>
                  <span class="reply" @click="showReply(item)">
                    <svg-icon icon-class="message"></svg-icon>
                    {{ $t("article.reply") }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Login ref="login" v-if="loginVisible" />
    <!-- @loginSuccess="loginSuccess" -->

    <!-- 侧边栏 -->
    <div class="suspend">
      <div
        class="to-like"
        @click="toLike"
        :class="articleInfo.isLiked ? 'actived' : ''"
      >
        <svg-icon icon-class="like"></svg-icon>
      </div>
      <div class="to-comment">
        <a @click="toJump" style="color:#b2bac2">
          <el-badge :value="articleInfo.commentCount" class="item">
            <svg-icon icon-class="message"></svg-icon>
          </el-badge>
        </a>
      </div>
    </div>

    <!-- 回复别人的回复 -->
    <el-dialog
      :title="$t('article.commentReply')"
      :visible.sync="replyVisible"
      width="30%"
      :close-on-click-modal="false"
      class="replyDialog"
    >
      <div class="target">
        {{ $t("article.reply") }}@
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
          $t("article.cancle")
        }}</el-button>
        <el-button type="primary" @click="toComment(true)">{{
          $t("article.sure")
        }}</el-button>
      </span>
    </el-dialog>

    <PrivateLetters
      :fromUserId="$store.getters.userInfo.id"
      :fromUserName="$store.getters.userInfo.username"
      :toUserId="articleInfo.userId"
      :toUserName="articleInfo.username"
      v-if="letterVisible"
      ref="privateLetter"
    />
  </div>
</template>

<script>
import RichEditor from "@/components/RichEditor.vue";
import {
  getArticleDetails,
  postComment,
  getCommentList,
  toLikeArticle
} from "@/api/article";
import Login from "../../Login";
import moment from "moment";
import { jump } from "@/utils/common.js";
import PrivateLetters from "@/components/PrivateLetters";
// import Editor from "@toast-ui/editor";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import "codemirror/lib/codemirror.css"; // Editor's Dependency Style
import "@toast-ui/editor/dist/toastui-editor.css"; // Editor's Style
export default {
  data() {
    return {
      articleInfo: {},
      loading: false,
      loginVisible: false,
      comment: "",
      replyVisible: false,
      replyOther: "",
      commentList: [],
      curCommentItem: {},
      letterVisible: false
    };
  },
  components: {
    // RichEditor,
    Login,
    PrivateLetters
  },
  watch: {
    "$route.params.id"() {
      this.$init();
    }
  },
  methods: {
    moment,
    $init() {
      const id = this.$route.params.id;
      if (id) {
        this.loading = true;
        getArticleDetails(id).then(res => {
          if (res.code === 0) {
            this.articleInfo = res.data;
            // console.log(this.articleInfo.content);
            // this.articleInfo.content.replace(/<p><\/p>/g, "");
            this.getComment(this.articleInfo.id);
            this.loading = false;
            const viewer = new Viewer({
              el: document.querySelector("#editor"),
              viewer: true,
              initialValue: this.articleInfo.content
            });
            this.computedHeight();
            // TODO 昨天做到这里来了，接着要把前后台的Editor换掉
            // this.$nextTick(() => {
            //   // 这里是为了去除空的P标签
            //   this.clearEmptyP();
            // });
          }
        });
      } else {
        this.$message.error("id获取出错");
      }
    },
    isNeedLogin() {
      const login = this.$store.getters.isLogin;
      if (login) {
        return;
      }
      this.loginVisible = true;
      this.$nextTick(() => {
        this.$refs.login.init();
      });
    },
    // loginSuccess() {
    //   this.$refs.textarea.focus();
    // },
    // 评论
    toComment(replyUser) {
      let obj = {};
      if (replyUser) {
        obj = {
          toUserId: this.curCommentItem.fromUserId,
          articleId: this.articleInfo.id,
          content: this.replyOther
        };
      } else {
        obj = {
          articleId: this.articleInfo.id,
          content: this.comment
        };
      }
      if (!obj.content) {
        this.$message.error("评论内容不能为空");
        return;
      }
      postComment(obj).then(res => {
        if (res.code === 0) {
          this.$message.success("操作成功");
          this.comment = "";
          this.replyOther = "";
          this.replyVisible = false;
          // this.getComment(this.articleInfo.id);
          this.$init();
        }
      });
    },
    showReply(item) {
      const isLogin = this.$store.getters.isLogin;
      if (!isLogin) {
        this.loginVisible = true;
        this.$nextTick(() => {
          this.$refs.login.init();
        });
        return;
      }
      this.replyVisible = true;
      this.curCommentItem = item;
    },
    getComment(id) {
      getCommentList(id).then(res => {
        if (res.code === 0) {
          this.commentList = res.data;
          this.commentList.forEach(item => {
            if (item.avatarPath) {
              item.avatarPath = process.env.VUE_APP_IMG_URL + item.avatarPath;
            }
          });
          // console.log(this.commentList);
        }
      });
    },
    toLike() {
      const isLogin = this.$store.getters.isLogin;
      if (!isLogin) {
        this.loginVisible = true;
        this.$nextTick(() => {
          this.$refs.login.init();
        });
      } else {
        toLikeArticle(this.articleInfo.id).then(res => {
          if (res.code === 0) {
            this.$init();
          }
        });
      }
    },
    toJump() {
      jump("#toComment");
    },
    clearEmptyP() {
      this.$nextTick(() => {
        let b = document.querySelector(".ql-editor");
        // console.log(b.innerHTML);
        b.innerHTML = b.innerHTML.replace(
          /<([a-z]+?)(?:\s+?[^>]*?)?>\s*?<\/\1>/gi,
          ""
        );
        // b.innerHTML = b.innerHTML.replace(/<p>/g, "").replace(/<\/p>/g, "");
        this.computedHeight();
      });
    },
    computedHeight() {
      this.$nextTick(() => {
        let mainContent = document.querySelector(".main-content");
        this.$bus.$emit("initDir", mainContent.offsetHeight);
      });
    },
    letter() {
      const isLogin = this.$store.getters.isLogin;
      if (!isLogin) {
        this.loginVisible = true;
        this.$nextTick(() => {
          this.$refs.login.init();
        });
      } else {
        this.letterVisible = true;
        this.$nextTick(() => {
          this.$refs.privateLetter.$init();
        });
      }
    }
  },
  mounted() {
    this.$init();
  }
};
</script>

<style lang="scss" scoped>
.article-details ::v-deep {
  .content {
    padding: 20px;
    .title {
      font-size: 26px;
      line-height: 36px;
    }
    .info {
      margin-top: 10px;
      overflow: hidden;
      font-size: 14px;
      font-weight: 200;
      color: #444;
      line-height: 18px;
      .left {
        float: left;
        .time {
          margin-left: 20px;
        }
      }
      .right {
        float: right;
        .commend,
        .read-num {
          margin-right: 20px;
        }
      }
    }
    .abstract {
      padding: 20px;
      margin-top: 15px;
      line-height: 28px;
      color: #444;
      border: 1px dashed #eee;
      background: #eee;
      font-size: 14px;
    }
    .main-content {
      font-size: 20px;
      .details {
        text-align: left;
        .editor {
          border-bottom: 2px dashed #eee;
          // .ql-toolbar {
          //   display: none;
          // }
          // .ql-container.ql-snow {
          //   border: none;
          //   .ql-editor {
          //     padding: 12px 0;
          //   }
          // }
        }
        p {
          font-size: 16px;
          // line-height: 25px;
          // margin: 15px 0;
        }
      }
    }
    .comment {
      padding: 20px 10px;
      .write-comment {
        overflow: hidden;
        .title {
          font-size: 18px;
          text-align: center;
          margin-bottom: 10px;
        }
        .container {
          box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
        }
        .btn {
          float: right;
          margin-top: 10px;
        }
      }
      .comment-list {
        margin-top: 10px;
        .comment-cell {
          margin-top: 10px;
          border-bottom: 1px solid #eee;
          .comment-main {
            padding: 10px 0;
            display: flex;
            .main-avatar {
              flex: 0 0 70px;
              .noImg {
                width: 60px;
                height: 60px;
                background: #eee;
                font-size: 38px;
                line-height: 60px;
                text-align: center;
                border-radius: 100%;
              }
              .img {
                width: 60px;
                height: 60px;
                // background: #eee;
                img {
                  border-radius: 100%;
                }
              }
            }
            .content {
              flex: 1;
              padding: 0;
              // margin: 10px 0;
              .username {
                margin-bottom: 5px;
                line-height: 18px;
                color: #409eff;
                font-weight: 600;
                font-size: 16px;
                .index {
                  float: right;
                  font-size: 14px;
                  line-height: 18px;
                  color: #aaa;
                }
              }
              .text {
                font-size: 16px;
                line-height: 22px;
                margin: 10px 0;
              }
              .footer {
                margin-top: 8px;
                font-size: 14px;
                color: #888;
                font-weight: 300;
                .reply {
                  float: right;
                  cursor: pointer;
                  &:hover {
                    color: #409eff;
                    text-decoration: underline;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .suspend {
    position: fixed;
    left: 7%;
    top: 30%;
    div {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fff;
      margin-bottom: 20px;
      line-height: 40px;
      text-align: center;
      color: rgb(178, 186, 194);
      font-size: 16px;
      cursor: pointer;
      &:hover {
        color: rgb(138, 147, 160);
      }
    }
    .actived {
      color: #74ca46;
    }
    .el-badge__content {
      background-color: #aaa;
    }
  }
  .replyDialog {
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
</style>
