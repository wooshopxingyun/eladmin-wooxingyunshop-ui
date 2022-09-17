<template>
  <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="150px">
    <el-form-item label="积分抵用" prop="convertibility">
      <el-input-number v-model="form.convertibility" :step="1" :min="0" :precision="2" ></el-input-number>
      <span style="color: #C0C0C0;margin-left: 10px;">积分抵用比例(1积分抵多少金额)</span>
    </el-form-item>
    <el-form-item label="赠送积分" prop="giveIntegral">
      <el-input-number v-model="form.giveIntegral" :step="1" :min="0" ></el-input-number>
      <span style="color: #C0C0C0;margin-left: 10px;">下单赠送积分比例（实际支付1元赠送多少积分）   </span>
    </el-form-item>
<!--    <el-form-item label="冻结天数" prop="freezeDate">
      <el-input-number v-model="form.freezeDate" :step="1" :min="0"
      ></el-input-number>
      <span style="color: #C0C0C0;margin-left: 10px;">积分冻结时间(天)</span>
    </el-form-item>-->
<!--    <el-form-item label="状态">
      <el-radio-group v-model="form.enabled">
        <el-radio :label="1">开启</el-radio>
        <el-radio :label="0">关闭</el-radio>
      </el-radio-group>
    </el-form-item> wooSysConfig:distribution_submit  -->
    <el-form-item label="">
      <el-button :loading="loading" size="medium" type="primary" @click="doSubmit"
                 v-permission="['admin','wooSysConfig:integralConfig_submit']" >保存配置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {getAliyunSms, querySysconfig} from '@/api/wooSysConfig'
export default {
  name: "integralConfig",
  data() {
    return {
      loading: false,
      form: {
        menuId: null,
        menuName: 'WOOSHOP_SYSCONFIG_INTEGRAL',
        convertibility: 1.00,
        giveIntegral: 1,
        // freezeDate: null,
        enabled: 1
      },
      rules: {
        convertibility: [
          {required: true, message: '请输入积分抵扣', trigger: 'blur'}
        ], giveIntegral: [
          {required: true, message: '请输入赠送积分比例', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getDistributioncConfig()
  },
  methods: {
    getDistributioncConfig() {
      querySysconfig('WOOSHOP_SYSCONFIG_INTEGRAL').then(res => {
        console.log(JSON.parse(res.value))
        console.log(res.value)
        console.log(JSON.parse(res.value).menuId)
        this.form.convertibility = JSON.parse(res.value).convertibility
        this.form.giveIntegral = JSON.parse(res.value).giveIntegral
        this.form.menuId = res.menuId
      })
    },
    doSubmit() {
      //提交
      getAliyunSms(this.form).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped>

</style>
