<template>
  <div class="myQuest">
    <div class="list">
      <QuestionList
        :questList="questList"
        :isCenter="computedTrue"
        @delSuccess="getMyQuestList"
      />
      <div class="empty" v-if="questList.length === 0">
        问答列表暂为空
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
      style="text-align:right;margin: 20px 10px"
    >
    </el-pagination>
  </div>
</template>

<script>
import QuestionList from "../../Questions/components/QuestionList";
import { getQuestList, getMyLikedList } from "@/api/user";
export default {
  name: "MyQuest",
  components: {
    QuestionList
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      questList: [],
      status: "0" //0表示是个人的 1表示是点赞的
    };
  },
  computed: {
    computedTrue() {
      return this.status === "0";
    }
  },
  watch: {
    "$route.name"(val) {
      if (val === "myQuest") {
        this.status = "0";
      } else {
        this.status = "1";
      }
      this.getMyQuestList();
    }
  },
  methods: {
    init() {
      this.getMyQuestList();
    },
    async getMyQuestList() {
      let result;
      if (this.status === "0") {
        result = await getQuestList({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          myList: true
        });
      } else {
        result = await getMyLikedList({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        });
      }
      if (result.code === 0) {
        this.questList = result.data;
        this.total = result.totalCount;
      }
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getMyQuestList();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getMyQuestList();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped lang="scss">
.myQuest {
  .list {
    margin-top: 10px;
    padding: 0 20px;
  }
  .empty {
    font-size: 18px;
    text-align: center;
    padding-top: 10px;
  }
}
</style>
