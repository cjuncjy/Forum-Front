<template>
  <header>
    <div class="left">
      <div class="logo">
        <img src="../../assets/steps.jpg" alt="" />
      </div>
      <div class="title">studyForYourself</div>
    </div>
    <div class="right">
      <Nav></Nav>
    </div>
  </header>
</template>

<script>
import Nav from "./components/Nav";
export default {
  components: {
    Nav
  },
  mounted() {
    // 接受后台传过来的数据
    this.sockets.subscribe("message", data => {
      // this.msg = data.message;
      console.log(data);
      this.$store.dispatch("user/myMessage", data);
    });
  }
};
</script>

<style lang="scss" scoped>
header {
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 60px;
  background-color: hsla(0, 0%, 100%, 0.9);
  border-bottom: 1px solid #f0f0f0;
  .left {
    display: flex;
    flex-direction: row;
    .logo {
      img {
        height: 50px;
        padding: 5px 0;
      }
    }
    .title {
      margin-left: 20px;
      font-size: 16px;
      line-height: 60px;
      color: #50a6fc;
    }
  }
}
</style>
