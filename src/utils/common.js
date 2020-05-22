export function jump(el, top = 0) {
  let target = document.querySelector(el);
  // 获取需要滚动的距离
  let total = target.offsetTop + top;
  console.dir(target);
  // Chrome
  document.body.scrollTop = total;
  // Firefox
  document.documentElement.scrollTop = total;
  // Safari
  window.pageYOffset = total;
}
