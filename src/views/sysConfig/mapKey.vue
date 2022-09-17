<template>
  <div style="height: 100%">

    <div style="margin: 20px;"></div>
    <el-form label-width="80px" :model="form" :ref="form">
      <el-form-item label="地图 Key:">
        <el-input v-model="form.value.key" style="width: 370px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitFormMp()" v-permission="['admin','wooSysConfig:mapKey_sumbit']">立即保存</el-button>
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
  query: {menuName: 'WOOSHOP_SYSCONFIG_MAPKEY'},
  sort: 'sort,asc',
  crudMethod: {...querySysconfig}
})
const defaultForm = {
  id: null,
  menuName: 'WOOSHOP_SYSCONFIG_MAPKEY',
  value: {
    key: '',
    appSecret: '',
    sort: 99,
    id: null,
    menuName: 'WOOSHOP_SYSCONFIG_MAPKEY',
    enabled: 1
  },
  enabled: 1,
  sort: 99
}
export default {
  name: "mapkey",
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      labelPosition: 'top',

    }
  }, created() {
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
      querySysconfigweixinMP('WOOSHOP_SYSCONFIG_WECHATMP').then(res => {
        console.log('进来weixinmp', res)
        this.formWechatMP = JSON.parse(res.value)
      })
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

      // console.log('打印获取的数据', formWechatMP)
      /* this.$refs[formWechatMP].validate((valid) => {
         if (valid) {
           getweixinMPConfig(formWechatMP).then(res => {
             console.log(res)
           });
           this.$message({
             message: '提交成功',
             type: 'success'
           });
         } else {
           this.$message.error('保存失败');
           return false;
         }
       });*/
    }
  }
}
</script>

<style scoped>

</style>
