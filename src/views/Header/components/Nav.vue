<template>
  <nav>
    <el-menu
      class="nav-list"
      mode="horizontal"
      router
      :default-active="$route.path"
    >
      <lang-select
        class="set-language"
        style="line-height:60px;cursor:pointer;margin: 0 20px;"
      />

      <el-menu-item index="/home">{{ $t("nav.home") }}</el-menu-item>
      <el-menu-item index="/article/hot">{{ $t("nav.hot") }}</el-menu-item>
      <el-menu-item index="/questions">{{ $t("nav.quest") }}</el-menu-item>
      <el-submenu index="/article">
        <template slot="title">{{ $t("nav.category") }}</template>
        <el-menu-item
          v-for="(item, index) in sortList"
          :key="index"
          :index="'/article/category/' + item.id"
          >{{ $t(`category['${item.name}']`) }}</el-menu-item
        >
        <!-- <el-menu-item index="/article/category/2">JavaScript</el-menu-item> -->
      </el-submenu>
      <el-menu-item index="/tag">{{ $t("nav.tagWall") }}</el-menu-item>
      <el-submenu index="2">
        <template slot="title">{{ $t("nav.mime") }}</template>
        <div v-if="$store.getters.isLogin">
          <el-menu-item index="/usercenter">{{
            $t("nav.userCenter")
          }}</el-menu-item>

          <el-menu-item @click="logout">{{ $t("nav.logout") }}</el-menu-item>
        </div>
        <div v-else>
          <el-menu-item @click="login">{{ $t("nav.login") }}</el-menu-item>
        </div>
      </el-submenu>
      <el-dropdown trigger="hover" style="cursor:pointer">
        <span class="el-dropdown-link">
          {{ $t("nav.unreadMsg") }}
          <el-badge class="mark" is-dot v-if="list.length > 0" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            class="clearfix"
            v-for="(item, index) in list"
            :key="index"
          >
            <el-button type="text" @click="toReadMessage(item)"
              >{{ item.fromUserName }}的私信<el-badge
                class="mark"
                :value="item.infoList.length"
            /></el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>
    <Login ref="login" v-if="loginVisible" />
    <PrivateLetters
      :fromUserId="this.fromUserId"
      :toUserId="this.toUserId"
      :fromUserName="this.fromUserName"
      :toUserName="this.toUserName"
      v-if="letterVisible"
      ref="privateLetter"
    />
  </nav>
</template>

<script>
import { getSortList } from "@/api/header";
import Login from "@/views/Login";
import LangSelect from "@/components/LangSelect";
import PrivateLetters from "@/components/PrivateLetters";

export default {
  data() {
    return {
      sortList: [],
      loginVisible: false,
      list: this.$store.getters.privateLetter,
      toUserId: 0,
      fromUserId: 0,
      toUserName: "",
      fromUserName: "",
      letterVisible: false
    };
  },
  components: {
    Login,
    LangSelect,
    PrivateLetters
  },
  methods: {
    getSortList() {
      getSortList().then(res => {
        if (res.code === 0) {
          this.sortList = res.data;
          // 更新vuex中的sortList
          this.$store.dispatch("list/updateSortList", this.sortList);
        }
      });
    },
    login() {
      this.loginVisible = true;
      this.$nextTick(() => {
        this.$refs.login.init();
      });
    },
    logout() {
      this.$store.dispatch("user/logout").then(() => {
        this.$message.success("退出登录成功");
      });
    },
    getUserInfo() {
      const isLogin = this.$store.getters.isLogin;
      const userInfo = this.$store.getters.userInfo;
      if (isLogin && !userInfo.id) {
        this.$store.dispatch("user/getUserInfo");
      }
    },
    toReadMessage(item) {
      console.log(item);
      this.letterVisible = true;
      // 这里对象要记得反过来
      this.toUserId = item.fromUserId;
      this.fromUserId = item.toUserId;
      this.fromUserName = item.toUserName;
      this.toUserName = item.fromUserName;
      this.$nextTick(() => {
        this.$refs.privateLetter.$init(item.infoList);
      });
    }
  },
  mounted() {
    this.getSortList();
    this.getUserInfo();
    // window.onbeforeunload = e => {
    //   //刷新时弹出提示
    //   console.log(1);
    //   return "关闭提示";
    // };
  }
};
</script>

<style lang="scss" scoped>
nav ::v-deep {
  .nav-list {
    // height: 50px;
    .el-menu-item,
    .el-submenu .el-submenu__title {
      text-align: center;
      width: 100px;
      // padding: 0 20px;
      height: 60px;
      line-height: 60px;
    }

    // .list-item {
    //   float: left;
    //   height: 50px;
    //   width: 100px;
    //   line-height: 50px;
    //   cursor: pointer;
    //   text-align: center;
    //   a {
    //     font-size: 16px;
    //     color: #777;
    //   }
    //   &:hover {
    //     background: #eee;
    //   }
    //   &:hover a {
    //     color: #409eff;
    //   }
    // }
  }
}
// .el-menu--horizontal {
//   width: 80px;
// }
</style>
