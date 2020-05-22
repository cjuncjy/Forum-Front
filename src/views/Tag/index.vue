<template>
  <div class="tag">
    <div class="main-inner">
      <div class="content-wrapper">
        <div class="content">
          <header>
            <h2>{{ $t("tagWall.title") }}</h2>
          </header>
          <div class="body">
            <div class="body-title">
              {{ $t("tagWall.allSum") }}: {{ this.list.length }}
            </div>
            <div class="body-content">
              <a href="#" v-for="(item, index) in list" :key="index">{{
                $t(`label['${item.name}']`)
              }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTagWall } from "@/api/home";
export default {
  data() {
    return {
      list: []
    };
  },
  methods: {
    getList() {
      getTagWall().then(res => {
        if (res.code === 0) {
          this.list = res.data;
        }
      });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
.tag {
  // height: 100vh;
  position: fixed;
  width: 100%;
  .main-inner {
    margin: 0 auto;
    padding-top: 50px;
    width: 800px;
    .content-wrapper {
      .content {
        header {
          h2 {
            text-align: center;
            font-size: 26px;
            font-weight: 500;
          }
        }
        .body {
          margin-top: 50px;
          .body-title {
            font-size: 18px;
            text-align: center;
          }
          .body-content {
            text-align: center;
            margin-top: 20px;
            a {
              display: inline-block;
              text-align: center;
              font-size: 18px;
              margin: 15px;
              border-bottom: 1px solid #cccccc;
              color: #666;
              &:hover {
                color: #000;
              }
            }
          }
        }
      }
    }
  }
}
</style>
