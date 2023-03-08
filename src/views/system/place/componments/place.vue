<template>
  <div class="app-container">
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
            style="width: 300px; hight: 200px"
            class="avatar"
          />
          <el-button v-else type="primary" icon="el-icon-upload"
            >上传</el-button
          >
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
      <el-button style="margin-left:50px;" type="primary" @click="handleSubmit">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getPlaceDetail, update } from "@/api/system/place";
export default {
  data() {
    return {
      // 实名认证后创建的存储空间对应的上传地址(华东，华南等等不一样：https://developer.qiniu.com/kodo/manual/1671/region-endpoint)
      qiniuDomain: "https://upload-z2.qiniup.com", // 创建成功后官方随机分配的公开图片地址前缀，即上传成功后对应的公用图片地址前
      form: undefined,
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
    handleSubmit: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
            update(0, this.form).then(() => {
              this.$message.success("修改成功");
              this.loadData();
            });
        }
      });
    },
    loadData() {
      getPlaceDetail(this.$store.state.user.placeId).then((response) => {
        this.form = response.data;
      });
    },
  },
};
</script>