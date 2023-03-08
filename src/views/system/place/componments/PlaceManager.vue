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
          <!-- <el-form-item>
            <span>{{placeId}}</span>
          </el-form-item> -->
        </el-form>

        <el-table
          v-loading="loading"
          element-loading-text="数据载入中"
          element-loading-spinner="el-icon-loading"
          border
          :data="pageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" label="序号" width="150" align="center" />
          <el-table-column align="center" label="场馆图片" width="200">
            <template slot-scope="scope">
              <el-popover placement="right" trigger="hover">
                <img :src="scope.row.plcaePicture" />
                <img
                  slot="reference"
                  :src="scope.row.placePicture"
                  :alt="scope.row.placePicture"
                  style="max-height: 100px; max-width: 100px"
                />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="场馆名称"
            prop="placeName"
            width="150"
          />
          <el-table-column
            align="center"
            label="场馆地址"
            prop="address"
          />
          <el-table-column
            align="center"
            label="联系号码"
            prop="phone"
            width="200"
          />
          <el-table-column align="center" label="操作" width="210">
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
        <el-form-item label="场馆名称" prop="placeName">
          <el-input v-model="form.placeName" placeholder="请输入场馆名称" />
        </el-form-item>
        <el-form-item label="场馆图片" prop="placePicture">
          <el-upload
            class="avatar-uploader"
            :action="qiniuDomain"
            :http-request="upLoadToQiniu"
            :show-file-list="false"
            list-type="picture"
            :before-upload="beforeUpload"
          >
            <img
              v-if="form.placePicture"
              :src="form.placePicture"
              style="width:100px; hight:100px"
              class="avatar"
            />
            <el-button v-else type="primary" icon="el-icon-upload">上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="场馆地址" prop="address">
          <el-input
            v-model="form.address"
            maxlength="20  "
            placeholder="请输入场馆地址"
          />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input
            v-model="form.phone"
            maxlength="50"
            placeholder="请输入联系电话"
          />
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
  uploadImg,
  getPlacePageList,
  add,
  update,
} from "@/api/system/place";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      // 实名认证后创建的存储空间对应的上传地址(华东，华南等等不一样：https://developer.qiniu.com/kodo/manual/1671/region-endpoint)
      qiniuDomain: "https://upload-z2.qiniup.com", // 创建成功后官方随机分配的公开图片地址前缀，即上传成功后对应的公用图片地址前
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
        id: undefined,
        placePicture: undefined,
      },
      // 表单校验
      rules: {
        placeName: [
          { required: true, message: "场馆名不能为空", trigger: "blur" },
        ],
        placePicture: [
          { required: true, message: "场馆图片不能为空", trigger: "blur" },
        ],
        address: [
          { required: true, message: "场馆地址不能为空", trigger: "blur" },
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
    async upLoadToQiniu(req) {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      let fileType = "";
      if (req.file.type === "image/png") {
        fileType = "png";
      } else {
        fileType = "jpg";
      }
      var formData = new FormData();
      formData.append("image", req.file);
      uploadImg(formData).then((response) => {
        this.form.placePicture = response.data;
        this.$forceUpdate();
        console.log(this.form.placePicture);
        this.handleQuery();
      });
    },
    beforeUpload(file) {
      // debugger
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message({
          showClose: true,
          message: "上传图片只能是JPG/PNG 格式!",
          type: "error",
        });
      }
      if (!isLt10M) {
        this.$message({
          showClose: true,
          message: "上传头像图片大小不能超过 10MB!",
          type: "error",
        });
      }
      return isJPG && isLt10M;
    },

    async loadData() {
      this.handleQuery();
    },
    handleQuery() {
      this.queryParams.pageNum = this.pagination.pageNum;
      this.queryParams.pageSize = this.pagination.pageSize;
      console.log(this.queryParams);
      // console.log(this.placeId)
      // console.log(this.$store.getters.placeId)
      getPlacePageList(this.queryParams).then((response) => {
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleAdd() {
      this.resetForm();
      this.dialog = {
        title: "新增场馆",
        visible: true,
      };
    },
    handleUpdate(row) {
      this.resetForm();
      this.dialog = {
        title: "修改场馆",
        visible: true,
      };
      this.form = row;
    },
    handleSubmit: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const id = this.form.id;
          if (id !== undefined) {
            update(0, this.form).then(() => {
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
      this.$confirm("删除该场馆后，管理账号啊将被禁用?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return update(1, row);
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
        placePicture: undefined,
        address: undefined,
        placeName: undefined,
        phone: undefined,
        deleted: 0,
      };
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
    },
  },
};
</script>
