<template>
  <div class="components-container">
    <el-card class="box-card" shadow="always">
      <div class="clearfix" slot="header">
        <b>
          <svg-icon icon-class="clipboard"/>
          会员卡列表</b>
      </div>
      <!-- 搜索表单 -->
      <el-form
        ref="queryForm"
        size="mini"
        :model="queryParams"
        :inline="true"
      >
        <el-form-item>
          <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryParams.name"
            placeholder="会员卡名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table
        ref="Table"
        v-loading="loading"
        :data="tableList"
        @selection-change="handleSelectionChange"
        border
        highlight-current-row
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="会员卡名称" prop="membershipCardName" />
        <el-table-column label="会员卡价格" prop="membershipCardPrice" />
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
    </el-card>

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="200">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px">
        <el-form-item label="会员卡名称" prop="membershipCardName">
          <el-input v-model="form.membershipCardName" placeholder="请输入会员卡名称"/>
        </el-form-item>

        <el-form-item label="会员卡价格" prop="membershipCardPrice">
          <el-input v-model="form.membershipCardPrice"  placeholder="请输入会员卡价格"/>
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
import {listMemberCard, add, del,update} from "@/api/member/MemberCard";


export default {
  name: "MemberCard",
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      queryParams: {
        name: undefined,
        placeId: this.$store.state.user.placeId
      },
      tableList: [],
      dialog: {
        title: undefined,
        visible: false
      },
      form: {
        membershipCardId: undefined,
        membershipCardName: undefined,
        membershipCardPrice: undefined,
        placeId: this.$store.state.user.placeId
      },
      rules: {
        membershipCardName: [
          {required: true, message: '请输入会员卡名称', trigger: 'blur'}
        ],
        membershipCardPrice: [
          {required: true, message: '请输入会员卡价格', trigger: 'blur'}
        ],
      },
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.handleQuery()
    },
    handleQuery() {
      this.resetForm()
      listMemberCard(this.queryParams).then(response => {
        this.tableList = response.data
        this.loading = false
      })
    },
    handleReset() {
      this.queryParams = {
        name: undefined,
        placeId: this.$store.state.user.placeId
      },
      this.handleQuery()
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.resetForm()
      this.dialog = {
        title: '新增会员卡',
        visible: true
      }
    },
    handleEdit(row) {
      this.resetForm()
      this.dialog = {
        title: '修改会员卡',
        visible: true
      }
      console.log(row)
      this.form = JSON.parse(JSON.stringify(row))
    },
    handleSubmit: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log(this.form)
          const id = this.form.membershipCardId
          if (id != undefined) {
            update(this.form).then(() => {
              this.$message.success('修改成功')
              this.handleQuery()
              this.closeDialog()
            })
          } else {
            add(this.form).then(() => {
              this.$message.success('新增成功')
              this.handleQuery()
              this.closeDialog()
            })
          }
        }
      })
    },

    handleDelete(row) {
      const ids = [row.id || this.ids].join(',')
      this.$confirm('确认删除已选中的数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(ids).then(() => {
          this.$message.success('删除成功')
          this.handleQuery()
        })
      }).catch(() =>
        this.$message.info('已取消删除')
      )
    },

    resetForm() {
      this.form = {
        membershipCardId: undefined,
        membershipCardName: undefined,
        membershipCardPrice: undefined,
        placeId: this.$store.state.user.placeId
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    closeDialog() {
      this.resetForm()
      this.dialog = {
        title: undefined,
        visible: false
      }
    }
  }
}
</script>

<style scoped>

</style>
