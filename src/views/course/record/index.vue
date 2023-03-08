<template>
  <div class="app-container">
    <el-row :gutter="40">
      <el-col :span="24" :xs="24">
        <el-form
          ref="queryForm"
          :inline="true"
          :model="queryParams"
          label-width="68px"
          size="small"
        >
          <el-form-item>
            <el-button
              :disabled="multiple"
              icon="el-icon-edit"
              type="success"
              style="margin-left: 15px"
              @click="handleUpdate"
              >发布签到
            </el-button>
          </el-form-item>

          <el-form-item prop="keywords">
            <el-input
              v-model="queryParams.keywords"
              clearable
              placeholder="课程名称/用户名/教练名"
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="state" style="margin-left: 10px">
            <el-select
              v-model="queryParams.state"
              clearable
              size="small"
              style="width: 150px"
              placeholder="全部"
            >
              <el-option label="未签到" value="1" />
              <el-option label="已签到" value="2" />
              <el-option label="已预约" value="3" />
              <el-option label="取消预约" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" @click="handleReset"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-table
          v-loading="loading"
          element-loading-text="数据载入中"
          element-loading-spinner="el-icon-loading"
          border
          :data="pageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="50" />
          <el-table-column align="center" label="编号" prop="id" width="50" />
          <el-table-column
            align="center"
            label="课程名称"
            prop="courseName"
            width="150"
          />
          <el-table-column
            align="center"
            label="用户昵称"
            prop="nickName"
            width="150"
          />
          <el-table-column
            align="center"
            label="教练名称"
            prop="coachName"
            width="150"
          />
          <el-table-column
            align="center"
            label="时间段"
            prop="rangeTime"
            width="160"
          />
          <el-table-column
            align="center"
            label="星期"
            prop="week"
            width="120"
          />
          <el-table-column align="center" label="状态" prop="state" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.state === 1">未签到</span>
              <span v-if="scope.row.state === 2">已签到</span>
              <span v-if="scope.row.state === 3">已预约</span>
              <span v-if="scope.row.state === 4">取消预约</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作时间"
            prop="operationTime"
            width="200"
          />
          <el-table-column align="center" label="操作" >
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                circle
                plain
                @click.stop="handleDelete(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="pagination.total > 0"
          :limit.sync="pagination.pageSize"
          :page.sync="pagination.pageNum"
          :total="pagination.total"
          @pagination="handleQuery"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listCourseStateWithPage,update,del } from "@/api/course/CourseState";
import { mapGetters } from "vuex";

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
      queryParams: {
        keywords: undefined,
        pageNum: 1,
        pageSize: 5,
        state: undefined,
        placeId: this.$store.state.user.placeId,
      },
      pagination: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      pageList: [],
    };
  },
  created() {
    this.loadData();
  },
  computed: {
    ...mapGetters(["placeId"]),
  },
  methods: {
    async loadData() {
      this.handleQuery();
    },
    handleQuery() {
      this.queryParams.pageNum = this.pagination.pageNum;
      this.queryParams.pageSize = this.pagination.pageSize;
      listCourseStateWithPage(this.queryParams).then((response) => {
        const { data, total } = response;
        this.pageList = data;
        this.pagination.total = total;
        this.loading = false;
      });
    },
    handleReset() {
      this.pagination = {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      };
      this.queryParams = {
        keywords: undefined,
        pageNum: 1,
        pageSize: 5,
        state: undefined,
        placeId: this.$store.state.user.placeId,
      };
      this.handleQuery();
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleDelete(row) {
        del(row.id).then(response=> {
            this.$message.success("删除成功");
            this.handleQuery();
        })
    },
    handleUpdate() {
      const ids = this.ids.join(",");
      var enable = true
      this.pageList.some((element) => {
        if (ids.indexOf(element.id)) {
          if (element.state != 3) {
              enable = false
            return true;
          }
        }
      });
      if(!enable) {
          this.$message.error("发布失败，请选择状态全为已预约的课程记录");
      } else {
          update(ids,1).then(response=> {
               if(response.code == "00000") {
                   this.$message.success("发布成功");
               } else {
                   this.$message.error("发布失败");
               }
               this.handleQuery();
          })    
      }
    },
  },
};
</script>
