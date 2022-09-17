<template>
  <div class="divBox">
    <el-card :bordered="false" dis-hover>
      <div slot="header">
        <div class="acea-row row-middle">
          <el-avatar
            icon="el-icon-s-operation"
            size="small"
            style="color: #1890ff; background: #e6f7ff; font-size: 13px"
          />
          <span class="ivu-pl-8">统计</span>
        </div>
      </div>
      <el-row :gutter="24">
        <el-col
          :xl="8"
          :lg="8"
          :md="24"
          :sm="24"
          :xs="24"
          class="ivu-mb mb10 dashboard-console-visit"
        >
          <span class="ivu-pl-8">本月商品分析</span>
          <home-order-count/>
        </el-col>
        <el-col
          :xl="8"
          :lg="8"
          :md="24"
          :sm="24"
          :xs="24"
          class="ivu-mb mb10 dashboard-console-visit"
        >
          <span class="ivu-pl-8">本月成交额</span>

          <home-bar-chart/>
        </el-col>
        <el-col
          :xl="8"
          :lg="8"
          :md="24"
          :sm="24"
          :xs="24"
          class="ivu-mb mb10 dashboard-console-visit"
        >
          <span class="ivu-pl-8">本月订单数</span>

          <home-bar-chart-t/>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import homeOrderCount from "./homeOrderCount";
import homeBarChart from "./homeBarChart";
import homeBarChartT from "./homeBarChartT";
export default {
  name: 'home-user-chart',
  components: {homeOrderCount,homeBarChart,homeBarChartT},
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.dashboard-editor-container {
  padding: 18px 22px 22px 22px;
  background-color: rgb(240, 242, 245);

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.acea-row {
  ::v-deep.el-avatar--small {
    width: 22px;
    height: 22px;
    line-height: 22px;
  }
}

.checkTime {
  ::v-deep.el-radio__input {
    display: none;
  }
}

.ivu-pl-8 {
  margin-left: 8px;
  font-size: 14px;
}

.dashboard-console-visit {
  ::v-deep.el-card__header {
    padding: 14px 20px !important;
  }

  ul {
    li {
      list-style-type: none;
      margin-top: 12px;
    }
  }
}

.ivu-mb {
  margin-bottom: 10px;
}

</style>
