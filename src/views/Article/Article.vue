<template>
  <div class="article">
    <div class="wrapper w">
      <!-- <Classification></Classification> -->
      <el-row>
        <el-col :span="16" class="col1">
          <router-view></router-view>
        </el-col>
        <el-col :span="7" style="margin-left:20px;z-index:111" class="col">
          <Recommend />
          <Directory v-if="$route.name === 'details'" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// import ArticleCell from "@/components/ArticleCell.vue";
import Recommend from "./components/Recommend";
import Directory from "./components/Directory";
export default {
  name: "Article",
  components: {
    // ArticleCell,
    Recommend,
    Directory
  },
  mounted() {
    this.$bus.$on("initDir", res => {
      let col = document.querySelector(".col");
      // console.log(res);
      col.style.height = res + "px";
    });
  }
};
</script>

<style scoped lang="scss">
.wrapper ::v-deep {
  height: 100%;
  .col1 {
    padding: 10px;
    background: #fff;
  }
}
</style>
