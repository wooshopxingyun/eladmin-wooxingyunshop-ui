<template>
  <div style="height: 100%">

    <div style="margin: 20px;"></div>
    <el-form label-width="200px" :model="form" :ref="form">
      <el-form-item label="公众号 AppID:">
        <el-input v-model="form.value.appId" style="width: 370px;"></el-input>
      </el-form-item>
      <el-form-item label="公众号 AppSecret:">
        <el-input v-model="form.value.appSecret" style="width: 370px;" type="password"></el-input>
      </el-form-item>
      <el-form-item label="公众号验证 token:">
        <el-input v-model="form.value.token" style="width: 370px;"></el-input>
      </el-form-item>
      <el-form-item label="公众号 EncodingAESKey:">
        <el-input v-model="form.value.encodingAESKey" style="width: 370px;" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitFormMp(formGonzonghaoMP)" v-permission="['admin','wooSysConfig:weixinGonZongHao_sumbit']">立即保存</el-button>
        <!--        <el-button @click="resetForm(formAliyunSms)">取消</el-button>-->
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import querySysconfig, {querySysconfigweixinMP,getweixinMPConfig,edit} from '@/api/wooSysConfig'
import CRUD, {presenter, header, form, crud} from '@crud/crud'

const defaultCrud = CRUD({
  title: '系统配置',
  url: 'api/wooSysConfig',
  query: {menuName: 'WOOSHOP_SYSCONFIG_GONZONGHAOMP'},
  sort: 'sort,asc',
  crudMethod: {...querySysconfig}
})
const defaultForm = {
  id: null,
  menuName: 'WOOSHOP_SYSCONFIG_GONZONGHAOMP',
  value: {
    appId: '',
    appSecret: '',
    sort: 99,
    id: null,
    token: '',
    encodingAESKey: '',
    menuName: 'WOOSHOP_SYSCONFIG_GONZONGHAOMP',
    enabled: 1
  },
  enabled: 1,
  sort: 99
}
export default {
  name: "weixinGonZongHao",
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      labelPosition: 'top',
      formGonzonghaoMP: {
        id: '',
        appId: '',
        appSecret: '',
        token: '',
        encodingAESKey: '',
        enabled: true,
        menuName: 'WOOSHOP_SYSCONFIG_GONZONGHAOMP'
      }
    }
  },created() {
    // console.log('打印进来页面', this.formWechatMP.menuName)
    // this.getweixinMPdata()

  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },// 获取数据后设置好接口地址
    [CRUD.HOOK.afterRefresh](crud, form) {
      this.crud.data.forEach(item => {
        item.value = JSON.parse(item.value)
      })
      this.crud.toEdit(this.crud.data[0])
      console.log('微信小程序 获取数据后', this.form)
    },
    getweixinMPdata() {
      querySysconfigweixinMP('WOOSHOP_SYSCONFIG_GONZONGHAOMP').then(res => {
        console.log('进来weixinmp', res)
        this.formGonzonghaoMP = JSON.parse(res.value)
      })
    },
    submitFormMp() {
      edit(this.form).then(res => {
        this.$message({
          message: '提交成功',
          type: 'success'
        });
      })

    }
  }
}
</script>

<style scoped>

</style>
