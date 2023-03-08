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
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd"
              >新增
            </el-button>
            <el-button
              :disabled="multiple"
              icon="el-icon-delete"
              type="danger"
              style="margin-left: 15px"
              @click="handleDelete"
              >删除
            </el-button>
          </el-form-item>

          <el-form-item prop="keywords">
            <el-input
              v-model="queryParams.courseName"
              clearable
              placeholder="课程名称"
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="courseType" style="margin-left: 10px">
            <el-select
              v-model="queryParams.courseType"
              clearable
              size="small"
              style="width: 150px"
              placeholder="全部"
            >
              <el-option label="团课" value="1" />
              <el-option label="私教" value="2" />
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
          <el-table-column
            align="center"
            label="课程编号"
            prop="id"
            width="50"
          />
          <el-table-column
            align="center"
            label="课程名称"
            prop="courseName"
            width="80"
          />
          <el-table-column
            align="center"
            label="课程简介"
            prop="courseDesc"
          />
          <el-table-column
            align="center"
            label="课程引入时间"
            prop="stroeTime"
            width="160"
          />
          <el-table-column
            align="center"
            label="课程类型"
            prop="courseType"
            width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.courseType === 1">团课</span>
              <span v-if="scope.row.courseType === 2">私教</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="课程价格"
            prop="price"
            width="90"
          />
          <el-table-column
            align="center"
            label="场馆名称"
            prop="placeName"
            width="120"
          />
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                circle
                plain
                @click.stop="handleUpdate(scope.row)"
              />
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

    <!-- 新增或修改参数配置对话框 -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="800px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="课程简介" prop="courseDesc">
          <el-input
            v-model="form.courseDesc"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 8 }"
            placeholder="请输入课程简介"
          />
        </el-form-item>
        <el-form-item label="课程引入时间" prop="stroeTime">
          <el-date-picker v-model="form.stroeTime" type="date" placeholder="请选择课程引入时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="课程类型" prop="courseType">
          <el-select
            v-model="form.courseType"
            clearable
            size="small"
            placeholder="请选择"
          >
            <el-option label="团课" :value="1" />
            <el-option label="私教" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入课程价格" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="dialog.visible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  del,
  listCourseWithPage,
  add,
  update,
} from "@/api/course/course";
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
        courseName: undefined,
        pageNum: 1,
        pageSize: 5,
        courseType: undefined,
        placeId: this.$store.state.user.placeId,
      },
      pagination: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      pageList: [],
      dialog: {
        title: undefined,
        visible: false,
      },
      // 表单参数
      form: {
        id: undefined,
        courseName: undefined,
        courseDesc: undefined,
        stroeTime: undefined,
        courseType: undefined,
        price: undefined,
        placeId: this.$store.state.user.placeId
      },
      // 表单校验
      rules: {
        courseName: [
          { required: true, message: "课程名不能为空", trigger: "blur" },
        ],
        courseDesc: [
          { required: true, message: "课程简介不能为空", trigger: "blur" },
        ],
        stroeTime: [
          { required: true, message: "课程引入时间不能为空", trigger: "blur" },
        ],
        courseType: [
          { required: true, message: "课程类型不能为空", trigger: "blur" },
        ],
        price: [
          { required: true, message: "价格不能为空", trigger: "blur" },
        ]
      },
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
      listCourseWithPage(this.queryParams).then((response) => {
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
        courseName: undefined,
        pageNum: 1,
        pageSize: 5,
        courseType: undefined,
        placeId: this.$store.state.user.placeId
      };
      this.handleQuery();
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleAdd() {
      this.resetForm();
      this.dialog = {
        title: "新增课程",
        visible: true,
      };
    },
    handleUpdate(row) {
      this.resetForm();
      this.dialog = {
        title: "修改课程",
        visible: true,
      };
      this.form = row;
    },
    handleSubmit: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const id = this.form.id;
          if (id !== undefined) {
            update(this.form.id, this.form).then(() => {
              this.$message.success("修改成功");
              this.dialog.visible = false;
              this.handleQuery();
            });
          } else {
            add(this.form).then(() => {
              this.$message.success("新增成功");
              this.dialog.visible = false;
              this.handleQuery();
            });
          }
        }
      });
    },
    handleDelete(row) {
      const ids = row.id || this.ids.join(',')
      this.$confirm("是否删除该课程?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return del(ids);
        })
        .then(() => {
          this.$message.success("删除成功");
          this.handleQuery();
        })
        .catch(() => this.$message.info("已取消删除"));
    },

    // 表单重置
    resetForm() {
      this.form = {
        id: undefined,
        courseName: undefined,
        courseDesc: undefined,
        stroeTime: undefined,
        courseType: undefined,
        price: undefined,
        placeId: this.$store.state.user.placeId,
      };
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
    },
  },
};
</script>
