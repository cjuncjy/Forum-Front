<template>
  <div class="askQuest">
    <div class="wrapper w">
      <div class="header">
        <h2>提问</h2>
        <div class="submit">
          <el-button type="primary" size="small" @click="submit"
            >发布问题</el-button
          >
        </div>
      </div>
      <div class="qs-content">
        <div class="title">
          <el-input placeholder="请输入标题" v-model="form.title"></el-input>
        </div>
        <div class="add-tag">
          <a
            href="javascript:;"
            class="has-tag"
            v-for="(item, index) in hasTagList"
            :key="index"
          >
            {{ item.labelName }}
            <span class="del" @click="delHasTag(index)">✗</span>
          </a>
          <el-popover
            v-model="isShow"
            placement="right"
            trigger="click"
            width="400"
          >
            <el-tabs type="card">
              <el-tab-pane
                v-for="(item, index) in slTree"
                :key="index"
                :label="item.sortName"
              >
                <div v-if="item.children.length > 0">
                  <a
                    class="badge-tag"
                    href="javascript:;"
                    v-for="(item2, index2) in item.children"
                    :key="index2"
                    @click="addTo(item2)"
                    >{{ item2.labelName }}</a
                  >
                </div>
                <div v-else style="text-align:center">
                  该分类下暂无标签
                </div>
              </el-tab-pane>
            </el-tabs>
            <el-button
              ref="addTagBtn"
              slot="reference"
              icon="el-icon-plus"
              size="small"
              v-show="hasTagList.length < 5"
              >添加标签</el-button
            >
          </el-popover>
        </div>
        <div class="editor">
          <editor v-model="form.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Editor from "@/components/MarkdownEditor";
import { getSortLabelTree, addQuestion } from "@/api/question";
import { getQuestDetails } from "@/api/question";
export default {
  name: "AskQuest",
  data() {
    return {
      slTree: [],
      hasTagList: [],
      isShow: false,
      form: {
        title: "",
        content: ""
      },
      count: 0, // 修改次数
      finished: false
    };
  },
  components: {
    Editor
  },
  watch: {
    form: {
      handler(val) {
        if (val) {
          this.count++;
        }
      },
      deep: true
    },
    hasTagList: {
      handler(val) {
        if (val) {
          this.count++;
        }
      },
      deep: true
    }
  },
  methods: {
    $init() {
      if (this.$route.params.id) {
        this.$dataInit(this.$route.params.id);
      }
      getSortLabelTree().then(res => {
        if (res.code === 0) {
          this.slTree = res.data;
        }
      });

      // // 获取session中的数据
      if (sessionStorage.getItem("ask-save")) {
        this.form = JSON.parse(sessionStorage.getItem("ask-save"));
      }
      if (sessionStorage.getItem("ask-taglist")) {
        this.hasTagList = JSON.parse(sessionStorage.getItem("ask-taglist"));
      }
    },
    $dataInit(id) {
      getQuestDetails(id).then(res => {
        if (res.code === 0) {
          this.form.title = res.data.title;
          this.form.content = res.data.content;
          this.hasTagList = res.data.labels;
        }
      });
    },
    addTo(item) {
      if (this.hasTagList.map(_ => _.labelId).includes(item.labelId)) {
        this.$message.warning("该标签已添加过");
        return;
      }
      this.hasTagList.push(item);
      if (this.hasTagList.length >= 5) {
        this.isShow = false;
      }
      let popper = document.querySelector(".el-popover");
      popper.style.left = popper.offsetLeft + 90 + "px";
    },
    delHasTag(index) {
      this.hasTagList.splice(index, 1);
      let popper = document.querySelector(".el-popover");
      popper.style.left = popper.offsetLeft - 90 + "px";
    },
    submit() {
      if (this.validate()) {
        this.finished = true;
        let ids = this.hasTagList.map(_ => _.labelId);
        let obj = {
          title: this.form.title,
          content: this.form.content,
          labelIds: ids
        };
        if (this.$route.params.id) {
          // 这是修改
          obj.id = this.$route.params.id;
        }
        addQuestion(obj).then(res => {
          if (res.code === 0) {
            // 跳转到提问详情页
            this.$message.success("发布成功");
            this.$router.push({
              name: "questDetails",
              params: { id: res.data.insertId }
            });
          }
        });
      }
    },
    validate() {
      const { title, content } = this.form;
      if (!title) {
        this.$message.warning("标题不能为空");
      } else if (!content) {
        this.$message.warning("内容不能为空");
      } else if (this.hasTagList.length === 0) {
        this.$message.warning("标签不能为空");
      } else {
        return true;
      }
    }
  },
  mounted() {
    this.$init();
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // 如果是发布问题然后离开的，不需要提示
    if (this.finished) {
      next();
      this.finished = false;
      return;
    }
    if (this.count > 0) {
      const h = this.$createElement;
      this.$confirm(
        "检测到未保存的内容，是否在离开页面前保存修改？",
        "确认信息",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "保存并离开",
          cancelButtonText: "放弃并离开",
          message: h("div", null, [
            h(
              "span",
              { style: "color: #999" },
              "您在页面编辑了未保存，是否确认离开"
            ),
            h(
              "div",
              { style: "color: #e6a23c;margin-top: 15px" },
              "注意：点击取消之后编辑不会生效"
            )
          ])
        }
      )
        .then(() => {
          //  保存并离开
          // 保存到session中
          sessionStorage.setItem("ask-save", JSON.stringify(this.form));
          sessionStorage.setItem(
            "ask-taglist",
            JSON.stringify(this.hasTagList)
          );
          next();
        })
        .catch(action => {
          if (action === "cancel") {
            // 取消并离开
            sessionStorage.removeItem("ask-save");
            sessionStorage.removeItem("ask-taglist");
            next();
          }
        });
    } else {
      next();
    }
  }
};
</script>

<style lang="scss">
.askQuest {
  .wrapper {
    position: relative;
    padding-top: 0;
    background: #fff;
    .header {
      padding: 0 20px;
      position: relative;
      background: #fff;
      h2 {
        font-size: 24px;
        text-align: center;
        padding: 10px 0;
      }
      .submit {
        position: absolute;
        right: 20px;
        top: 7px;
      }
      margin-bottom: 20px;
    }
    .qs-content {
      padding: 0 20px;
      padding-bottom: 20px;
      .title {
        margin-bottom: 20px;
      }
      .add-tag {
        margin-bottom: 20px;
        .has-tag {
          display: inline-block;
          margin-right: 10px;
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          line-height: 1.5;
          border-radius: 0.2rem;
          color: #212529;
          background-color: #fff;
          border: 1px solid #dcdfe6;
          &:hover {
            color: #409eff;
            border-color: #c6e2ff;
            background-color: #ecf5ff;
          }
        }
      }
    }
  }
}
// .el-popover {
//   .el-tabs {
//     .el-tabs__content {
//       .el-tab-pane {
//       }
//     }
//   }
// }
.my-tui-editor {
  min-height: 500px;
  max-height: 500px;
  .te-preview {
    width: 600px !important;
  }
}
</style>
