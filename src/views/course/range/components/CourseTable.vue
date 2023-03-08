<template>
   <div>
       <div style="margin-left:7px;border:1px solid #eaf2ff;height:50px;display: flex;width:99%">
           <div style="margin-left:10px;margin-top:10px;font-size:20px;">
               <svg-icon color="#333" icon-class="date-range" />
               <span>周课表</span>
           </div>
           <div style="margin-left:100px;margin-top:10px;font-size:25px;">
                <i class="el-icon-back" @click="pre"></i>
                <span>{{classTableData[0].date.substring(0,10)}}</span>
                -
                <span>{{classTableData[6].date.substring(0,10)}}</span>
                <i class="el-icon-right" @click="next"></i>
           </div>
           <div style="margin-left:50px;margin-top:10px;width:150px;" v-if="this.$store.state.user.placeId == 1">
                <el-select v-model="placeId" placeholder="请选择场馆" filterable @change="chose">
                    <el-option
                    v-for="item in placeOptions" 
                    :key="item.id"
                    :label="item.placeName"
                    :value="item.id"
                    />
                </el-select>
           </div> 
       </div>
        <div class="class-table">
            <div class="table-wrapper">
                <div class="tabel-container">
                    <table>
                        <thead>
                            <tr>
                            <th>时间</th>
                            <th v-for="(week, index) in weeks" :key="index">
                                <span>{{classTableData[index].date.substring(0,10)}}</span></br>
                                <span>{{ "周" + digital2Chinese(index + 1, "week") }}</span>
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in classTableData" :key="index">
                            <td>
                                <p>{{ "第" + digital2Chinese(index + 1) + "节" }}</p>
                                <p class="period">{{ item.rangeTime }}</p>
                            </td>

                            <td v-for="(week, index) in weeks" :key="index">
                                <div v-for="(course, n) in item[week]" :key="n">
                                    <span @click="handle(course)">{{course.courseName}}</span>
                                </div>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <el-dialog
            :title="dialog.title"
            :visible.sync="dialog.visible"
            width="800px"
        >
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="课程名称" prop="courseName">
                    <el-input v-model="form.courseName" placeholder="请输入课程名称" disabled/>
                </el-form-item>
                <el-form-item label="上课老师" prop="coachId" v-if="form.courseType == 1">
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
                <el-form-item label="时间段" prop="timeId">
                    <el-select
                        v-model="form.timeId"
                        placeholder="请选择时间段"
                        style="width: 100%"
                        value-key="category_id"
                        @change="test"
                    >
                        <el-option
                            v-for="item in timeRangeOptions"
                            :label="item.rangeTime"
                            :key="item.id"
                            :value="item.id"
                         ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleDelete">删除</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
                <el-button @click="dialog.visible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div> 
</template>

<script>
import {
  PlaceCourseTable,
  updateCourseDetail,
  deleteCourseDetail,
} from "@/api/course/CourseDetail";
import { getPlaceList } from "@/api/system/place";
import { getRoomList } from "@/api/course/room";
import { getTimeRangeList } from "@/api/course/TimeRange";
import { getCoachList } from "@/api/system/coach";
export default {
  name: "CourseTable",
  data() {
    return {
      dialog: {
        title: undefined,
        visible: false,
      },
      placeOptions: [],
      roomOptions: undefined,
      coachOptions: undefined,
      timeRangeOptions: undefined,
      n: 0, //0 表示本周，-1表示上一周，+1表示下一周
      placeId: undefined,
      weeks: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      classTableData: undefined,
      tableShow: false,
      // 表单参数
      form: {
        id: undefined,
        courseName: undefined,
        courseId: undefined,
        roomId: undefined,
        coachId: undefined,
        rangeTime: undefined,
        timeId: undefined,
        week: undefined,
        courseType: undefined,
      },
      // 表单校验
      rules: {
        roomId: [{ required: true, message: "房间不能为空", trigger: "blur" }],
        courseRangeType: [
          { required: true, message: "课程安排类型不能为空", trigger: "blur" },
        ],
        timeId: [
          {
            required: true,
            message: "课程安排时间段不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    if(this.$store.state.user.placeId == 1) {
      this.placeId = 3
    } else {
      this.placeId = this.$store.state.user.placeId
    }
    this.getTable(this.placeId, this.n);
    // this.getDates(-2);
    this.loadPlaceOptions();
    this.loadCoachOptions();
    this.loadRoomOptions();
    this.loadTimeRangeOptions();
  },
  methods: {
    test() {
        this.$forceUpdate()
    },
    handle(course) {
      this.resetForm();
      this.dialog = {
        title: "设置课程",
        visible: true,
      };
      this.form = course;
      this.timeRangeOptions.some((item) => {
        if (item.rangeTime == course.rangeTime) {
          this.form.timeId = item.id;
          return true;
        }
      });
    //   console.log(this.form);
    },
    handleDelete() {
      deleteCourseDetail(this.form.id).then((response) => {
        if (response.code == "00000") {
          this.$message.success("删除成功");
        } else {
          this.$message.success("删除失败");
        }
        this.dialog.visible = false;
        this.getTable(this.placeId, this.n);
      });
    },
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const id = this.form.id;
          this.form.rangeTime = this.timeRangeOptions[this.form.timeId - 1].rangeTime;
          updateCourseDetail(id,this.form).then(response => {
              if(response.code == "00000") {
                  this.$message.success("修改成功");
              } else {
                  this.$message.success("修改失败");
              }
              this.dialog.visible = false;
              this.getTable(this.placeId, this.n);
          })
        //   console.log(this.form);
        }
      });
    },
    pre() {
      this.n = this.n - 1;
      this.getTable(this.placeId, this.n);
    },
    next() {
      this.n = this.n + 1;
      this.getTable(this.placeId, this.n);
    },
    chose() {
      this.getTable(this.placeId, this.n);
    },
    getTable(placeId, n) {
      PlaceCourseTable(placeId, n).then((response) => {
        console.log(response.data);
        this.classTableData = response.data;
      });
    },
    loadPlaceOptions() {
      getPlaceList().then((response) => {
        const data = response.data;
        data.forEach((element) => {
          if (element.id != 1) {
            this.placeOptions.push(element);
          }
        });
      });
    },
    loadCoachOptions() {
      this.coachOptions = [];
      getCoachList(this.placeId).then((response) => {
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
    digital2Chinese(num, identifier) {
      const character = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
      ];
      return identifier === "week" && (num === 0 || num === 7)
        ? "日"
        : character[num];
    },
    // 表单重置
    resetForm() {
      this.form = {
        id: undefined,
        courseName: undefined,
        courseId: undefined,
        roomId: undefined,
        coachId: undefined,
        rangeTime: undefined,
        timeId: undefined,
        week: undefined,
        courseType: undefined,
      };
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.class-table {
  .table-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .tabel-container {
    margin-left: 7px;

    table {
      table-layout: fixed;
      width: 100%;

      thead {
        background-color: #67a1ff;
        th {
          color: #fff;
          line-height: 17px;
          font-weight: normal;
        }
      }
      tbody {
        background-color: #eaf2ff;
        td {
          color: #677998;
          line-height: 12px;
        }
      }
      th,
      td {
        width: 60px;
        padding: 12px 2px;
        font-size: 12px;
        text-align: center;
      }

      tr td:first-child {
        color: #333;
        .period {
          font-size: 8px;
        }
      }
    }
  }
}
</style>
