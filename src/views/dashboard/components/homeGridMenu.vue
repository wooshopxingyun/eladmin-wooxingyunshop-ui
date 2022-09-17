<template>
  <div class="divBox">
    <el-row :gutter="24" class="dashboard-console-grid">
      <el-col v-bind="grid" class="ivu-mb">
        <el-card :bordered="false">
          <router-link :to="{path:'/member/memberList'}">
            <i class="el-icon-user" style="color:#69c0ff"/>
            <p>会员管理</p>
          </router-link>
        </el-card>
      </el-col>
      <el-col v-bind="grid" class="ivu-mb">
        <el-card :bordered="false">
          <router-link :to="{path:'/wooshopconfig/stores'}">
            <i class="el-icon-s-shop" style="color:#95de64"/>
            <p>店铺管理</p>
          </router-link>
        </el-card>
      </el-col>
      <el-col v-bind="grid" class="ivu-mb">
        <el-card :bordered="false">
          <router-link :to="{path:'/product/goods/:add'}">
            <i class="el-icon-goods" style="color:#ff9c6e"/>
            <p>商品管理</p>
          </router-link>
        </el-card>
      </el-col>
      <el-col v-bind="grid" class="ivu-mb">
        <el-card :bordered="false">
          <router-link :to="{path:'/order/index'}">
            <i class="el-icon-s-order" style="color:#b37feb"/>
            <p>订单管理</p>
          </router-link>
        </el-card>
      </el-col>
      <el-col v-bind="grid" class="ivu-mb">
        <el-card :bordered="false">
          <router-link :to="{path:'/market/integral'}">
            <i class="el-icon-coin" style="color:#ffd666"/>
            <p>积分管理</p>
          </router-link>
        </el-card>
      </el-col>
      <el-col v-bind="grid" class="ivu-mb">
        <el-card :bordered="false">
          <router-link :to="{path:'/market/article'}">
            <i class="el-icon-notebook-1" style="color:#5cdbd3"/>
            <p>文章管理</p>
          </router-link>
        </el-card>
      </el-col>
      <el-col v-bind="grid" class="ivu-mb">
        <el-card :bordered="false">
          <router-link :to="{path:'/market/distribution'}">
            <i class="el-icon-s-finance" style="color:#ff85c0"/>
            <p>分销管理</p>
          </router-link>
        </el-card>
      </el-col>
      <el-col v-bind="grid" class="ivu-mb">
        <el-card :bordered="false">
          <router-link :to="{path:'/market/couponsList'}">
            <i class="el-icon-s-ticket" style="color:#ffc069"/>
            <p>优惠券</p>
          </router-link>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      grid: {
        xl: 3,
        lg: 3,
        md: 6,
        sm: 8,
        xs: 8
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ivu-mb {
  margin-bottom: 10px;
}

//.divBox {
//  padding: 0 20px !important;
//}

.dashboard-console-grid {
  text-align: center;

  .ivu-card-body {
    padding: 0;
  }

  i {
    font-size: 32px;
  }

  a {
    display: block;
    color: inherit;
  }

  p {
    margin-top: 8px;
  }
}
</style>
