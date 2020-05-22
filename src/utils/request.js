import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

// create an axios instance
const service = axios.create({
  // baseURL: "/api", // url = base url + request url
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers["Authorization"] = `Bearer ${getToken()}`;
    }
    return config;
  },
  error => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;

    if (res.code !== 0) {
      Message({
        message: res.msg || "请求失败",
        type: "error",
        duration: 5 * 1000
      });
      if (res.code === -2) {
        // to re-login

        MessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning"
          }
        ).then(() => {
          // store.dispatch("user/resetToken").then(() => {
          //   location.reload();
          // });
          console.log(
            "You have been logged out, you can cancel to stay on this page, or log in again",
            "Confirm logout"
          );
        });
      }
      return Promise.reject(new Error(res.msg || "请求失败"));
    } else {
      return res;
    }
  },
  error => {
    console.log("err, " + error); // for debug
    const { msg, code } = error.response.data;
    if (code === -2) {
      store.dispatch("user/logout");
      Message.error("登录信息已过期，请重新登录");
    } else {
      Message({
        message: msg || "请求失败",
        type: "error",
        duration: 5 * 1000
      });
    }

    return Promise.reject(error);
  }
);

export default service;
