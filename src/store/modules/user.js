// import { login, getInfo } from "@/api/user.js";
import { getToken, removeToken, setToken } from "@/utils/auth";
// import { resetRouter } from "../../router";
import { login, regist, getInfo } from "@/api/user";
import Vue from "vue";
const state = {
  token: getToken(),
  userInfo: {},
  privateLetter: []
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INFO: (state, userInfo) => {
    state.userInfo = userInfo;
  },
  SET_PRIVATE_MESSAGE: (state, data) => {
    // 先判断letter里面有没有当前人的信息了
    let letter = state.privateLetter;
    const result = letter.findIndex(
      item => item.fromUserId === data.fromUserId
    );
    console.log(result);
    if (result > -1) {
      letter[result].infoList.push({ time: data.time, content: data.content });
    } else {
      // 新的
      letter.push({
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        fromUserName: data.fromUserName,
        toUserName: data.toUserName,
        infoList: [{ time: data.time, content: data.content }]
      });
    }
    state.privateLetter = letter;
  },
  CLEAR_MSG: (state, fromUserId) => {
    let index = state.privateLetter.findIndex(
      item => item.fromUserId === fromUserId
    );
    console.log(index);
    state.privateLetter.splice(index, 1);
    console.log(state.privateLetter);
  },
  SEND_UNREAD_MSG: state => {
    // 把未读消息发到后台中
    const vm = new Vue();
    let letter = state.privateLetter;
    letter.forEach(item => {
      item.infoList.forEach(item2 => {
        let obj = {
          fromUserId: item.fromUserId,
          toUserId: item.toUserId,
          fromUserName: item.fromUserName,
          toUserName: item.toUserName,
          time: item2.time,
          content: item2.content
        };
        vm.$socket.emit("nextTimeRead", obj);
      });
    });
    // 清空当前未读的
    // state.privateLetter = [];
    state.privateLetter.splice(0, letter.length);
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response;
          commit("SET_TOKEN", data.token);
          setToken(data.token);
          // const vm = new Vue();
          // vm.$socket.connect();
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  regist({ commit }, form) {
    return new Promise((resolve, reject) => {
      regist(form)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(res => {
          res.data.path = process.env.VUE_APP_IMG_URL + res.data.path;
          commit("SET_INFO", res.data);

          // 这里连接上websocket
          const vm = new Vue();
          vm.$socket.emit("setName", { userId: res.data.id });
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      try {
        commit("SET_TOKEN", "");
        // commit("SET_ROLES", []);
        removeToken();
        // 如果用户退出时候还有未读消息
        commit("SEND_UNREAD_MSG");
        // location.reload();

        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      removeToken();
      resolve();
    });
  },

  // 存储我的私聊信息
  myMessage({ commit }, data) {
    commit("SET_PRIVATE_MESSAGE", data);
  },

  clearMsg({ commit }, fromUserId) {
    commit("CLEAR_MSG", fromUserId);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
