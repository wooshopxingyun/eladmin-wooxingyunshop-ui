<template>
  <el-tabs v-model="activeName" style="padding-left: 8px;" type="card" @tab-click="tabClick">
    <el-tab-pane label="商品列表" name="goodsList">
      <goodList ref="goodList" />
    </el-tab-pane>
    <el-tab-pane label="新增商品" name="goodsAdd" >
      <goodsAdd ref="goodsAdd"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import goodList from "./goodsList";
import goodsAdd from "./goodsAdd/goodsAdd";

export default {
  name: "indexTabs",
  components: { goodList, goodsAdd },
  data() {
    return {
      activeName: 'goodsList'
    }
  },
  mounted() {
    const add = this.$route.params.add
    if (add===':add'){
      this.$refs.goodsList
    }else if (add === 'goodsAdd'){
      this.activeName='goodsAdd';
    }else {
      console.log('携带参数')
      this.activeName='goodsAdd';
    }
  },
  methods: {
    tabClick(name) {
      if (this.activeName === 'goodsList') {
        this.$refs.goodsList
      } else {
        this.$refs.goodsAdd
      }
    }
  }
}
</script>

<style scoped>

</style>
