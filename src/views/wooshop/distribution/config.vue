<template>
  <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="115px">
    <el-form-item label="一级返佣比例" prop="distribution">
      <el-input-number v-model="form.distribution" :step="1" :min="0" :max="100"
                       ></el-input-number>
      %
      <span style="color: #C0C0C0;margin-left: 10px;">百分比</span>
    </el-form-item>
    <el-form-item label="二级返佣比例" prop="distributionTwo">
      <el-input-number v-model="form.distributionTwo" :step="1" :min="0" :max="100"
                       ></el-input-number>
      %
      <span style="color: #C0C0C0;margin-left: 10px;">百分比</span>
    </el-form-item>
    <el-form-item label="最低提现金额" prop="extractMoney">
      <el-input-number v-model="form.extractMoney" :step="1" :min="0"
                       ></el-input-number>
    </el-form-item>
    <el-form-item label="状态">
      <el-radio-group v-model="form.enabled">
        <el-radio :label="1">开启</el-radio>
        <el-radio :label="0">关闭</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="">
      <el-button :loading="loading" size="medium" type="primary" @click="doSubmit"
                 v-permission="['admin','wooSysConfig:distribution_submit']"
      >保存配置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {getAliyunSms, querySysconfig} from '@/api/wooSysConfig'
export default {
  name: "config",
  data() {
    return {
      loading: false,
      form: {
        id:null,
        menuId: null,
        menuName: 'WOOSHOP_SYSCONFIG_DISTRIBUTION',
        distribution: null,
        distributionTwo: null,
        extractMoney: null,
        enabled: 1
      },
      rules: {
        distributionTwo: [
          {required: true, message: '请输入一级返佣比例', trigger: 'blur'}
        ], distribution: [
          {required: true, message: '请输入二级返佣比例', trigger: 'blur'}
        ], extractMoney: [
          {required: true, message: '请输入最低提现金额', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getDistributioncConfig()
  },
  methods: {
    getDistributioncConfig() {
      querySysconfig('WOOSHOP_SYSCONFIG_DISTRIBUTION').then(res => {
        console.log(JSON.parse(res.value))
        console.log(res.value)
        console.log(JSON.parse(res.value).menuId)
        this.form.distribution = JSON.parse(res.value).distribution
        this.form.distributionTwo = JSON.parse(res.value).distributionTwo
        this.form.extractMoney = JSON.parse(res.value).extractMoney
        this.form.menuId = res.menuId
        this.form.id = res.id
      })
    },
    doSubmit() {
      getAliyunSms(this.form).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped>

</style>
