<template>
  <div class="myArticle" v-loading="loading">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane :label="$t('userCenter.myPost')" name="first">
        <ArticleCell
          v-for="(item, index) in articleList"
          :key="index"
          :articleInfo="item"
          @delSuccess="handleClick"
          :canEdit="true"
        ></ArticleCell>
      </el-tab-pane>
      <el-tab-pane :label="$t('userCenter.myLiked')" name="second">
        <ArticleCell
          v-for="(item, index) in articleList"
          :key="index"
          :articleInfo="item"
        ></ArticleCell>
      </el-tab-pane>
    </el-tabs>

    <el-pagination
      style="float:right; margin-bottom:20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      background
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    />
  </div>
</template>

<script>
import ArticleCell from "@/components/ArticleCell";
import { getMyArticle } from "@/api/user";
export default {
  name: "MyArticle",
  components: {
    ArticleCell
  },
  data() {
    return {
      pageSize: 10,
      pageIndex: 1,
      articleList: [],
      totalCount: 20,
      loading: false,
      activeName: "first"
    };
  },
  methods: {
    init(isMylike) {
      this.loading = true;
      console.log(isMylike);
      getMyArticle({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isLike: isMylike
      }).then(res => {
        this.loading = false;
        if (res.code === 0) {
          console.log(res);
          this.articleList = res.data;
          this.totalCount = res.totalCount;
          this.articleList.forEach(item => {
            item.path = process.env.VUE_APP_IMG_URL + item.imgPath;
            item.labelsName = item.labelsName && item.labelsName.split(",");
          });
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.init();
    },
    handleClick(tab, event) {
      console.log(this.activeName);
      if (this.activeName === "first") {
        this.init(false);
      } else {
        this.init(true);
      }
    }
  },
  mounted() {
    this.init(false);
  }
};
</script>

<style scoped lang="scss">
.myArticle {
  padding: 20px;
}
</style>
