<template>
  <div class="question-list">
    <div
      class="list-item"
      v-for="(item, index) in questList"
      :key="index"
      @mouseenter="hoverIndex = index"
      @mouseleave="hoverIndex = -1"
    >
      <div class="qa-mark">
        <div class="views">
          {{ item.viewsCount }}
          <span>{{ $t("quest.views") }}</span>
        </div>
        <div class="answers" :class="item.adoptedId ? 'adopted' : ''">
          {{ item.commentCount }}
          <span>{{
            item.adoptedId ? $t("quest.resolve") : $t("quest.answer")
          }}</span>
        </div>
      </div>
      <div class="summary">
        <div class="author">
          <div class="username">{{ item.username }}</div>
          <div class="time">
            {{ moment(item.createAt).format("YYYY-MM-DD HH:mm:ss") }}
          </div>
        </div>
        <h2 class="title" @click="toSeeDetails(item.id)">{{ item.title }}</h2>
        <ul class="tag-list">
          <li
            class="tagPopup"
            v-for="(label, index) in item.labelNames"
            :key="index"
          >
            <a href="#">{{ label }}</a>
          </li>
        </ul>
        <div class="btn" v-show="hoverIndex === index" v-if="isCenter">
          <el-button type="text" size="small" @click="toEdit(item)"
            >修改</el-button
          >
          <el-button type="text" size="small" @click="toDel(item)"
            >删除</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { delQuest } from "@/api/question";
export default {
  name: "",
  data() {
    return {
      hoverIndex: -1
    };
  },
  props: {
    questList: {
      type: Array,
      default: () => []
    },
    isCenter: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    moment,
    toSeeDetails(id) {
      this.$router.push({ name: "questDetails", params: { id } });
    },
    toEdit(item) {
      // console.log(item);
      this.$router.push(`/ask-quest/${item.id}`);
    },
    toDel(item) {
      this.$confirm("此操作将永久删除该问题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 调用删除接口
          delQuest(item.id).then(res => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.$emit("delSuccess");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style scoped lang="scss">
.question-list {
  margin-bottom: 10px;
  .list-item {
    position: relative;
    margin: 0;
    border-bottom: 1px solid #eee;
    padding: 12px 0;
    .qa-mark {
      float: left;
      margin-right: 10px;
      font-size: 16px;
      text-align: center;
      line-height: 1.2;
      color: #666;
      padding-left: 10px;
      .adopted {
        background: #409eff;
        color: #fff !important;
      }
      .answers,
      .views {
        float: left;
        margin-right: 10px;
        font-size: 16px;
        text-align: center;
        line-height: 1.2;
        color: #666;
        width: 45px;
        height: 40px;
        padding-top: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
        span {
          display: block;
          font-size: 12px;
        }
      }
      .answers {
        margin-right: 0;
      }
    }
    .summary {
      overflow: auto;
      overflow-x: hidden;
      padding-top: 5px;
      .author {
        margin-bottom: 5px;
        color: #999;
        font-size: 14px;
        .time {
          margin-left: 10px;
        }
        div {
          display: inline-block;
          padding-left: 5px;
          padding-right: 5px;
        }
      }
      .title {
        display: inline-block;
        margin: 0 5px 0 0;
        font-size: 16px;
        height: 22px;
        line-height: 22px;
        font-weight: 400;
        padding-left: 5px;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
          color: #409eff;
        }
      }
      .tag-list {
        margin: 0;
        display: inline-block;
        .tagPopup {
          display: inline-block;
          margin-left: 10px;
          a {
            display: inline-block;
            padding: 0 6px;
            color: #409eff;
            background-color: #409eff22;
            height: 22px;
            line-height: 22px;
            font-weight: normal;
            font-size: 13px;
            text-align: center;
            &:hover {
              color: #fff;
              background: #409eff;
            }
          }
        }
      }
      .btn {
        position: absolute;
        right: 20px;
        bottom: 5px;
      }
    }
  }
}
</style>
