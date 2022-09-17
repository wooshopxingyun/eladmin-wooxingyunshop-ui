<template>
  <el-tabs v-model="integralName" style="padding-left: 8px;" type="card">
    <el-tab-pane label="积分记录" name="integralRecord">
      <integralRecord></integralRecord>
    </el-tab-pane>
    <el-tab-pane label="积分配置" name="integralConfig">
      <config/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import config from "./config"
import integralRecord from '../integralRecord/index'

export default {
  name: "integral",
  components: {config,integralRecord},
  data() {
    return {
      integralName: 'integralRecord'
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
