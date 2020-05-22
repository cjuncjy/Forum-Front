<template>
  <div class="recommend">
    <h4 class="title">{{ $t("article.recommendRead") }}</h4>
    <div class="content">
      <ul class="list">
        <li class="item" v-for="(item, index) in articleList" :key="index">
          <p class="title" @click="toDetails(item.id)">
            <span>{{ item.title }}</span>
          </p>
          <p class="info">
            <span class="time">{{
              moment(item.createAt).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
            <span class="like fr"
              ><svg-icon icon-class="like"></svg-icon>
              {{ item.likeCount }}</span
            >
            <span class="comments fr"
              ><svg-icon icon-class="message"></svg-icon>
              {{ item.commentCount }}</span
            >
            <span class="readings fr"
              ><svg-icon icon-class="eye-open"></svg-icon>
              {{ item.views }}</span
            >
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "recommend",
  data() {
    return {
      articleList: []
    };
  },
  watch: {
    "$store.state.list.rdArticleList"(val) {
      if (val) {
        this.articleList = this.$store.state.list.rdArticleList;
      } else {
        this.getList();
      }
    }
  },
  methods: {
    moment,
    getList() {
      if (this.articleList.length === 0) {
        this.$store.dispatch("list/getRdArticle");
      }
    },
    toDetails(id) {
      if (id !== this.$route.params.id) {
        this.$router.push({ name: "details", params: { id } });
      } else {
        this.$message.warning("已经是当前文章了");
      }
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped lang="scss">
.recommend {
  z-index: 111;
  background: #fff;
  h4 {
    text-align: left;
    border-left: 5px solid #409eff;
    border-right: none;
    font-size: 18px;
    padding: 13px 20px 13px;
    line-height: 18px;
    color: #333;
  }
  .content {
    padding: 5px 20px 15px;
    border-left: 1px solid #eee;
    .list {
      .item {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #eee;
        .title {
          text-align: left;
          font-size: 16px;
          line-height: 23px;
          margin-bottom: 5px;
          span {
            cursor: pointer;
            &:hover {
              color: #409eff;
              text-decoration: underline;
            }
          }
        }
        .info {
          span {
            margin: 5px 0 0;
            font-size: 13px;
            line-height: 18px;
            font-weight: 100;
            color: #888;
          }

          .fr {
            float: right;
            cursor: pointer;
            margin-left: 10px;
            &:hover {
              color: #409eff;
            }
          }
        }
      }
    }
  }
}
</style>
