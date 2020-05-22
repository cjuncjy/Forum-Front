<template>
  <div
    class="article-list-cell"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div class="content">
      <div class="title" @click="toDetails(articleInfo.id)">
        <h5>
          {{ articleInfo.title }}
        </h5>
      </div>
      <div class="tag">
        <span v-for="(item, index) in articleInfo.labelsName" :key="index">{{
          item
        }}</span>
      </div>
      <p class="desc">
        {{ articleInfo.summary }}
      </p>
      <div class="info">
        <span class="time mr10px">{{
          moment(articleInfo.createAt).format("YYYY-MM-DD HH:mm:ss")
        }}</span>
        <span class="read mr10px" style="margin-left:20px;"
          ><svg-icon icon-class="eye-open" style="margin-right:5px"></svg-icon
          >{{ articleInfo.views }} {{ $t("article.read") }}</span
        >
        <span class="comment mr10px"
          ><svg-icon icon-class="message" style="margin-right:5px"></svg-icon
          >{{ articleInfo.commentCount }} {{ $t("article.comment") }}</span
        >
        <span class="like mr10px"
          ><svg-icon icon-class="like" style="margin-right:5px"></svg-icon
          >{{ articleInfo.likeCount }} {{ $t("article.like") }}</span
        >
        <transition name="fade" v-if="canEdit">
          <div
            class="btn"
            style="margin-left: 10px;display: inline-block;"
            v-show="hover"
          >
            <el-button
              type="primary"
              size="small"
              @click="toEdit(articleInfo.id)"
              >修改</el-button
            >
            <el-button
              type="warning"
              size="small"
              @click="toDel(articleInfo.id)"
              >删除</el-button
            >
          </div>
        </transition>
      </div>
    </div>
    <div class="img">
      <div class="img-wrapper">
        <img :src="articleInfo.path" :alt="articleInfo.title" />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { delArticle } from "@/api/article";
export default {
  name: "ArticleList",
  data() {
    return {
      hover: false
    };
  },
  props: {
    articleInfo: {
      type: Object,
      default: () => {}
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    moment,
    toDetails(id) {
      this.$router.push({ name: "details", params: { id } });
    },
    toEdit(id) {
      this.$router.push({ name: "createArticle", query: { id } });
    },
    toDel(id) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 调用删除接口
          delArticle(id).then(res => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.$emit("delSuccess");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.article-list-cell {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  display: flex;
  .content {
    flex: 5;
    padding: 20px 20px 0 20px;
    .title {
      h5 {
        font-size: 20px;
        font-weight: 100;
        line-height: 24px;
        word-wrap: break-word;
        &:hover {
          text-decoration: underline;
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .tag {
      margin: 8px 0;
      span {
        display: inline-block;
        padding: 0 8px;
        margin: 2px 10px 2px 0;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border: 1px solid rgb(68, 100, 75);
        border-radius: 5px;
        cursor: pointer;
      }
    }
    .desc {
      font-size: 14px;
      line-height: 20px;
      min-height: 30px;
      font-weight: 200;
      color: #444;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .info {
      font-size: 14px;
      margin: 15px 0 20px;
      height: 45px;
      line-height: 45px;
      .mr10px {
        margin-right: 10px;
      }
    }
  }
  .img {
    flex: 2;

    .img-wrapper {
      margin-right: 10px;
      width: 95%;
      height: 100%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 100%;
        // height: 160px;
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
