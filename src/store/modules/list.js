import { getRandomArticles } from "@/api/home";

const state = {
  sortList: [],
  rdArticleList: []
};

const mutations = {
  SET_SORT_LIST: (state, sortList) => {
    state.sortList = sortList;
  },
  SET_RD_ARTICLE: (state, rdArticleList) => {
    state.rdArticleList = rdArticleList;
  }
};

const actions = {
  updateSortList({ commit }, sortList) {
    commit("SET_SORT_LIST", sortList);
  },
  updateRdArticle({ commit }, rdArticleList) {
    commit("SET_RD_ARTICLE", rdArticleList);
  },
  getRdArticle({ commit }) {
    getRandomArticles().then(res => {
      if (res.code === 0) {
        this.fileList = res.data;
        this.fileList.forEach(_ => {
          _.path = process.env.VUE_APP_IMG_URL + _.imgPath;
          _.labelsName = _.labelsName && _.labelsName.split(",");
        });
        commit("SET_RD_ARTICLE", this.fileList);
      }
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
