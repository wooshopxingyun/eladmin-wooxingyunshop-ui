<template>
  <div style="height: 100%">
    <div style="margin: 20px;"></div>
    <el-form label-width="150px" :model="form" :ref="form">
      <el-form-item label="商城管理端地址:" prop="adminUrl">
        <el-input v-model="form.value.adminUrl" style="width: 370px;"></el-input>
      </el-form-item>
      <el-form-item label="移动端api地址:" prop="appApiUrl">
        <el-input v-model="form.value.appApiUrl" style="width: 370px;"></el-input>
      </el-form-item>
      <el-form-item label="移动端H5地址:" prop="appApiUrl">
        <el-input v-model="form.value.appH5Url" style="width: 370px;"></el-input>
      </el-form-item>
      <el-form-item label="充值按钮:" prop="appApiUrl">
        <el-radio-group v-model="form.value.rechargeOff">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="全场包邮设置:" prop="appApiUrl">
        <el-radio-group v-model="form.value.goodsTransfeeCharge">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="全场满额包邮（元）:" v-if="form.value.goodsTransfeeCharge===1">
        <el-input-number v-model="form.value.freight" :step="1" :min="0" :precision="2"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitFormMp()" v-permission="['admin','wooSysConfig:basics_sumbit']">立即保存
        </el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import querySysconfig, {querySysconfigweixinMP, edit, add} from '@/api/wooSysConfig'
import CRUD, {presenter, header, form, crud} from '@crud/crud'

const defaultCrud = CRUD({
  title: '系统配置',
  url: 'api/wooSysConfig',
  query: {menuName: 'WOOSHOP_SYSCONFIG_BASICSSHOP'},
  sort: 'sort,asc',
  crudMethod: {...querySysconfig}
})
const defaultForm = {
  id: null,
  menuName: 'WOOSHOP_SYSCONFIG_BASICSSHOP',
  value: {
    adminUrl: '',
    appApiUrl: '',
    appH5Url: '',
    rechargeOff: 0,//是否开启充值
    goodsTransfeeCharge: 0,//是否开启满减邮费
    freight: 0,//满免邮费
    sort: 99,
    id: null,
    menuName: 'WOOSHOP_SYSCONFIG_BASICSSHOP',
    enabled: 1
  },
  enabled: 1,
  sort: 99
}
export default {
  name: "basicsShop",
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      labelPosition: 'top',
    }
  }, created() {
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 获取数据后设置好接口地址
    [CRUD.HOOK.afterRefresh](crud, form) {
      console.log('微信小程序 获取数据后WOOSHOP_SYSCONFIG_BASICSSHOP', this.crud)
      this.crud.data.forEach(item => {
        // debugger
        item.value = JSON.parse(item.value)
      })
      this.crud.toEdit(this.crud.data[0])

      console.log('微信小程序 获取数据后2222', this.crud)
    },
    submitFormMp() {
      if (this.form.id === null) {
        add(this.form).then(res => {
          this.$message({
            message: '提交成功',
            type: 'success'
          });
        })
      } else {
        edit(this.form).then(res => {
          this.$message({
            message: '提交成功',
            type: 'success'
          });
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
