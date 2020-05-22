import Vue from "vue";
import VueRouter from "vue-router";
// import NProgress from "nprogress";
// NProgress.configure({ showSpinner: false }); // NProgress Configuration

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/home",
    component: () => import("../views/Home/index.vue"),
    name: "home",
    meta: {
      alive: true
    }
  },
  {
    path: "/tag",
    component: () => import("../views/Tag"),
    name: "tag",
    meta: {
      alive: true
    }
  },
  {
    path: "/questions",
    component: () => import("../views/Questions"),
    name: "questions",
    meta: {
      alive: true
    }
  },
  {
    path: "/ask-quest/:id?",
    component: () => import("../views/Questions/AskQuestion.vue"),
    name: "askQuest",
    meta: {
      alive: false
    }
  },
  {
    path: "/quest-details/:id",
    component: () => import("../views/Questions/QuestDetails.vue"),
    name: "questDetails",
    meta: {
      alive: false
    }
  },
  {
    path: "/article",
    name: "article",
    component: () => import("../views/Article/Article.vue"),
    children: [
      {
        path: "hot",
        component: () => import("../views/Article/components/ArticleList.vue"),
        name: "hot",
        meta: {
          alive: true
        }
      },
      // {
      //   path: "create",
      //   component: () =>
      //     import("../views/Article/components/ArticleCreate.vue"),
      //   name: "create",
      //   meta: {
      //     alive: true
      //   }
      // },
      {
        path: "details/:id",
        component: () =>
          import("../views/Article/components/ArticleDetails.vue"),
        name: "details",
        meta: {
          alive: false
        }
      },
      {
        path: "category/:id",
        component: () => import("../views/Article/components/ArticleList.vue"),
        name: "category",
        meta: {
          alive: false
        }
      },
      {
        path: "all",
        component: () => import("../views/Article/components/ArticleList.vue"),
        name: "articleAll",
        meta: {
          alive: true
        }
      }
    ]
  },
  {
    path: "/userCenter",
    name: "userCenter",
    component: () => import("../views/UserCenter"),
    children: [
      {
        path: "",
        redirect: "userinfo"
      },
      {
        path: "userinfo",
        name: "userinfo",
        component: () => import("../views/UserCenter/components/UserInfo"),
        meta: {
          alive: true
        }
      },
      {
        path: "createArticle",
        name: "createArticle",
        component: () => import("../views/UserCenter/components/CreateArticle"),
        meta: {
          alive: true
        }
      },
      {
        path: "myArticle",
        name: "myArticle",
        component: () => import("../views/UserCenter/components/myArticle"),
        meta: {
          alive: true
        }
      },
      {
        path: "myQuest",
        name: "myQuest",
        component: () => import("../views/UserCenter/components/myQuest"),
        meta: {
          alive: true
        }
      },
      {
        path: "myLike",
        name: "myLike",
        component: () => import("../views/UserCenter/components/myQuest"),
        meta: {
          alive: true
        }
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

// router.beforeEach(async (to, from, next) => {
//   // start progress bar
//   NProgress.start();

//   // set page title
//   document.title = to.meta.title;

//   next();
//   NProgress.done();
// });

router.afterEach((to, from) => {
  // NProgress.done();

  // 如果进入后的页面不想需要缓存，则设置scrollTop = 0
  if (to.meta.alive === false) {
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0; // document.body.scrollTop一定要加不然iOS上会失效，本人亲测，踩坑
    }, 10);
  }
});

export default router;
