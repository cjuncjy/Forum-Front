import request from "@/utils/request";

export function getSortList() {
  return request({
    url: "/sort/sortAll",
    method: "get"
  });
}

export function getSortNum() {
  return request({
    url: "/sort/sortNum",
    method: "get"
  });
}
