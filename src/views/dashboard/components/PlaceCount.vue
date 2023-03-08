<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8" :xs="24">
        <div :style="{ width: '600px', height: '600px' }" id="one"></div>
      </el-col>
      <el-col :span="8" :xs="24">
        <div :style="{ width: '500px', height: '500px' }" id="another"></div>
      </el-col>
      <el-col :span="8" :xs="24">
        <div :style="{ width: '500px', height: '500px' }" id="theother"></div>
      </el-col>
    </el-row>
    <!-- <h1 style="text-align:center;vertical-align:middle">欢迎使用瑜伽馆后台管理系统</h1> -->
  </div>
</template>

<script>
import * as echarts from "echarts";

import { getPlaceNum } from "@/api/system/place";
import { getMemberNum } from "@/api/member/member";
import { getUserNum } from "@/api/system/user";
import { getRoleNum } from "@/api/system/role";
export default {
  data() {
    return {
        message: [],
        option1: {
          title: {
            text: "信息统计",
          },
          tooltip: {},
          xAxis: {
            data: ["场馆数量", "小程序用户数量", "后台用户数量", "角色数量"],
          },
          yAxis: {},
          series: [
            {
              name: "信息",
              type: "bar",
              data: [],
            },
          ],
        }
    };
  },
  watch: {},
  created() {
   
    console.log(this.message)
  },
  mounted() {
    this.draw();
    this.anotherDraw();
    this.theotherDraw();
  },
  methods: {
    draw() {
      this.countPlace();
      this.countMember();
      this.countUser();
      this.countRole();
      console.log(this.message)
      this.option1.series[0].data = this.message;
      console.log(this.option1.series[0].data)
      var myChart = echarts.init(document.getElementById("one"));
      // 绘制图表
      myChart.setOption(this.option1,true);
    },
    anotherDraw() {
      var myChart1 = echarts.init(document.getElementById("another"));
      // 绘制图表
      myChart1.setOption({
        title: {
          text: "ECharts 入门示例",
        },
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      });
    },
    theotherDraw() {
      var myChart2 = echarts.init(document.getElementById("theother"));
      // 绘制图表
      myChart2.setOption({
        title: {
          text: "ECharts 入门示例",
        },
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      });
    },
    async countPlace() {
     
      await getPlaceNum().then((res) => {
        this.message.push(res.data)
      });

    },
    async countMember() {
      await getMemberNum().then((res) => {
          this.message.push(res.data)
      });
    },
    async countUser() {
      await getUserNum().then((res) => {
          this.message.push(res.data)
      });
    },
    async countRole() {
      await getRoleNum().then((res) => {
          this.message.push(res.data)
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
