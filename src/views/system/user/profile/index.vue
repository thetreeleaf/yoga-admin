<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <div class="block" @click="updateAvatar">
                <el-avatar :size="100" :src="user.avatar"></el-avatar>
              </div>
            </div>
            <div
              style="
                margin-top: 20px;
                border-top: 1px solid #e2e2e2;
                border-bottom: 1px solid #e2e2e2;
                margin: 10px, 5px;
                padding: 5px 5px;
                height: 50px;
              "
            >
              <svg-icon style="margin-top: 10px" icon-class="user" />用户名称
              <span style="margin-top: 10px; float: right">{{
                user.username
              }}</span>
            </div>
            <div
              style="
                border-top: 1px solid #e2e2e2;
                border-bottom: 1px solid #e2e2e2;
                margin: 10px, 5px;
                padding: 5px 5px;
                height: 50px;
              "
            >
              <svg-icon style="margin-top: 10px" icon-class="phone" />手机号码
              <span style="margin-top: 10px; float: right">{{
                user.mobile
              }}</span>
            </div>
            <div
              style="
                border-top: 1px solid #e2e2e2;
                border-bottom: 1px solid #e2e2e2;
                margin: 10px, 5px;
                padding: 5px 5px;
                height: 50px;
              "
            >
              <svg-icon style="margin-top: 10px" icon-class="email" />用户邮箱
              <span style="margin-top: 10px; float: right">{{
                user.email
              }}</span>
            </div>
            <div
              style="
                border-top: 1px solid #e2e2e2;
                border-bottom: 1px solid #e2e2e2;
                margin: 10px, 5px;
                padding: 5px 5px;
                height: 50px;
              "
            >
              <svg-icon style="margin-top: 10px" icon-class="date" />创建日期
              <span style="margin-top: 10px; float: right">{{
                user.gmtCreate
              }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="400px"
    >
      <el-upload
        class="avatar-uploader"
        :action="qiniuDomain"
        :http-request="upLoadToQiniu"
        :show-file-list="false"
        :before-upload="beforeUpload"
      >
        <img
          v-if="user.avatar"
          :src="user.avatar"
          class="avatar"
          style="width: 100px; hight: 100px;margin-left:120px;"
        />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { mapGetters } from "vuex";
import { getUserProfile,updateUser } from "@/api/system/user";
import { uploadImg } from "@/api/system/place";
export default {
  name: "Profile",
  components: { userInfo, resetPwd },
  data() {
    return {
      // 实名认证后创建的存储空间对应的上传地址(华东，华南等等不一样：https://developer.qiniu.com/kodo/manual/1671/region-endpoint)
      qiniuDomain: "https://upload-z2.qiniup.com", // 创建成功后官方随机分配的公开图片地址前缀，即上传成功后对应的公用图片地址前
      user: undefined,
      dialog: {
        title: "修改头像",
        visible: false,
      },
      activeTab: "userinfo",
    };
  },
  created() {
    this.getUser();
  },
  computed: {
    ...mapGetters(["userId"]),
  },
  methods: {
    updateAvatar() {
      console.log("xdfhdxf");
      this.dialog.visible = true;
    },
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
        this.user.avatar = response.data;
        this.$forceUpdate();
        const data = JSON.stringify(this.user)
        updateUser(this.user.id,data).then((response=> {
          this.$message.success('修改成功')
          this.dialog.visible = false
          this.getUser();
        }))
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
    getUser() {
      getUserProfile(this.$store.state.user.userId).then((response) => {
        console.log(response.data);
        this.user = response.data;
      });
    },
  },
};
</script>
