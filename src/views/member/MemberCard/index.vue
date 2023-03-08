<template>
  <div class="app-container">
    <el-row >
      <el-col :span="10" :xs="24">
        <member-card></member-card>
      </el-col>
      <el-col :span="14" :xs="24">
        <member-type></member-type>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MemberCard from './components/MemberCard'
import MemberType from './components/MemberType'

export default {
  name: "index",
  components: {MemberCard,MemberType},
  data() {

    return {

    }
  },
  methods: {
   
  }
}
</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
}
</style>

