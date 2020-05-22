<template>
  <div class="userCenter">
    <div class="wrapper w">
      <el-row>
        <el-col :span="6">
          <div class="inner">
            <div class="inner-brand">
              <div class="meta">
                <div class="meta-avatar">
                  <img :src="userInfo.path" alt="" />
                </div>
                <div class="brand">{{ userInfo.username }}</div>
                <h1 class="subtitle">{{ userInfo.description }}</h1>
              </div>
            </div>
            <div class="inner-nav">
              <el-menu
                :default-active="activeMenu"
                class="el-menu-vertical-demo"
                router
              >
                <el-submenu index="1">
                  <template slot="title">
                    <span>{{ $t("userCenter.myArticle") }}</span>
                  </template>
                  <el-menu-item index="/userCenter/createArticle">{{
                    $t("userCenter.postArticle")
                  }}</el-menu-item>
                  <el-menu-item index="/userCenter/myArticle">{{
                    $t("userCenter.articleList")
                  }}</el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                  <template slot="title">
                    <span>{{ $t("userCenter.myQuest") }}</span>
                  </template>
                  <el-menu-item index="/userCenter/myQuest">{{
                    $t("userCenter.iProposed")
                  }}</el-menu-item>
                  <el-menu-item index="/userCenter/myLike">{{
                    $t("userCenter.iliked")
                  }}</el-menu-item>
                </el-submenu>
                <el-menu-item index="/userCenter/userinfo">
                  <span slot="title">{{ $t("userCenter.userinfo") }}</span>
                </el-menu-item>
              </el-menu>
            </div>
          </div>
        </el-col>
        <el-col :span="17" style="margin-left:10px">
          <!-- right -->
          <router-view></router-view>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    activeMenu() {
      return this.$route.path;
    }
  }
};
</script>

<style lang="scss" scoped>
.userCenter {
  position: relative;
  box-sizing: border-box;
  min-height: 100%;
  .wrapper {
    padding-top: 0;
    .el-row {
      .el-col {
        background: #fff;
        .inner {
          .inner-brand {
            text-align: center;
            .meta {
              .meta-avatar {
                width: 260px;
                padding: 20px 20px;
                img {
                  border-radius: 5px;
                  width: 178px;
                  height: 178px;
                }
              }
              .brand {
                font-size: 24px;
                margin-bottom: 20px;
              }
              .subtitle {
                line-height: 20px;
                font-size: 16px;
                color: #999;
                padding: 0 10px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
              }
            }
          }
          .inner-nav {
            .el-menu ::v-deep {
              .el-menu-item,
              .el-submenu__title {
                font-size: 14px;
                height: 40px;
                line-height: 40px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
