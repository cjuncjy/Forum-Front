import request from "@/utils/request";

export function uploadImg(data) {
  return request({
    url: "/upload/img",
    method: "post",
    data
  });
}
