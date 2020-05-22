<template>
  <div class="create">
    <div class="title">
      <h2 v-if="!this.form.id">{{ $t("userCenter.createArticle") }}</h2>
      <h2 v-else>{{ $t("userCenter.updateArticle") }}</h2>
    </div>
    <div class="content">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item :label="$t('userCenter.title')" prop="title">
          <el-input
            v-model="form.title"
            :placeholder="$t('userCenter.title')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('userCenter.category')" prop="sortId">
          <el-select
            v-model="form.sortId"
            :placeholder="$t('userCenter.category')"
            style="width:100%"
            filterable
          >
            <el-option
              v-for="item in sortList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('userCenter.label')" prop="labelIds">
          <el-select
            v-model="form.labelIds"
            :placeholder="$t('userCenter.label')"
            style="width:100%"
            filterable
            multiple
          >
            <el-option
              v-for="item in labelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('userCenter.summary')" prop="summary">
          <el-input
            v-model="form.summary"
            :placeholder="$t('userCenter.summary')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('userCenter.avatar')" prop="avatarId">
          <el-upload
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            :headers="headers"
            :on-success="uploadSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('userCenter.content')" prop="content">
          <!-- <RichEditor></RichEditor> -->
          <MarksownEditor v-model="form.content" class="createArticle" />
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" style="width: 100px" @click="submit">{{
            $t("userCenter.submit")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import MarksownEditor from "@/components/MarkdownEditor";
import { getSortList } from "@/api/header";
import { getToken } from "@/utils/auth";
import { createOrUpdateArticle, getLabelAll } from "@/api/user";
import { getArticleDetails } from "@/api/article";
export default {
  data() {
    return {
      form: {
        id: "",
        title: "",
        summary: "",
        content: "",
        avatarId: "",
        sortId: "",
        labelIds: []
      },
      labelList: [],
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        summary: [{ required: true, message: "请输入摘要", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        avatarId: [{ required: true, message: "请选择图片", trigger: "blur" }],
        sortId: [{ required: true, message: "请选择分类", trigger: "blur" }]
      },
      imageUrl: "",
      sortList: [],
      headers: {
        Authorization: "Bearer " + getToken()
      },
      action: process.env.VUE_APP_BASE_API + "/upload/img"
    };
  },
  components: {
    MarksownEditor
  },
  methods: {
    init() {
      getSortList().then(res => {
        if (res.code === 0) {
          this.sortList = res.data;
        }
      });
      getLabelAll().then(res => {
        if (res.code === 0) {
          this.labelList = res.data;
        }
      });
      if (this.$route.query.id) {
        // 修改
        this.form.id = this.$route.query.id;
        getArticleDetails(this.form.id).then(res => {
          console.log(res);
          if (res.code === 0) {
            this.form.content = res.data.content;
            this.form.title = res.data.title;
            this.form.sortId = res.data.sortId;
            this.form.avatarId = res.data.fileId;
            this.form.labelIds = res.data.labelIds
              .split(",")
              .map(_ => parseInt(_));
            this.form.summary = res.data.summary;
            this.imageUrl = process.env.VUE_APP_IMG_URL + res.data.imgPath;
          }
        });
      }
    },
    uploadSuccess(res, file) {
      console.log(res, file);
      if (res.code === 0) {
        this.imageUrl = process.env.VUE_APP_IMG_URL + res.data.path;
        this.form.avatarId = res.data.id;
      }
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // this.form.content = document.querySelector(
          //   ".tui-editor-contents"
          // ).innerHTML;
          // this.form.content = this.form.content.replace(
          //   /<([a-z]+?)(?:\s+?[^>]*?)?>\s*?<\/\1>/gi,
          //   ""
          // );
          // console.log(this.form.content);
          createOrUpdateArticle(this.form).then(res => {
            if (res.code === 0) {
              this.$message.success("发布成功");
              this.$router.push("myArticle");
            }
          });
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
.create {
  // padding-top: 20px;
  padding: 20px;
  width: 100%;
  background: #fff;
  .title {
    width: 100%;
    h2 {
      text-align: center;
      font-size: 20px;
      font-weight: 400;
      margin-bottom: 20px;
    }
  }
  .content ::v-deep {
    // width: 1200px;
    margin: 0 auto;
    padding-top: 20px;
  }
}
.createArticle {
  .tui-editor .te-preview-style-vertical .te-preview {
    width: 395px !important;
  }
}
</style>
