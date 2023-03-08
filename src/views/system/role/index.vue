<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="10" :xs="24">
        <role ref="role" @roleClick="roleClick"></role>
      </el-col>
      <el-col :span="6" :xs="24">
        <menus ref="menu" @menuClick="menuClick" :role="role"></menus>
      </el-col>
      <el-col :span="8" :xs="24">
        <permission ref="permission" :menu="menu" :role="role"></permission>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Role from "./components/Role";
import Menus from "./components/Menu";
import Permission from "./components/Permission";

export default {
  name: "index",
  components: { Permission, Role, Menus },
  data() {
    return {
      role: {
        id: undefined,
        name: "",
      },
      menu: {
        id: undefined,
        name: "",
      },
    };
  },
  methods: {
    roleClick(role) {
      if (role) {
        this.role = {
          id: role.id,
          name: role.name,
        };
      } else {
        this.role = {
          id: undefined,
          name: "",
        };
      }
    },
    menuClick(menu) {
      if (!this.role.id) {
        this.$message.warning('请选择角色')
        return false;
      }

      if (menu) {
        this.menu = {
          id: menu.value,
          name: menu.label,
        };
      } else {
        this.menu = {
          id: undefined,
          name: "",
        };
      }
    },
  },
};
</script>

<style scoped>
</style>
