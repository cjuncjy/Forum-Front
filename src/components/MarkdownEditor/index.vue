<template>
  <div>
    <div :id="id" class="my-tui-editor"></div>
    <input
      style="display: none"
      ref="files"
      @change="uploadFile"
      type="file"
      accept="image/*"
    />
  </div>
</template>
<script>
// deps for editor
import "codemirror/lib/codemirror.css"; // codemirror
import "tui-editor/dist/tui-editor.css"; // editor ui
import "tui-editor/dist/tui-editor-contents.css"; // editor content

import Editor from "tui-editor";
import defaultOptions from "./default-options";
//定义的上传地址
import { uploadImg } from "@/api/file";
export default {
  name: "MarddownEditor",
  props: {
    value: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      required: false,
      default() {
        return (
          "markdown-editor-" +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + "")
        );
      }
    },
    options: {
      type: Object,
      default() {
        return defaultOptions;
      }
    },
    mode: {
      type: String,
      default: "markdown"
    },
    height: {
      type: String,
      required: false,
      default: "300px"
    },
    language: {
      type: String,
      required: false,
      default: "zh" // https://github.com/nhnent/tui.editor/tree/master/src/js/langs
    }
  },
  data() {
    return {
      editor: null,
      token: ""
    };
  },
  computed: {
    editorOptions() {
      const options = Object.assign({}, defaultOptions, this.options);
      options.initialEditType = this.mode;
      options.height = this.height;
      options.language = this.language;
      return options;
    }
  },
  watch: {
    value(newValue, preValue) {
      if (newValue !== preValue && newValue !== this.editor.getValue()) {
        this.editor.setValue(newValue);
      }
    },
    language(val) {
      this.destroyEditor();
      this.initEditor();
    },
    height(newValue) {
      this.editor.height(newValue);
    },
    mode(newValue) {
      this.editor.changeMode(newValue);
    }
  },
  mounted() {
    this.initEditor();
  },
  destroyed() {
    this.destroyEditor();
  },
  methods: {
    initEditor() {
      this.editor = new Editor({
        el: document.getElementById(this.id),
        ...this.editorOptions
      });
      if (this.value) {
        this.editor.setValue(this.value);
      }
      this.editor.on("change", () => {
        this.$emit("input", this.editor.getValue());
      });
      /*
       * 添加自定义按钮
       * */
      //获取编辑器上的功能条
      let toolbar = this.editor.getUI().getToolbar();
      let fileDom = this.$refs.files;
      //添加事件
      this.editor.eventManager.addEventType("uploadEvent");
      this.editor.eventManager.listen("uploadEvent", () => {
        fileDom.click();
        // Do some other thing...
      });
      // 添加自定义按钮 第二个参数代表位置，不传默认放在最后
      toolbar.addButton(
        {
          name: "customize",
          className: "tui-image tui-toolbar-icons",
          event: "uploadEvent",
          tooltip: "插入图片"
        },
        13
      );
    },
    destroyEditor() {
      if (!this.editor) return;
      this.editor.off("change");
      this.editor.remove();
    },
    setValue(value) {
      this.editor.setValue(value);
    },
    getValue() {
      return this.editor.getValue();
    },
    setHtml(value) {
      this.editor.setHtml(value);
    },
    getHtml() {
      return this.editor.getHtml();
    },
    /*
     * 自定义上传图片处理
     * */
    uploadFile(e) {
      let target = e.target;
      let file = target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      uploadImg(formData)
        .then(res => {
          console.log(res);
          //上传成功地址拼接
          let imgUrl = process.env.VUE_APP_IMG_URL + res.data.path;
          this.addImgToMd(imgUrl);
        })
        .catch(error => {
          console.error(error.response);
        });

      target.value = ""; //这个地方清除一下不然会有问题
    },
    //添加图片到markdown
    addImgToMd(data) {
      let editor = this.editor.getCodeMirror();
      let editorHtml = this.editor.getCurrentModeEditor();
      let isMarkdownMode = this.editor.isMarkdownMode();
      if (isMarkdownMode) {
        editor.replaceSelection(`![img](${data})`);
      } else {
        let range = editorHtml.getRange();
        let img = document.createElement("img");
        img.src = `${data}`;
        img.alt = "img";
        range.insertNode(img);
      }
    }
  }
};
</script>
