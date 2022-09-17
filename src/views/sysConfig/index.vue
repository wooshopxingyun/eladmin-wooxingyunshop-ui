<template>
  <div class="app-container">
    <!--工具栏-->
    <el-tabs type="border-card" >
      <el-tab-pane label="商城基础配置" >
        <basics-shop ></basics-shop>
      </el-tab-pane>
      <el-tab-pane label="阿里云短信配置" >
        <aliyunSms ></aliyunSms>
      </el-tab-pane>
      <el-tab-pane label="小程序配置">
        <wechatMP></wechatMP>
      </el-tab-pane>
      <el-tab-pane label="地图配置">
        <mapKey></mapKey>
      </el-tab-pane>
      <el-tab-pane label="公众号配置">
        <weixin-gon-zong-hao></weixin-gon-zong-hao>
      </el-tab-pane>
      <el-tab-pane label="微信支付配置">
        <weixinPaySys></weixinPaySys>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import {querySysconfig} from '@/api/wooSysConfig'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import MaterialList from '@/components/material'
import aliyunSms from './aliyunSms'
import wechatMP from './wechatMP'
import mapKey from "./mapKey";
import basicsShop from "./basicsShop";
import weixinPaySys from "./weixinPaySys";
import weixinGonZongHao from "./weixinGonZongHao";

// crud交由presenter持有
const defaultCrud = CRUD({ title: '系统配置', url: 'api/wooSysConfig', sort: 'sort,asc' ,queryOnPresenterCreated: false})
const defaultForm = { id: null, menuName: null, value: null, enabled: null }
export default {
  name: 'WooSysConfig',
  components: { crudOperation, rrOperation, udOperation, MaterialList, aliyunSms, wechatMP,mapKey,basicsShop,weixinPaySys,weixinGonZongHao },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        // add: ['admin', 'wooSysConfig:add'],
        edit: ['admin', 'wooSysConfig:edit'],
        del: ['admin', 'wooSysConfig:del']
      },
      rules: {
      }
    }
  },
  watch: {
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }, // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    }
  }
}

</script>

<style scoped>
  .table-img {
    display: inline-block;
    text-align: center;
    background: #ccc;
    color: #fff;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    width: 32px;
    height: 32px;
    line-height: 32px;
  }
  .el-card {
    min-width: 100%;
    height: 100%;
    margin-right: 20px;
    transition: all .5s;
  }
  .el-row {
    margin-bottom: 20px;
    display: flex;
  flex-wrap: wrap;

  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 250px;/**设置高度*/
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
