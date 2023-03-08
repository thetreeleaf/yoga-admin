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
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd" v-if="this.$store.state.user.placeId == 1"
              >新增
            </el-button>
          </el-form-item>
          <el-form-item prop="keywords">
            <el-input
              v-model="queryParams.keywords"
              clearable
              placeholder="场馆名称/地址/手机号"
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
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
          <el-table-column type="index" label="序号" width="50" align="center" />
          <el-table-column
            align="center"
            label="教练名称"
            prop="coachName"
            width="100"
          />
          <el-table-column align="center" label="性别" prop="gender" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.gender===1">男</span>
              <span v-if="scope.row.gender===2">女</span>
              <span v-if="scope.row.gender===0">未知</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="教练工资"
            prop="coachSalary"
            width="100"
          />
          <el-table-column
            align="center"
            label="联系号码"
            prop="phone"
            width="120"
          />
          <el-table-column
            align="center"
            label="教练简介"
            prop="coachIntro"
          />
          <el-table-column
            align="center"
            label="所属场馆"
            prop="placeName"
            width="120"
          />
          <el-table-column
            align="center"
            label="入职时间"
            prop="gmtCreate"
            width="150"
          />
          <el-table-column
            align="center"
            label="离职时间"
            prop="gmtModified"
            width="150"
          />
          <el-table-column align="center" label="操作" width="150">
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
        <el-form-item label="教练名称" prop="coachName">
          <el-input v-model="form.coachName" placeholder="请输入教练名称" />
        </el-form-item>
         <el-form-item label="性别">
          <el-select v-model="form.gender" placeholder="请选择">
            <!-- <el-option label="未知" :value="0"/> -->
            <el-option label="男" :value="1"/>
            <el-option label="女" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="教练工资" prop="coachSalary">
          <el-input v-model="form.coachSalary" placeholder="请输入教练工资" />
        </el-form-item>
        <el-form-item label="联系号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系号码" />
        </el-form-item>
        <el-form-item label="教练简介" prop="coachIntro">
          <el-input
            v-model="form.coachIntro"
            maxlength="100"
            placeholder="请输入教练简介"
          />
        </el-form-item>
        <el-form-item label="入职时间" prop="gmtCreate">
          <el-date-picker v-model="form.gmtCreate" type="date" placeholder="请选择入职时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="离职时间" prop="gmtModified">
          <el-date-picker v-model="form.gmtModified" type="date" placeholder="请选择离职时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
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
import { getCoachPageList, add, update } from "@/api/system/coach";
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
        pageSize: 10,
        placeId: this.$store.state.user.placeId,
      },
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      pageList: [],
      dialog: {
        title: undefined,
        visible: false,
      },
      // 表单参数
      form: {
        coachId: undefined,
        coachName: undefined,
        coachSalary: 0,
        coachIntro: undefined,
        placeName: undefined,
        gmtCreate: undefined,
        gmtModified: undefined,
        phone: undefined,
        deleted: 0,
        gender: undefined
      },
      // 表单校验
      rules: {
        placeName: [
          { required: true, message: "场馆名不能为空", trigger: "blur" },
        ],
        coachName: [
          { required: true, message: "教练名字不能为空", trigger: "blur" },
        ],
        coachIntro: [
          { required: true, message: "教练简介不能为空", trigger: "blur" },
        ],
        coachSalary: [
          { required: true, message: "教练工资不能为空", trigger: "blur" },
        ],
        gmtCreate: [
          { required: true, message: "入职时间不能为空", trigger: "blur" },
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.loadData();
  },
   computed: {
    ...mapGetters([
      'placeId'
    ]),
  },
  methods: {
    async loadData() {
      this.handleQuery();
    },
    handleQuery() {
      this.queryParams.pageNum = this.pagination.pageNum;
      this.queryParams.pageSize = this.pagination.pageSize;
      console.log(this.queryParams);
      getCoachPageList(this.queryParams).then((response) => {
        const { data, total } = response;
        this.pageList = data;
        this.pagination.total = total;
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
        keywords: undefined,
        pageNum: 1,
        pageSize: 10,
        placeId: this.$store.state.user.placeId,
      };
      this.handleQuery();
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.coachId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleAdd() {
      this.resetForm();
      this.dialog = {
        title: "新增教练",
        visible: true,
      };
    },
    handleUpdate(row) {
      this.resetForm();
      this.dialog = {
        title: "修改教练",
        visible: true,
      };
      this.form = row;
   
    },
    handleSubmit: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const id = this.form.coachId;
          if (id !== undefined) {
            update(this.form).then(() => {
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
      this.$confirm("是否删除该教练?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          row.deleted = 1
          return update(row)
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
        coachId: undefined,
        coachName: undefined,
        coachSalary: 0,
        coachIntro: undefined,
        placeId: this.$store.state.user.placeId,
        gmtCreate: undefined,
        gmtModified: undefined,
        phone: undefined,
        deleted: 0,
        gender: undefined
      };
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
    },
  },
};
</script>
