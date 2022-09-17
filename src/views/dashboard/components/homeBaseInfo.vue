<template>
  <div class="divBox">
    <el-row :gutter="24" class="baseInfo">
      <el-col v-bind="grid" class="ivu-mb">
        <el-card :bordered="false" dis-hover :padding="12">
          <div slot="header" class="acea-row row-between-wrapper">
            <span>销售额</span>
            <el-tag type="success">今天</el-tag>
          </div>
          <div class="content" >
            <span class="content-number spBlock mb15">{{ totalNum.sales }}</span>
            <!--            <div>
                          <span class="content-time mr20">日环比：<i class="content-is" :class="Number(sales.dayRate)>=0?'up':'down'">{{
                              sales.dayRate
                            }}%</i><i :class="Number(sales.dayRate)>=0?'el-icon-caret-top':'el-icon-caret-bottom'"/></span>
                          <span class="content-time">周环比：<i class="content-is"
                                                            :class="Number(sales.weekRate)>=0?'up':'down'">{{ sales.weekRate }}%</i><i
                            :class="Number(sales.weekRate)>=0?'el-icon-caret-top':'el-icon-caret-bottom'"/></span>
                        </div>-->
            <el-divider></el-divider>
            <div class="acea-row row-between-wrapper">
              <span class="content-time">总销售额</span>
              <span>{{ totalNum.totalSales }} 元</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col v-bind="grid" class="ivu-mb">
        <el-card :bordered="false" dis-hover :padding="12">
          <div slot="header" class="acea-row row-between-wrapper">
            <span>用户访问量</span>
            <el-tag type="success">今天</el-tag>
          </div>
          <div class="content" >
            <span class="content-number spBlock mb15">{{ totalNum.pageviews }}</span>
            <!--            <div>
                          <span class="content-time mr20">日环比：<i class="content-is" :class="Number(views.dayRate)>=0?'up':'down'">{{
                              views.dayRate
                            }}%</i><i :class="Number(views.dayRate)>=0?'el-icon-caret-top':'el-icon-caret-bottom'"/></span>
                          <span class="content-time">周环比：<i class="content-is"
                                                            :class="Number(views.weekRate)>=0?'up':'down'">{{ views.weekRate }}%</i><i
                            :class="Number(views.weekRate)>=0?'el-icon-caret-top':'el-icon-caret-bottom'"/></span>
                        </div>-->
            <el-divider></el-divider>
            <div class="acea-row row-between-wrapper">
              <span class="content-time">本月订单量</span>
              <span>{{ totalNum.monthOrderNum }} 单</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col v-bind="grid" class="ivu-mb">
        <el-card :bordered="false" dis-hover :padding="12">
          <div slot="header" class="acea-row row-between-wrapper">
            <span>订单量</span>
            <el-tag type="success">今天</el-tag>
          </div>
          <div class="content" >
            <span class="content-number spBlock mb15">{{ totalNum.orderNum }}</span>
            <!--            <div>
                          <span class="content-time mr20">日环比：<i class="content-is" :class="Number(order.dayRate)>=0?'up':'down'">{{
                              order.dayRate
                            }}%</i><i :class="Number(order.dayRate)>=0?'el-icon-caret-top':'el-icon-caret-bottom'"/></span>
                          <span class="content-time">周环比：<i class="content-is"
                                                            :class="Number(order.weekRate)>=0?'up':'down'">{{ order.weekRate }}%</i><i
                            :class="Number(order.weekRate)>=0?'el-icon-caret-top':'el-icon-caret-bottom'"/></span>
                        </div>-->
            <el-divider></el-divider>
            <div class="acea-row row-between-wrapper">
              <span class="content-time">总订单量</span>
              <span>{{ totalNum.totalOrderNum }} 单</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col v-bind="grid" class="ivu-mb">
        <el-card :bordered="false" dis-hover :padding="12">
          <div slot="header" class="acea-row row-between-wrapper">
            <span>新增用户</span>
            <el-tag type="success">今天</el-tag>
          </div>
          <div class="content" >
            <span class="content-number spBlock mb15">{{ totalNum.newUserNum }}</span>
            <!--            <div>
                          <span class="content-time mr20">日环比：<i class="content-is" :class="Number(user.dayRate)>=0?'up':'down'">{{
                              user.dayRate
                            }}%</i><i :class="Number(user.dayRate)>=0?'el-icon-caret-top':'el-icon-caret-bottom'"/></span>
                          <span class="content-time">周环比：<i class="content-is"
                                                            :class="Number(user.weekRate)>=0?'up':'down'">{{ user.weekRate }}%</i><i
                            :class="Number(user.weekRate)>=0?'el-icon-caret-top':'el-icon-caret-bottom'"/></span>
                        </div>-->
            <el-divider></el-divider>
            <div class="acea-row row-between-wrapper">
              <span class="content-time">总用户</span>
              <span>{{ totalNum.totalUserNum }} 人</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import {statisticsOrderApi, statisticsSalesApi, statisticsUserApi, statisticsViewsApi} from '@/api/dashboard'
import {getHomeTatla} from '@/api/wooshopHome'

export default {
  data() {
    return {
      totalNum: {
        sales:0,
        monthOrderNum: 0,
        newUserNum: 0,
        orderNum: 0,
        pageviews: 0,
        totalOrderNum: 0,
        totalSales: 0,
        totalUserNum: 0,
      },
      infoList: [],
      grid: {
        xl: 6,
        lg: 6,
        md: 12,
        sm: 12,
        xs: 24
      },
      excessStyle: {
        color: '#f56a00',
        backgroundColor: '#fde3cf'
      },
      avatarList: [],
      sales: {
        weekRate: 25,//周环比
        dayRate: 25,//日环比
        count: 25,//昨日
        total: 20,//总订单量
      },
      order: {
        weekRate: 25,//周环比
        dayRate: 25,//日环比
        count: 25,//昨日
        total: 20,//总订单量
      },
      user: {
        total: 200,//总用户
        weekRate: 25,//周环比
        dayRate: 25,//日环比
        count: 25,//昨日

      },
      views: {
        weekRate: 25,//周环比
        dayRate: 25,//日环比
        count: 25,//昨日
        total: 20,//总订单量
      }
    }
  },
  methods: {
    getgetHomeTatlaData() {

      getHomeTatla().then(res => {
        console.log('获取首页统计数量', res)
        this.totalNum = res
      })
    }
    // 订单量
    // statisticsOrder() {
    //   statisticsOrderApi().then(async res => {
    //     this.order = res
    //   })
    // },
    // 销售额
    // statisticsSales() {
    //   statisticsSalesApi().then(async res => {
    //     this.sales = res
    //   })
    // },
    // 新增用户
    // statisticsUser() {
    //   statisticsUserApi().then(async res => {
    //     this.user = res
    //   })
    // },
    // 用户访问量
    // statisticsViews() {
    //   statisticsViewsApi().then(async res => {
    //     this.views = res
    //   })
    // }
  },
  mounted() {
    this.getgetHomeTatlaData()
    // this.statisticsOrder();
    // this.statisticsSales();
    // this.statisticsUser();
    // this.statisticsViews();
  }
}
</script>
<style scoped lang="scss">
.ivu-mb {
  margin-bottom: 10px;
}

.up, .el-icon-caret-top {
  color: #F5222D;
  font-size: 12px;
  opacity: 1 !important;
}

.down, .el-icon-caret-bottom {
  color: #39C15B;
  font-size: 12px;
  /*opacity: 100% !important;*/
}

.baseInfo {
  ///deep/ .el-card__header {
  //  padding: 15px 20px !important;
  //}
}

.content {
  &-number {
    font-size: 30px;
  }

  &-time {
    font-size: 14px;
    /*color: #8C8C8C;*/
  }
}
</style>
