import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import user from "./modules/user";
import list from "./modules/list";
import app from "./modules/app";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    list,
    app
  },
  getters
});
