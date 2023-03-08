<template>
  <div class="app-container">
    <el-form
      ref="queryForm"
      :inline="true"
      :model="queryParams"
      label-width="68px"
      size="small"
    >
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
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      element-loading-text="数据载入中"
      element-loading-spinner="el-icon-loading"
      border
      :data="pageList"
    >
      <el-table-column align="center" label="课程编号" prop="id" width="50" />
      <el-table-column
        align="center"
        label="课程名称"
        prop="courseName"
        width="100"
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

    <!-- 新增或修改参数配置对话框 -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="800px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入课程名称" disabled/>
        </el-form-item>
        <el-form-item label="上课老师" prop="coachId">
          <el-select
            v-model="form.coachId"
            placeholder="请选择上课老师"
            style="width: 100%"
          >
            <el-option
              v-for="item in coachOptions"
              :label="item.coachName"
              :key="item.coachId"
              :value="item.coachId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="教室" prop="roomId">
          <el-select
            v-model="form.roomId"
            placeholder="请选择教室"
            style="width: 100%"
          >
            <el-option
              v-for="item in roomOptions"
              :label="
                item.roomType == 1
                  ? '小教室'
                  : item.roomType == 2
                  ? '大教室'
                  : item.roomType == 3
                  ? '多功能教室'
                  : ''
              "
              :key="item.id"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="课时设置" prop="courseRangeType">
          <el-radio v-model="form.courseRangeType" :label="1"
            >指定日期</el-radio
          >
          <el-radio v-model="form.courseRangeType" :label="2">周循环</el-radio>
        </el-form-item>
        <el-form-item
          label="开课时间"
          prop="courseType"
          v-if="form.courseRangeType == 1"
        >
          <el-date-picker
            v-model="form.gmtCreate"
            type="date"
            placeholder="请选择开课日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="开课时间"
          prop="courseRangeContent"
          v-if="form.courseRangeType == 2"
        >
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="checkedWeek"
            @change="handleCheckedWeeksChange"
          >
            <el-checkbox
              v-for="week in weekOptions"
              :label="week"
              :key="week"
              >{{ week }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="时间段" prop="timeId">
          <el-select
            v-model="form.timeId"
            placeholder="请选择时间段"
            style="width: 100%"
          >
            <el-option
              v-for="item in timeRangeOptions"
              :label="item.rangeTime"
              :key="item.id"
              :value="item.id"
            />
          </el-select>
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
import { listCourseWithPage } from "@/api/course/course";
import { getRoomList } from "@/api/course/room";
import { getTimeRangeList } from "@/api/course/TimeRange";
import { getCoachList } from "@/api/system/coach";
import { getCourseRangeDetail, add,update} from "@/api/course/CourseRange";
import { mapGetters } from "vuex";

export default {
  name: "CourseRange",

  data() {
    return {
      // 遮罩层
      loading: true,
      roomOptions: undefined,
      coachOptions: undefined,
      timeRangeOptions: undefined,
      checkAll: false,
      checkedWeek: [],
      isIndeterminate: true,
      weekOptions: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime(); //  获取当前时间点
          let seven = 7 * 24 * 60 * 60 * 1000; // 设定7天日期  7天 * 24小时 * 60分钟 * 60秒 * 1000 = 7天的时间戳
          let sevenDays = curDate + seven; //  当前时间点后的七天所处的日期
          return (
            time.getTime() < Date.now() - 8.64e7 ||
            time.getTime() > sevenDays - 8.64e7
          ); // 8.64e7 表示一天，明天之前包括明天不可选，只可选七天
        },
      },

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
        courseRangeType: undefined,
        courseId: undefined,
        roomId: undefined,
        gmtCreate: undefined,
        courseRangeContent: undefined,
        coachId: undefined,
        rangeTime: undefined,
        timeId: undefined,
        placeId: this.$store.state.user.placeId,
      },
      // 表单校验
      rules: {
        roomId: [{ required: true, message: "房间不能为空", trigger: "blur" }],
        courseRangeType: [
          { required: true, message: "课程安排类型不能为空", trigger: "blur" },
        ],
        timeId: [
          { required: true, message: "课程安排时间段不能为空", trigger: "blur" },
        ],
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
      this.loadCoachOptions();
      this.loadRoomOptions();
      this.loadTimeRangeOptions();
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
        placeId: this.$store.state.user.placeId,
      };
      this.handleQuery();
    },

    handleUpdate(row) {
      this.checkedWeek = []
      this.resetForm();
      this.dialog = {
        title: "安排课程",
        visible: true,
      };

      this.form.courseId = row.id;
      this.form.courseName = row.courseName;
      getCourseRangeDetail(row.id).then((response) => {
        if (response.data) {
          console.log(response.data)
          this.form.id = response.data.id
          this.form.courseRangeType = response.data.courseRangeType
          this.form.coachId = response.data.coachId
          this.form.roomId = response.data.roomId
          this.form.timeId = response.data.timeId
          this.form.courseRangeContent = response.data.courseRangeContent
          this.form.rangeTime = this.timeRangeOptions[this.form.timeId].rangeTime
          const contents = (this.form.courseRangeContent || '').split(",")
          if (this.form.courseRangeType == 1) {
            this.form.gmtCreate = this.form.courseRangeContent
          } else {
            contents.forEach((content) => {
              this.checkedWeek.push(content);
            });
          }
        }
      });
    //   console.log(this.form);
    },
    handleSubmit: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const id = this.form.id
          this.form.rangeTime = this.timeRangeOptions[this.form.timeId - 1].rangeTime
          if (this.form.courseRangeType == 2) {
            this.form.gmtCreate = undefined
          }
          if (this.form.gmtCreate) {
            this.form.courseRangeContent = this.form.gmtCreate
          } else {
            var str = "";
            this.checkedWeek.forEach((week) => {
              str = str + week + ",";
            });
            str = str.slice(0, str.length - 1);
            this.form.courseRangeContent = str;
          }
          if (id !== undefined) {
            console.log(this.form);
            update(this.form.id, this.form).then(() => {
              this.$message.success("修改成功");
              this.dialog.visible = false;
              this.handleQuery();
            });
          } else {
            console.log(this.form);
            add(this.form).then(() => {
              this.$message.success("设置成功");
              this.dialog.visible = false;
              this.handleQuery();
            });
          }
        }
      });
    },

    handleCheckAllChange(val) {
      this.checkedWeek = val ? weekOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedWeeksChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.weekOptions.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.weekOptions.length;
    },

    loadCoachOptions() {
      this.coachOptions = [];
      getCoachList(this.$store.state.user.placeId).then((response) => {
        this.coachOptions = response.data;
      });
    },
    loadRoomOptions() {
      this.roomOptions = [];
      getRoomList().then((response) => {
        this.roomOptions = response.data;
      });
    },
    loadTimeRangeOptions() {
      this.timeRangeOptions = [];
      getTimeRangeList().then((response) => {
        this.timeRangeOptions = response.data;
      });
    },

    // 表单重置
    resetForm() {
      this.form = {
        id: undefined,
        courseName: undefined,
        courseRangeType: undefined,
        courseId: undefined,
        roomId: undefined,
        gmtCreate: undefined,
        courseRangeContent: undefined,
        coachId: undefined,
        rangeTime: undefined,
        timeId: undefined,
        placeId: this.$store.state.user.placeId,
      };
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
    },
  },
};
</script>
