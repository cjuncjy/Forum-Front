<template>
  <div class="questions">
    <div class="wrapper w">
      <div class="container">
        <div class="sub-head">
          <div class="labels">
            <div class="label-list">
              <span class="label-item"
                ><a
                  href="javascript:;"
                  @click="getList()"
                  :class="!curLabelId ? 'active' : ''"
                  >{{ $t("quest.all") }}</a
                ></span
              >
              <span
                class="label-item"
                v-for="(item, index) in labelList"
                :key="index"
              >
                <a
                  href="javascript:;"
                  :class="curLabelId === item.id ? 'active' : ''"
                  @click="getList(item.id)"
                  >{{ $t(`label['${item.name}']`) }}</a
                >
              </span>
            </div>
          </div>
        </div>
        <div class="ask">
          <el-tabs type="card">
            <el-tab-pane :label="$t('quest.latest')">
              <QuestionList
                v-if="questList.length > 0"
                :questList="questList"
              />
              <div
                v-else
                style="text-align:center; font-size: 14px; margin:10px 0;"
              >
                没有找到符合条件的问答
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="等待回答">
              <QuestionList :questList="questList" />
            </el-tab-pane> -->
          </el-tabs>
          <div class="toAsk">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="toAsk"
              >{{ $t("quest.askQuestions") }}</el-button
            >
          </div>
        </div>
      </div>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <Login ref="login" v-if="loginVisible" />
    <!-- <Editor /> -->
  </div>
</template>

<script>
import QuestionList from "./components/QuestionList";
import { getQuestList, getLabelAll } from "@/api/question";
import Login from "@/views/Login";
export default {
  name: "Questions",
  components: {
    QuestionList,
    Login
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      questList: [],
      labelList: [],
      curLabelId: "",
      loginVisible: false
    };
  },
  methods: {
    toAsk() {
      let isLogin = this.$store.getters.isLogin;
      if (isLogin) {
        this.$router.push("/ask-quest");
      } else {
        this.loginVisible = true;
        this.$nextTick(() => {
          this.$refs.login.init();
        });
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList(this.curLabelId);
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getList(this.curLabelId);
    },
    getList(labelId) {
      this.curLabelId = labelId || "";
      getQuestList({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        labelId
      }).then(res => {
        if (res.code === 0) {
          this.questList = res.data;
          this.total = res.totalCount;
        }
      });
    },
    getLabelList() {
      getLabelAll().then(res => {
        if (res.code === 0) {
          this.labelList = res.data;
        }
      });
    }
  },
  mounted() {
    this.getLabelList();
  },
  activated() {
    this.getList();
  }
};
</script>

<style scoped lang="scss">
.questions {
  position: relative;
  .wrapper {
    padding-top: 0;
    background-color: #fff;
    .container {
      padding: 0 20px;
      .sub-head {
        height: 50px;
        line-height: 40px;
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1),
          0 1px rgba(0, 0, 0, 0.1);
        // background: #fafafa;
        .labels {
          .label-list {
            padding-left: 10px;
            height: 50px;
            white-space: nowrap;
            overflow-x: auto;
            &::-webkit-scrollbar {
              /*滚动条整体样式*/
              width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
              height: 7px;
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
            .label-item {
              display: inline-block;
              font-size: 14px;
              margin-right: 10px;
              a {
                &.active {
                  color: #409eff;
                }
                &:hover {
                  color: #409eff;
                }
              }
            }
          }
        }
      }
      .ask {
        position: relative;
        .el-tabs {
          margin-top: 20px;
        }
        .toAsk {
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }
  }
  .pagination {
    padding: 10px;
    text-align: right;
  }
}
</style>
