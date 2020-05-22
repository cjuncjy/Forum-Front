<template>
  <div class="ordinary">
    <div class="sort-bar">
      <div class="content">
        <span class="sort-title">{{ $t("article.category") }}：</span>
        <span>
          <a
            :class="$route.name === 'articleAll' ? 'name active' : 'name'"
            @click="changeSort('all')"
            >{{ $t("article.all") }}</a
          >
          <a
            :class="$route.name === 'hot' ? 'name active' : 'name'"
            @click="changeSort('hot')"
            >{{ $t("article.hot") }}</a
          >
          <a
            v-for="(item, index) in sortList"
            :key="index"
            :class="
              $route.path === '/article/category/' + item.id
                ? 'name active'
                : 'name'
            "
            @click="changeSort('category', item.id)"
            >{{ $t(`category['${item.name}']`) }}</a
          >
        </span>
      </div>
    </div>
    <div class="title">
      <svg-icon icon-class="education" class="square" />
      <span class="main-title">{{ $t("article.article") }}</span
      ><span class="vertical-line"></span
      ><span class="sub-title">{{ computeTitle }} </span>
      <!-- <el-button type="text" class="title-btn">查看更多 >></el-button> -->
    </div>
    <div class="list-content" v-loading="loading">
      <div v-if="articleList.length > 0">
        <ArticleCell
          v-for="(item, index) in articleList"
          :key="index"
          :articleInfo="item"
        ></ArticleCell>
        <el-pagination
          style="float:right;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          background
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        >
        </el-pagination>
      </div>
      <div v-else class="none">
        <p>{{ $t("article.notFound") }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleAll, getArticleHot, getArticleBySort } from "@/api/article";
import ArticleCell from "@/components/ArticleCell";
export default {
  name: "ordinary",
  data() {
    return {
      sortList: this.$store.getters.sortList,
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      articleList: [],
      loading: false
    };
  },
  components: {
    ArticleCell
  },
  computed: {
    computeTitle() {
      const name = this.$route.name;
      if (name === "articleAll") {
        return this.$t("article.all");
      } else if (name === "hot") {
        return this.$t("article.hot");
      } else {
        const id = this.$route.params.id;
        if (this.sortList.find(item => parseInt(id) === item.id)) {
          const name = this.sortList.find(item => parseInt(id) === item.id)
            .name;
          return this.$t(`category['${name}']`);
        } else {
          return "";
        }
      }
    }
  },
  mounted() {
    this.getArticleList();
  },
  methods: {
    getArticleList() {
      // articleAll、hot、category
      this.loading = true;
      const name = this.$route.name;
      if (name === "articleAll") {
        getArticleAll({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          this.successDo(res);
          this.loading = false;
        });
      } else if (name === "hot") {
        getArticleHot({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          this.successDo(res);
          this.loading = false;
        });
      } else if (name === "category") {
        const id = this.$route.params.id;
        getArticleBySort({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          id
        }).then(res => {
          this.successDo(res);
          this.loading = false;
        });
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getArticleList();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getArticleList();
    },
    successDo(res) {
      if (res.code === 0) {
        this.articleList = res.data;
        this.articleList.forEach(item => {
          item.labelsName = item.labelsName.split(",");
          item.path = process.env.VUE_APP_IMG_URL + item.imgPath;
        });
        this.totalCount = res.totalCount;
      } else {
        this.$message.error(res.msg);
      }
    },
    changeSort(tag, sortId) {
      if (tag === "hot" || tag === "all") {
        this.$router.replace({ path: "/article/" + tag });
      } else {
        this.$router.replace("/article/category/" + sortId);
      }
      // this.$nextTick(() => {
      //   this.getArticleList();
      // });
    }
  },
  watch: {
    "$route.name"() {
      this.getArticleList();
    },
    "$route.params.id"() {
      this.getArticleList();
    }
  }
};
</script>

<style scoped lang="scss">
.ordinary {
  .sort-bar {
    .content {
      display: flex;
      padding: 10px 0;
      font-size: 15px;
      line-height: 22px;
      border-bottom: 1px solid #eee;
      .sort-title {
        display: inline-block;
        flex: 0 0 60px;
        width: 85px;
        font-size: 17px;
        line-height: 22px;
        padding: 4px 0;
        font-weight: 700;
        color: #333;
      }
      .name {
        display: inline-block;
        margin-right: 4px;
        padding: 3px 8px;
        margin-bottom: 2px;
        font-weight: 300;
        border-radius: 4px;
        color: #777;
        &:hover {
          color: #409eff;
          text-decoration: underline;
        }
      }
      .active {
        color: #fff;
        background: #555;
      }
    }
  }
  .title {
    margin: 20px 0;
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
    }
  }
  .list-content {
    .none {
      text-align: center;
      p {
        font-size: 18px;
        margin: 20px 0;
      }
    }
  }
}
</style>
