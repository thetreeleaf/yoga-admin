
<template>
  <div class="perm-container">
    <el-card class="box-card" shadow="always">
      <div class="clearfix" slot="header">
        <b>
          <svg-icon icon-class="perm" />
          {{ menu && menu.label ? "【" + menu.label + "】" : "" }}权限分配
        </b>
      </div>
      <el-row style="margin-bottom: 10px">
        <el-col :span="18">
          <el-tag v-if="role.id" type="primary">{{ role.name }}</el-tag>
          <el-tag v-if="menu.id" type="success" style="margin-left: 5px"
            >{{ menu.name }}
          </el-tag>
          <el-tag v-if="!role.id" type="info" style="margin-left: 5px"
            ><i class="el-icon-info"> </i> 请选择角色
          </el-tag>
          <el-tag v-if="!menu.id" type="info" style="margin-left: 5px"
            ><i class="el-icon-info"> </i> 请选择菜单
          </el-tag>
        </el-col>
        <el-col :span="6" style="text-align: right">
          <el-button
            type="primary"
            :disabled="isRoot"
            icon="el-icon-check"
            size="mini"
            @click="handleSubmit"
            >提交
          </el-button>
        </el-col>
      </el-row>

      <div v-if="permissionList.length > 0">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          style="margin-top: 20px"
          >全选
        </el-checkbox>
        <el-row>
          <el-col
            :span="8"
            v-for="permission in permissionList"
            style="margin-top: 20px"
            :key="permission.id"
          >
            <el-checkbox
              border
              v-model="permission.checked"
              :label="permission.id"
              :key="permission.id"
              @change="handleCheckChange"
              size="mini"
            >
              {{ permission.name }}
            </el-checkbox>
          </el-col>
        </el-row>
      </div>
      <div style="text-align: center" v-else>
        <el-empty
          :description="
            !role
              ? '请选择角色'
              : !menu
              ? '请选择菜单'
              : '暂无数据，您可在【菜单管理】配置权限数据'
          "
        ></el-empty>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getPermissionList } from "@/api/system/permission";
import { listRolePermission, updateRolePermission } from "@/api/system/role";

export default {
  name: "Permission",
  props: {
    role: {
      type: Object,
      default: () => {
        return {};
      },
    },
    menu: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      loading: false,
      ids: [],
      initialCheckedPermissionIds: [],
      isIndeterminate: true,
      checkAll: false,
      permissionList: [],
      isRoot: false,
    };
  }, 
  mounted() {
    this.handleQuery()
  },
  watch: {
    menu() {
      const menuId = this.menu.id;
      if (menuId) {
        this.handleQuery()
      }
    },
  },
  methods: {
    handleQuery() {
      const roleId = this.role.id
      const menuId = this.menu.id
      if(!menuId) {
        this.resetData()
        return false
      }
      this.loading = true;
      getPermissionList({
        menuId: menuId,
      }).then((response) => {
        const { data } = response;
        if (this.role.code == this.ROOT_ROLE_CODE) {
          // 如果是超级管理员默认勾选全部且不可编辑
          this.isRoot = true;
          this.checkAll = true;
          this.isIndeterminate = false;
          data.map((item) => this.$set(item, "checked", true));
          this.permissionList = data;
          this.loading = false;
        } else {
          this.isRoot = false;
          listRolePermission(roleId, { menuId: menuId }).then((res) => {
            this.initialCheckedPermissionIds = res.data;
            let checkAll = true;
            data.map((item) => {
              if (this.initialCheckedPermissionIds.includes(item.id)) {
                item.checked = true;
              } else {
                checkAll = false;
              }
            });
            this.checkAll = checkAll;
            if (checkAll) {
              this.isIndeterminate = false;
            }
            this.permissionList = data;
            this.loading = false;
          });
        }
      });
    },
    resetData() {
      this.permissionList = [];
      this.isIndeterminate = true;
      this.checkAll = false;
    },
    handleSubmit: function () {
      const checkedPermissionIds = this.permissionList
        .filter((item) => item.checked)
        .map((item) => item.id);
      // 判断选中权限是否变动
      if (
        this.initialCheckedPermissionIds.length ==
          checkedPermissionIds.length &&
        this.initialCheckedPermissionIds.sort().every(function (v, i) {
          return v == checkedPermissionIds[i];
        })
      ) {
        this.$message.warning("数据未变动");
        return;
      }
      updateRolePermission(
        this.menu.id,
        this.role.id,
        checkedPermissionIds
      ).then((response) => {
        this.$message.success("提交成功");
      });
    },
    handleCheckAllChange(checked) {
      if (checked) {
        this.permissionList.map((item) => (item.checked = true));
      } else {
        // 全不选
        this.permissionList.map((item) => (item.checked = false));
      }
      this.isIndeterminate = false;
    },
    handleCheckChange(item, val) {
      const checkedCount = this.permissionList.filter(
        (item) => item.checked
      ).length;
      this.checkAll = checkedCount === this.permissionList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.permissionList.length;
    },
  },
};
</script>

<style scoped>
.perm-container {
  margin-bottom: 20px;
}
</style>
