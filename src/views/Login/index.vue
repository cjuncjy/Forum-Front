<template>
  <el-dialog
    :title="status === 'login' ? '登录' : '注册'"
    :visible.sync="visible"
    width="400px"
    class="login"
    :close-on-click-modal="false"
  >
    <div class="panda">
      <img v-if="imgType === 0" src="@/assets/1.png" alt="" width="120" />
      <img v-else-if="imgType === 1" src="@/assets/3.png" alt="" width="120" />
      <img v-else src="@/assets/2.png" alt="" width="120" />
    </div>
    <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      class="loginForm"
      @keyup.enter.native="submit"
    >
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          placeholder="请输入密码"
          @focus="imgType = 1"
          @blur="imgType = 0"
          type="password"
        ></el-input>
      </el-form-item>
      <div v-if="status === 'register'">
        <el-form-item prop="phone">
          <el-input
            v-model="loginForm.phone"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            maxlength="6"
            placeholder="邮箱验证码"
            ><el-button
              slot="append"
              icon="el-icon-s-promotion"
              :disabled="this.count > 0"
              @click="sendCode"
              >{{
                this.count > 0 ? this.count + "s后再次发送" : "发送验证码"
              }}</el-button
            ></el-input
          >
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" style="width:100%;" @click="submit">{{
          status === "login" ? "登录" : "注册"
        }}</el-button>
      </el-form-item>
    </el-form>
    <div class="prompt-box" v-if="status === 'login'">
      没有账号？<span
        class="blue"
        @click="changeStatus"
        @mouseenter="imgType = 2"
        @mouseleave="imgType = 0"
        >注册</span
      >
    </div>
    <div class="prompt-box" v-else>
      <span class="blue" @click="changeStatus">已有账号登录</span>
    </div>
  </el-dialog>
</template>

<script>
import { getMailCode } from "@/api/user";
export default {
  name: "Login",
  data() {
    return {
      visible: false,
      loginForm: {
        username: "",
        password: "",
        phone: "",
        email: "",
        code: ""
      },
      count: 0,
      imgType: 0, // 图片类型
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ]
      },
      status: "login" // 登录或者注册
    };
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["loginForm"].resetFields();
      });
    },
    submit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (this.status === "login") {
            this.$store.dispatch("user/login", this.loginForm).then(() => {
              this.$message.success("登录成功");
              this.$store.dispatch("user/getUserInfo");
              this.$emit("loginSuccess");
              this.visible = false;
            });
          } else {
            this.$store.dispatch("user/regist", this.loginForm).then(result => {
              if (result.code === 0) {
                this.$message.success("注册成功");
                this.$refs.loginForm.resetFields();
                this.status = "login";
              }
            });
          }
        }
      });
    },
    changeStatus() {
      this.status = this.status === "login" ? "register" : "login";
      this.$refs.loginForm.resetFields();
    },
    sendCode() {
      const { email, username } = this.loginForm;
      if (!this.loginForm.email) {
        this.$message.warning("邮箱不能为空");
        return;
      }
      this.$refs.loginForm.validateField("email", msg => {
        if (!msg) {
          // 发验证码
          getMailCode({ username, email }).then(res => {
            console.log(res);
            if (res.code === 0) {
              // 成功
              this.count = 60;
              this.$message.success("邮件已发送，请注意查收");
              this.timer = setInterval(() => {
                this.count--;
                if (this.count === 0) {
                  clearInterval(this.timer);
                }
              }, 1000);
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.login ::v-deep {
  .el-dialog {
    .panda {
      position: absolute;
      left: 50%;
      margin-left: -60px;
      top: -80px;
    }
    .el-dialog__header {
      border-bottom: 1px solid #eee;
    }
    .prompt-box {
      font-size: 14px;
      color: #999;
      .blue {
        color: #409eff;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
