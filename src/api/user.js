import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/user/login",
    method: "post",
    data
  });
}

export function regist(data) {
  return request({
    url: "/user/registOrUpdate",
    method: "post",
    data
  });
}

export function getInfo() {
  return request({
    url: "/user/info",
    method: "get"
  });
}

export function updateUser(data) {
  return request({
    url: "/user/registOrUpdate",
    method: "post",
    data
  });
}

export function createOrUpdateArticle(data) {
  return request({
    url: "/user/createOrUpdateArticle",
    method: "post",
    data
  });
}

export function getMyArticle(params) {
  return request({
    url: "/user/myArticle",
    method: "get",
    params
  });
}

export function getLabelAll() {
  return request({
    url: "/label/labelAll",
    method: "get"
  });
}

export function getQuestList(params) {
  return request({
    url: "/quest/list",
    method: "get",
    params
  });
}

export function getMyLikedList(params) {
  return request({
    url: "/quest/myLiked",
    method: "get",
    params
  });
}

export function getMailCode(params) {
  return request({
    url: "/mail/sendEmail",
    method: "get",
    params
  });
}
