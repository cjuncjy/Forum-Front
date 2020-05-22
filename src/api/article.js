import request from "@/utils/request";

export function getArticleDetails(id) {
  return request({
    url: "/article/details",
    method: "get",
    params: {
      id
    }
  });
}
export function getArticleAll(params) {
  return request({
    url: "/article/ordinary",
    method: "get",
    params
  });
}

export function getArticleHot(params) {
  return request({
    url: "/article/hot",
    method: "get",
    params
  });
}
export function getArticleBySort(params) {
  return request({
    url: "/article/getBySortId",
    method: "get",
    params
  });
}

export function postComment(data) {
  return request({
    url: "/article/comment",
    method: "post",
    data
  });
}

export function getCommentList(id) {
  return request({
    url: "/article/commentList",
    method: "get",
    params: {
      id
    }
  });
}

export function toLikeArticle(articleId) {
  return request({
    url: "/article/like",
    method: "post",
    params: {
      id: articleId
    }
  });
}

export function delArticle(articleId) {
  return request({
    url: "/article/delete",
    method: "post",
    params: {
      id: articleId
    }
  });
}
