<template>
  <el-tabs v-model="distributionName" style="padding-left: 8px;" type="card" @tab-click="tabClick">
    <el-tab-pane label="分销记录" name="distributionList">
<!--      分销记录   <h1>缺佣金记录表</h1>-->
      <brokerageRecord ></brokerageRecord>
    </el-tab-pane>
    <el-tab-pane label="分销配置" name="distributionConfig">
      <config></config>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import config from './config'
import brokerageRecord from '../brokerageRecord/index'
export default {
  name: "distribution",
  components: {config,brokerageRecord},
  data() {
    return {
      distributionName: 'distributionList'
    }
  },
  methods: {
    tabClick(name) {
      //tab栏使用状态
      if (this.activeName === 'groupBuyingGoodsList') {
        this.$refs.groupBuyingGoodsList
      } else {
        this.$refs.userGroupBuyingList
      }
    }
  }
}
</script>

<style scoped>

</style>
