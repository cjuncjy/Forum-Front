import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./icons"; // svg-icon
import "@/assets/css/index.scss";
import VueParticles from "vue-particles";
import i18n from "./lang"; // internationalization
import Bus from "@/utils/eventBus";
import VueSocketIO from "vue-socket.io";
import moment from "moment";

Vue.use(
  new VueSocketIO({
    debug: true,
    // 服务器端地址
    connection: "http://localhost:3001"
  })
);
Vue.prototype.$bus = Bus;
Vue.prototype.$moment = moment;

Vue.use(VueParticles);
// Vue.use(ElementUI);
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
