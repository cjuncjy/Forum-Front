const getters = {
  token: state => state.user.token,
  sortList: state => state.list.sortList,
  isLogin: state => !!state.user.token,
  userInfo: state => state.user.userInfo,
  privateLetter: state => state.user.privateLetter
  // rdArticleList: state => state.list.rdArticleList
};
export default getters;
