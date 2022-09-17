<template>
<!--  <div class="app-container">-->
  <el-tabs v-model="activeName" style="padding-left: 8px;" type="card" @tab-click="tabClick">
    <el-tab-pane label="运费列表" name="freightList">
      <freight ref="freight" />
    </el-tab-pane>
    <el-tab-pane label="新增运费模板" name="pinkageAdd">
      <pinkage ref="pinkage" :paramdata="paramdata" />
    </el-tab-pane>
  </el-tabs>
<!--  </div>-->
</template>

<script>
import freight from "./freight";
import pinkage from "./pinkage";
export default {
  name: "index1",
  components: {pinkage ,freight},
  data() {
    return {
      activeName: 'freightList',
      paramdata: {name:'小明',age:'18'}
    }
  },
  created() {
    // const add = this.$route.params.add
    // if (add === 'pinkageAdd'){
    //   this.activeName='pinkageAdd';
    // }
    // console.log(add)
  },
  mounted(val) {
    const add = this.$route.params.add
    console.log('add',add)
    if (add===':add'){
      this.$refs.freightList
    }else if (add === 'pinkageAdd'){
      this.activeName='pinkageAdd';
    }else {
      console.log('携带参数')
      this.activeName='pinkageAdd';
      // this.paramdata.id=add;
    }

  },
  methods: {
    tabClick(name) {
      if (this.activeName === 'freightList') {
        this.$refs.freightList
      } else {
        this.$refs.pinkageAdd
      }
    }
  }
}
</script>

<style scoped>

</style>
