<template>
  <div class="components-container">
    <el-card class="box-card" shadow="always">
      <div class="clearfix" slot="header">
        <b>
          <svg-icon icon-class="edit" />
          会员类型列表</b
        >
      </div>
      <!-- 搜索表单 -->
      <el-form ref="queryForm" size="mini" :model="queryParams" :inline="true">
        <el-form-item>
          <el-input
            v-model="queryParams.keywords"
            placeholder="会员昵称/手机号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" @click="handleReset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table
        ref="Table"
        v-loading="loading"
        :data="tableList"
        border
        highlight-current-row
      >
        <el-table-column label="会员昵称" prop="nickName" />
        <el-table-column label="性别" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.gender === 0">未知</span>
            <span v-if="scope.row.gender === 1">男</span>
            <span v-if="scope.row.gender === 2">女</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="mobile" />
        <el-table-column label="会员类型" prop="memberTypeName" />
        <el-table-column label="开通时间" prop="startTime" />
        <el-table-column label="结束时间" prop="endTime" />
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              plain
              @click.stop="handleEdit(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="200">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="会员昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入会员昵称" />
        </el-form-item>
        <el-form-item label="会员类型" prop="memberCardId">
          <el-select
            v-model="form.memberCardId"
            clearable
            size="small"
            placeholder="请选择"
          >
            <el-option
              v-for="item in memberOptions"
              :label="item.membershipCardName.substring(0, 2) + '会员'"
              :key="item.membershipCardId"
              :value="item.membershipCardId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开通时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="date"
            placeholder="请选择开通时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="过期时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="date"
            placeholder="请选择会员过期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMemberTypeWithPage, update } from "@/api/member/MemberType";
import { listMemberCard } from "@/api/member/MemberCard";

export default {
  name: "MemberType",
  data() {
    return {
      loading: true,
      memberOptions: undefined,
      queryParams: {
        keywords: undefined,
        pageNum: 1,
        pageSize: 5,
        placeId: this.$store.state.user.placeId,
      },
      tableList: [],
      total: 0,
      dialog: {
        title: undefined,
        visible: false,
      },
      form: {
        memberId: undefined,
        nickName: undefined,
        memberCardId: undefined,
        startTime: undefined,
        endTime: undefined,
        memberTypeName: undefined,
        placeId: this.$store.state.user.placeId,
      },
      param: {
        name: undefined,
        placeId: this.$store.state.user.placeId,
      },
      rules: {
        nickName: [
          { required: true, message: "请输入会员昵称", trigger: "blur" },
        ],
        memberCardId: [
          { required: true, message: "请选择会员类型", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "请选择开通时间", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.handleQuery();
      this.getMemberCard();
    },
    handleQuery() {
      this.resetForm();
      listMemberTypeWithPage(this.queryParams).then((response) => {
        this.tableList = response.data;
        this.total = response.total;
        this.loading = false;
      });
    },
    getMemberCard() {
      listMemberCard(this.param).then((response) => {
        this.memberOptions = response.data;
      });
    },
    handleReset() {
      this.queryParams = {
        keywords: undefined,
        pageNum: 1,
        pageSize: 5,
      };
      this.handleQuery();
    },
    handleEdit(row) {
      this.resetForm();
      this.dialog = {
        title: "修改会员类型",
        visible: true,
      };
      // console.log(row)
      // this.form = JSON.parse(JSON.stringify(row));
      this.form = row;
      console.log(this.form);
    },
    handleSubmit: function () {
      console.log(this.form.memberCardId)
      this.memberOptions.some((item) => {
        if ((this.form.memberCardId == item.membershipCardId)) {   
          this.form.memberTypeName =item.membershipCardName.substring(0, 2) + "会员";
          return true;
        }
      });
      this.$refs['form'].validate((valid) => {
        
        if (valid) {
          console.log(this.form);
          update(this.form).then(() => {
            this.$message.success("修改成功");
            this.handleQuery();
          });
          this.closeDialog();
        }
      });
    },

    resetForm() {
      this.form = {
        memberId: undefined,
        nickName: undefined,
        memberCardId: undefined,
        startTime: undefined,
        endTime: undefined,
        memberTypeName: undefined,
        placeId: this.$store.state.user.placeId,
      };
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
    },
    closeDialog() {
      this.resetForm();
      this.dialog = {
        title: undefined,
        visible: false,
      };
    },
  },
};
</script>

<style scoped>
</style>
