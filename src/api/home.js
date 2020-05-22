import request from "@/utils/request";

export function getRandomArticles() {
  return request({
    url: "/home/randomArticle",
    method: "get"
  });
}

export function getTagWall() {
  return request({
    url: "/label/labelAll",
    method: "get"
  });
}
