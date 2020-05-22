<template>
  <div class="tag-wall">
    <div class="panel">
      <h4 class="left">{{ $t("category.categoryWall") }}</h4>
      <div class="content">
        <div
          class="tag"
          v-for="(item, index) in list"
          :key="index"
          @click="toSort(item.id)"
        >
          <span class="dot" :style="'background:' + getRandomColor()"></span>
          <span class="text">
            {{ $t(`category['${item.sort_name}']`) }} [{{ item.count }}]
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSortNum } from "@/api/header";
export default {
  data() {
    return {
      list: []
    };
  },
  methods: {
    getList() {
      getSortNum().then(res => {
        if (res.code === 0) {
          this.list = res.data;
        }
      });
    },
    // 获取随机颜色
    getRandomColor() {
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += ((Math.random() * 16) | 0).toString(16);
      }
      return color;
    },
    toSort(id) {
      this.$router.push({ name: "category", params: { id } });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
.tag-wall {
  padding: 0 20px;
  .panel {
    position: relative;
    background: #fff;
    .left {
      text-align: left;
      border-left: 5px solid #409eff;
      border-right: none;
      font-size: 18px;
      padding: 13px 20px 13px;
      line-height: 18px;
    }
    .content {
      padding: 5px 20px;
      .tag {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        border: 1px solid #e8eaec;
        color: #515a6e;
        background: #fff;
        padding: 0 12px;
        margin-bottom: 10px;
        border-radius: 5px;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
        &:nth-child(n) {
          margin-left: 10px;
        }
        .dot {
          display: inline-block;
          width: 12px;
          height: 12px;
          margin-right: 8px;
          border-radius: 50%;
          background: #e8eaec;
          position: relative;
          top: 1px;
          // background: rgb(193, 247, 148);
        }
      }
    }
  }
}
</style>
