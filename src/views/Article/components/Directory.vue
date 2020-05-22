<template>
  <!-- 目录 -->
  <div class="directory">
    <h1 class="title">目录</h1>
    <div class="dir-content">
      <div v-for="(item, index) in cateLog" :key="index" class="parent">
        <a href="javascript:;" @click="to(item.target)" class="first hover">{{
          item.name
        }}</a>
        <div
          v-for="(item2, index2) in item.childHeaders"
          :key="index2"
          class="child"
        >
          <a
            href="javascript:;"
            class="second hover"
            @click="to(item2.target)"
            >{{ item2.name }}</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Directory",
  data() {
    return {
      cateLog: []
    };
  },
  methods: {
    $init() {
      let ele = document.querySelector(".tui-editor-contents");
      let nodes = ele.children;
      nodes = Array.prototype.slice.call(nodes);
      let catalog = [];
      if (this.hasH1(nodes)) {
        catalog = this.details("h1-h2", nodes);
      } else if (this.hasH2(nodes)) {
        catalog = this.details("h2-h3", nodes);
      } else {
        catalog = this.details("h3-h4", nodes);
      }
      this.cateLog = catalog;
    },
    to(target) {
      document.querySelector("#" + target).scrollIntoView({
        behavior: "smooth"
      });
    },
    hasH1(nodes) {
      for (let i = 0; i < nodes.length; i++) {
        const ele = nodes[i];
        if (ele.nodeName === "H1") {
          return true;
        }
      }
      return false;
    },
    hasH2(nodes) {
      for (let i = 0; i < nodes.length; i++) {
        const ele = nodes[i];
        if (ele.nodeName === "H2") {
          return true;
        }
      }
      return false;
    },
    details(tag, nodes) {
      let catalog = [];
      let header = {};
      let tempObj = {
        "h1-h2": {
          nodeName1: "H1",
          nodeName2: "H2",
          preTag: "h1-",
          lastTag: "-h2-"
        },
        "h2-h3": {
          nodeName1: "H2",
          nodeName2: "H3",
          preTag: "h2-",
          lastTag: "-h3-"
        },
        "h3-h4": {
          nodeName1: "H3",
          nodeName2: "H4",
          preTag: "h3-",
          lastTag: "-h4-"
        }
      };
      let curObj = tempObj[tag];
      for (let i = 0; i < nodes.length; i++) {
        const curEle = nodes[i];
        if (curEle.nodeName === curObj.nodeName1) {
          curEle.id = curObj.preTag + catalog.length;
          // 记录此二级标题和其所有的三级子标题
          header = {
            name: curEle.innerText,
            target: curObj.preTag + catalog.length,
            childHeaders: []
          };
          catalog.push(header);
        } else if (curEle.nodeName === curObj.nodeName2) {
          if (!header.childHeaders) {
            header.childHeaders = [];
          }
          curEle.id =
            curObj.preTag +
            (catalog.length - 1) +
            curObj.lastTag +
            header.childHeaders.length;
          // 记录此三级标题到二级标题下
          header.childHeaders.push({
            name: curEle.innerText,
            target:
              curObj.preTag +
              (catalog.length - 1) +
              curObj.lastTag +
              header.childHeaders.length
          });
        }
      }
      return catalog;
    }
  },
  mounted() {
    this.$bus.$on("initDir", res => {
      this.$init();
    });
  }
};
</script>

<style scoped lang="scss">
.directory {
  position: -webkit-sticky;
  position: sticky;
  top: 30px;
  width: 350px;
  background: #fff;
  box-sizing: border-box;
  padding-bottom: 20px;
  margin-top: 10px;
  .title {
    font-size: 18px;
    padding-left: 10px;
    line-height: 40px;
    border-left: 5px solid #409eff;
  }
  .hover {
    &:hover {
      background: #e5e5e5;
    }
  }
  .dir-content {
    max-height: 80vh;
    overflow-y: auto;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 10px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;

      background-color: #409eff66;

      background-image: -webkit-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.2) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.2) 75%,
        transparent 75%,
        transparent
      );
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

      /*border-radius: 10px;*/

      background: #ededed;
    }
    .parent {
      font-size: 16px;
      line-height: 30px;
      .first {
        display: block;
        padding: 0 15px;
      }
      .child {
        .second {
          padding: 0 30px;
          display: block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
