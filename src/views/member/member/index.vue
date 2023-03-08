<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item>
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="multiple"
          @click="handleDelete"
          >删除</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryParams.nickName"
          placeholder="会员昵称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryParams.mobile"
          placeholder="会员号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="membershipCardId" style="margin-left: 10px">
        <el-select
          v-model="queryParams.membershipCardId"
          clearable
          size="small"
          style="width: 150px"
          placeholder="全部"
          v-if="this.$store.state.user.placeId != 1"
        >
          <el-option
            v-for="item in memberOptions"
            :label="item.membershipCardName.substring(0, 2) + '会员'"
            :key="item.membershipCardId"
            :value="item.membershipCardId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="pageList"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />

      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column prop="nickName" label="昵称" width="150" />
      <el-table-column label="性别" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.gender === 0">未知</span>
          <span v-if="scope.row.gender === 1">男</span>
          <span v-if="scope.row.gender === 2">女</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="120">
        <template slot-scope="scope">
          <el-popover placement="right" trigger="hover">
            <img :src="scope.row.avatarUrl" />
            <img
              slot="reference"
              :src="scope.row.avatarUrl"
              :alt="scope.row.avatarUrl"
              style="max-height: 60px; max-width: 60px"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号码" width="120" />
      <el-table-column prop="memberTypeName" label="会员类型" width="110" />
      <el-table-column prop="birthday" label="出生日期" width="180" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#cccccc"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column prop="gmtCreate" label="注册时间"/>

      <el-table-column label="账户余额" width="120">
        <template slot-scope="scope">
          {{ scope.row.balance / 100 }}
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="pagination.total > 0"
      :total="pagination.total"
      :page.sync="pagination.pageNum"
      :limit.sync="pagination.pageSize"
      @pagination="handleQuery"
    />
  </div>
</template>

<script>
import { listMembersWithPage } from "@/api/member/member.js";
import { listMemberCard } from "@/api/member/MemberCard";
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      memberOptions: undefined,
      queryParams: {
        nickName: undefined,
        mobile: undefined,
        membershipCardId: undefined,
        pageNum: 1,
        pageSize: 10,
        placeId: this.$store.state.user.placeId,
      },
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      pageList: [],
      nickName: undefined,
      param: {
        name: undefined,
        placeId: this.$store.state.user.placeId,
      },
    };
  },
  async created() {
    this.handleQuery();
    this.getMemberCard();
  },
  methods: {
    handleQuery() {
      this.queryParams.pageNum = this.pagination.pageNum;
      this.queryParams.pageSize = this.pagination.pageSize;
      listMembersWithPage(this.queryParams).then((response) => {
        this.pageList = response.data;
        this.pagination.total = response.total;
        this.loading = false;
      });
    },
    handleReset() {
      this.pagination = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      };
      this.queryParams = {
        nickName: undefined,
        mobile: undefined,
        membershipCardId: undefined,
        pageNum: 1,
        pageSize: 10,
        placeId: this.$store.state.user.placeId,
      };
      this.handleQuery();
    },
    getMemberCard() {
      listMemberCard(this.param).then((response) => {
        this.memberOptions = response.data;
      });
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    handleDelete(row) {
      const ids = row.id || this.ids.join(",");
      this.$confirm("确认删除已选中的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          del(ids).then(() => {
            this.$message.success("删除成功");
            this.handleQuery();
          });
        })
        .catch(() => this.$message.info("已取消删除"));
    },
    // 会员状态修改
    handleStatusChange(row) {
      const text = row.status === 1 ? "激活" : "禁用";
      this.$confirm("确认要" + text + row.nickName + "吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return patch(row.id, { status: row.status });
        })
        .then(() => {
          this.$message.success(text + "成功");
        })
        .catch(function () {
          row.status = row.status === 0 ? 1 : 0;
        });
    },
  },
};
</script>

<style scoped>
</style>
