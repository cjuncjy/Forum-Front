<template>
  <vue-editor
    :editorToolbar="toolbar"
    @imageAdded="uploadImage"
    class="rich-editor"
    useCustomImageHandler
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>
<script>
import { VueEditor } from "vue2-editor";

export default {
  data() {
    return {};
  },
  inheritAttrs: false,
  props: {
    toolbar: {
      type: Array,
      default: () => [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }], // 文本样式
        [{ size: [false, "small", "large", "huge"] }], // 字体大小
        ["bold", "italic", "underline", "strike"], // 字体样式
        ["", "center", "right", "justify"].map(align => ({ align })), // 对齐
        ["blockquote"], // 引用
        [{ list: "ordered" }, { list: "bullet" }], // 列表
        [{ indent: "-1" }, { indent: "+1" }], // 缩进
        [{ color: [] }, { background: [] }], // 颜色
        ["link", "image", "video"], // 多媒体
        ["clean"] // 清除样式
      ]
    }
  },
  components: {
    VueEditor
  },
  methods: {
    uploadImage: function(file, Editor, cursorLocation) {
      //上传图片操作
      let url = "";
      //把获取到的图片url 插入到鼠标所在位置 回显图片
      Editor.insertEmbed(cursorLocation, "image", url);
    }
  }
};
</script>
<style lang="scss" scoped>
.rich-editor {
  line-height: normal;

  //noinspection CssInvalidPseudoSelector
  ::v-deep .ql-snow {
    .ql-picker.ql-header {
      .ql-picker-item,
      .ql-picker-label {
        &:before {
          content: "正文";
        }

        &[data-value="1"]:before {
          content: "一级标题";
        }

        &[data-value="2"]:before {
          content: "二级标题";
        }

        &[data-value="3"]:before {
          content: "三级标题";
        }

        &[data-value="4"]:before {
          content: "四级标题";
        }

        &[data-value="5"]:before {
          content: "五级标题";
        }

        &[data-value="6"]:before {
          content: "六级标题";
        }
      }
    }

    .ql-picker.ql-size {
      .ql-picker-item,
      .ql-picker-label {
        &:before {
          content: "正常";
        }

        &[data-value="small"]:before {
          content: "小";
        }

        &[data-value="large"]:before {
          content: "大";
        }

        &[data-value="huge"]:before {
          content: "超大";
        }
      }
    }

    .ql-tooltip:before {
      content: "查看链接：";
    }

    a.ql-action:after {
      content: "编辑";
    }

    a.ql-remove:before {
      content: "移除";
    }

    .ql-tooltip[data-mode="link"]::before {
      content: "输入链接：";
    }

    .ql-tooltip.ql-editing a.ql-action:after {
      content: "保存";
    }
  }
}
</style>
