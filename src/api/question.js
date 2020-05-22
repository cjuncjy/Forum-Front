import request from "@/utils/request";

export function getSortLabelTree() {
  return request({
    url: "/quest/sortLabelTree",
    method: "get"
  });
}

export function addQuestion(data) {
  return request({
    url: "/quest/createOrUpdateQuest",
    method: "post",
    data
  });
}

export function getQuestDetails(id) {
  return request({
    url: "/quest/details",
    method: "get",
    params: { id }
  });
}

export function questComment(data) {
  return request({
    url: "/quest/comment",
    method: "post",
    data
  });
}

export function getCommentById(id) {
  return request({
    url: "/quest/commentList",
    method: "get",
    params: { id }
  });
}

export function toLikeQuest(id) {
  return request({
    url: "/quest/like",
    method: "post",
    data: { id }
  });
}

export function getQuestList(params) {
  return request({
    url: "/quest/list",
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

export function questAdopted(commentId, questionId) {
  return request({
    url: "/quest/adopted",
    method: "post",
    params: { commentId, questionId }
  });
}

export function delQuest(id) {
  return request({
    url: "/quest/delete",
    method: "post",
    params: { id }
  });
}
