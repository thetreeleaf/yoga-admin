<template>
  <div class="app-container">
    <el-row>
      <el-col :span="10" :xs="24">
        <el-card class="box-card" shadow="always">
          <template #header>
            <svg-icon color="#333" icon-class="date-range" />
            课程安排
          </template>
          <course-range></course-range>
        </el-card>
      </el-col>
      <el-col :span="14" :xs="24">
        <!-- <el-card class="box-card" shadow="always">
          <template #header>
            <svg-icon color="#333" icon-class="date-range" />
            周课表
          </template> -->
          <course-table></course-table>
        <!-- </el-card>
     -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import MemberCard from "../../member/MemberCard/components/MemberCard.vue";
import CourseTable from "./components/CourseTable";
import CourseRange from "./components/CourseRange.vue";

export default {
  name: "index",
  components: { CourseRange, CourseTable },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
</style>

