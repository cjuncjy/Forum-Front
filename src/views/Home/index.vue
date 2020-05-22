<template>
  <div class="home">
    <!-- <Header></Header> -->

    <div class="wrapper w">
      <!-- <Classification></Classification> -->
      <el-row>
        <el-col :span="16" class="col1">
          <div class="title">
            <!-- <i class="el-icon-document "></i> -->
            <svg-icon icon-class="education" class="square" />
            <span class="main-title">{{ $t("home.articleList") }}</span
            ><span class="vertical-line"></span
            ><span class="sub-title">{{ $t("home.recommend") }} </span
            ><!---->
            <el-button type="text" class="title-btn" @click="seeMore"
              >{{ $t("home.seeMore") }} >></el-button
            >
            <span class="refresh" @click="homeInit(true)"
              ><svg-icon icon-class="refresh"></svg-icon
            ></span>
          </div>
          <div class="content" v-loading="loading">
            <div v-if="fileList.length > 0">
              <div v-for="(item, index) in fileList" :key="index">
                <ArticleCell :articleInfo="item"></ArticleCell>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <UserInfo v-if="$store.getters.isLogin"></UserInfo>
          <TagWall></TagWall>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import ArticleCell from "@/components/ArticleCell";
import UserInfo from "./components/UserInfo";
import TagWall from "./components/TagWall";
export default {
  name: "home",
  data() {
    return {
      fileList: [],
      loading: false
    };
  },

  components: {
    ArticleCell,
    UserInfo,
    TagWall
  },
  watch: {
    "$store.state.list.rdArticleList"(val) {
      if (val) {
        this.fileList = this.$store.state.list.rdArticleList;
      } else {
        this.homeInit();
      }
    }
  },
  methods: {
    seeMore() {
      this.$router.push("/article/all");
    },
    homeInit(needFresh) {
      if (needFresh || this.fileList.length === 0) {
        this.$store.dispatch("list/getRdArticle");
      }
    }
  },
  mounted() {
    this.homeInit();
  }
};
</script>

<style lang="scss" scoped>
.home {
  .wrapper ::v-deep {
    height: 100%;
    .col1 {
      padding: 10px;
      background: #fff;
      .title {
        margin-bottom: 20px;
        .square {
          text-align: center;
          vertical-align: middle;
          font-size: 22px;
        }
        .main-title {
          display: inline-block;
          vertical-align: middle;
          font-size: 22px;
          padding: 0 10px;
          color: #000;
        }
        .vertical-line {
          display: inline-block;
          height: 20px;
          width: 1px;
          background-color: #333;
          vertical-align: middle;
        }
        .sub-title {
          display: inline-block;
          vertical-align: middle;
          font-size: 18px;
          padding-left: 10px;
          color: #333;
        }
        .title-btn {
          vertical-align: middle;
          margin-left: 20px;
          &:hover {
            text-decoration: underline;
          }
        }
        .refresh {
          line-height: 40px;
          float: right;
          font-size: 26px;
          margin-right: 10px;
          font-weight: 400;
          cursor: pointer;
          &:hover {
            color: #409eff;
          }
        }
      }
    }
  }
}
</style>
