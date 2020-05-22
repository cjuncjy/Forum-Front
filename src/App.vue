<template>
  <div id="app">
    <Header />
    <vue-particles
      class="particles"
      color="#999"
      linesColor="#999"
      shapeType="circle"
    ></vue-particles>
    <keep-alive>
      <router-view v-if="$route.meta.alive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.alive"></router-view>
    <BackToTop />
  </div>
</template>
<script>
import Header from "./views/Header";
import BackToTop from "@/components/BackToTop";
export default {
  components: {
    Header,
    BackToTop
  }
};
</script>
<style lang="scss" scoped>
#app {
  width: 100%;
  min-height: 100%;
  // min-height: 100vh;
  margin: 0 auto;
  background-color: #f4f5f5;
}
</style>
