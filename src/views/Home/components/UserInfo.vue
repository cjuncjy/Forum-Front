<template>
  <div class="userinfo" style="margin-bottom: 15px;">
    <div class="info-wrapper">
      <div class="info-avatar">
        <div class="bg"></div>
        <img :src="userInfo.path" alt="" />
      </div>
      <div class="name">{{ userInfo.username }}</div>
      <div class="desc">{{ userInfo.description }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  }
};
</script>

<style lang="scss" scoped>
.userinfo {
  padding: 0 20px;
  .info-wrapper {
    text-align: center;
    width: 100%;
    background: #ffffff;
    position: relative;
    padding-bottom: 20px;

    .info-avatar {
      position: relative;
      height: 160px;
      width: 100%;
      text-align: center;
      .bg {
        height: 120px;
        width: 100%;
        text-align: center;
        background-color: #1fc8db;
        background-image: linear-gradient(-90deg, #29bdd9 0%, #276ace 100%);
      }
      img {
        position: absolute;
        top: 68px;
        left: 50%;
        margin-left: -47px;
        border-radius: 100%;
        width: 80px;
        height: 80px;
        border: 5px solid #ccc;
      }
    }
    .name {
      font-size: 22px;
      color: #333;
      line-height: 40px;
      font-weight: 700;
    }
    .desc {
      padding: 0 10px;
      font-size: 15px;
      color: #444;
      line-height: 30px;
      font-weight: 100;
    }
  }
}
</style>
