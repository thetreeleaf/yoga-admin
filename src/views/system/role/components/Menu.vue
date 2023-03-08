<template>
  <div>
    <el-card class="box-card" shadow="always">
      <div class="clearfix" slot="header">
        <b>
          <svg-icon icon-class="menu" />
          菜单分配</b
        >
      </div>
      <el-row>
        <el-col :span="12">
          <el-tag v-if="role && role.name" type="primary">{{
            role.name
          }}</el-tag>
          <el-tag v-else type="info"
            ><i class="el-icon-info"></i> 请选择角色</el-tag
          >
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button
            :disabled="isRoot"
            type="primary"
            icon="el-icon-check"
            size="mini"
            @click="handleSubmit"
            >提交
          </el-button>
        </el-col>
      </el-row>

      <el-row style="margin-top: 10px">
        <el-tree
          ref="menu"
          :default-expanded-keys="expandedKeys"
          :data="menuOptions"
          show-checkbox
          node-key="value"
          empty-text="加载中，请稍后"
          :check-strictly="checkStrictly"
          highlight-current
          @node-click="handleMenuNodeClick"
        />
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getMenuSelectList } from "@/api/system/menu";
import { listRoleMenu, updateRoleMenu } from "@/api/system/role";

export default {
  name: "Menu",
  props: {
    role: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      menuOptions: [],
      expandedKeys: [],
      initialCheckedMenuIds: [], //初始选中值
      isRoot: false, // 是否是超级管理员账户
      checkStrictly: false,
    };
  },
  watch: {
    role(newVal, oldVal) {
      // console.log(newVal, oldVal);
      const roleId = this.role.id;
      if (roleId) {
        this.checkStrictly = true;
        listRoleMenu(roleId).then((response) => {
          this.initialCheckedMenuIds = response.data;
          // this.$nextTick(() => {
          //   this.$refs.menu.setCheckedKeys(this.initialCheckedMenuIds); //一个选中的数组element Ui的东西，关键是看$nextTick的用法
          // });
          this.$refs.menu.setCheckedKeys(this.initialCheckedMenuIds);
          this.checkStrictly = false;
        });
      }
    },
  },
  mounted() {
    this.loadData();
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      getMenuSelectList().then((response) => {
        this.menuOptions = response.data;
        this.expandedKeys = this.menuOptions.map((node) => node.id); //展开所有节点
      });
    },
    handleMenuNodeClick(data) {
      this.$emit("menuClick", data);
    },
    handleSubmit() {
      const checkedMenuIds = this.$refs.menu
        .getCheckedNodes(false, true)
        .map((node) => node.value);
      // 判断选中菜单ID是否变动
      if (
        this.initialCheckedMenuIds.length == checkedMenuIds.length &&
        this.initialCheckedMenuIds.sort().every(function (v, i) {
          return v == checkedMenuIds[i];
        })
      ) {
        this.$message.warning("数据未变动");
        return;
      }
      updateRoleMenu(this.role.id, checkedMenuIds).then(() => {
        this.$message.success("提交成功");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
