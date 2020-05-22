<template>
  <div class="userinfo">
    <div class="userform">
      <el-form
        :model="userForm"
        status-icon
        :rules="rules"
        ref="userForm"
        label-width="100px"
        class="demo-userForm"
      >
        <el-form-item :label="$t('userCenter.username')" prop="username">
          <el-input
            v-model="userForm.username"
            autocomplete="off"
            :readonly="!isEdit"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('userCenter.password')" prop="password">
          <el-input
            type="password"
            v-model="userForm.password"
            :readonly="!isEdit"
            autocomplete="off"
            :placeholder="$t('userCenter.pwPH')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('userCenter.userAvatar')" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            :headers="headers"
            :disabled="!isEdit"
            :on-success="uploadSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('userCenter.phone')" prop="phone">
          <el-input v-model="userForm.phone" :readonly="!isEdit"></el-input>
        </el-form-item>
        <el-form-item :label="$t('userCenter.email')" prop="email">
          <el-input v-model="userForm.email" :readonly="!isEdit"></el-input>
        </el-form-item>
        <el-form-item :label="$t('userCenter.description')" prop="description">
          <el-input
            v-model="userForm.description"
            :readonly="!isEdit"
            maxlength="20"
            :placeholder="$t('userCenter.descPH')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="isEdit = !isEdit">{{
            isEdit ? "查看个人信息" : "修改个人信息"
          }}</el-button>
          <el-button
            type="primary"
            @click="submitForm('userForm')"
            v-if="isEdit"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { updateUser } from "@/api/user";
import { getToken } from "@/utils/auth";
export default {
  name: "UserInfo",

  data() {
    return {
      userForm: {
        id: "",
        username: "",
        password: "",
        phone: "",
        email: "",
        description: "",
        avatarId: ""
      },
      imageUrl: this.$store.getters.userInfo.path,
      headers: {
        Authorization: "Bearer " + getToken()
      },
      action: process.env.VUE_APP_BASE_API + "/upload/img",
      isEdit: false,
      rules: {
        phone: [
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur"]
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.userForm);
          updateUser(this.userForm).then(res => {
            if (res.code === 0) {
              this.$message.success("修改成功");
              this.isEdit = !this.isEdit;
              this.$store.dispatch("user/getUserInfo");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    initForm() {
      const userinfo = this.$store.getters.userInfo;
      this.userForm.id = userinfo.id;
      this.userForm.username = userinfo.username;
      this.userForm.email = userinfo.email;
      this.userForm.phone = userinfo.phone;
      this.userForm.description = userinfo.description;
      this.userForm.avatarId = userinfo.avatar_id;
    },
    uploadSuccess(res, file) {
      if (res.code === 0) {
        this.imageUrl = process.env.VUE_APP_IMG_URL + res.data.path;
        this.userForm.avatarId = res.data.id;
      }
    }
  },
  mounted() {
    this.initForm();
  }
};
</script>

<style scoped lang="scss">
.userinfo ::v-deep {
  padding: 20px;
  padding-left: 0;
  .userform {
    .el-form {
      .el-input.is-disabled .el-input__inner {
        color: #333;
      }
    }
  }
}
</style>
