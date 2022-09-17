<template>
  <div style="height: 100%">

    <div style="margin: 20px;"></div>
    <el-form label-width="150px" :model="form" :ref="form">
      <el-form-item label="短信签名 :">
        <el-input v-model="form.value.signName" style="width: 370px;"></el-input>
      </el-form-item>
      <el-form-item label="短信模板ID :">
        <el-input v-model="form.value.templateId" style="width: 370px;"></el-input>
      </el-form-item>
      <el-form-item label="accessKey :">
        <el-input v-model="form.value.accessKey" style="width: 370px;" type="password"></el-input>
      </el-form-item>
      <el-form-item label="region :">
        <el-input v-model="form.value.region" style="width: 370px;" type="password"></el-input>
      </el-form-item>
      <el-form-item label="accessKeySecret :">
        <el-input v-model="form.value.accessKeySecret" style="width: 370px;" type="password"></el-input>
      </el-form-item>
      <el-form-item label="开启状态 :">
        <el-switch v-model="form.enabled" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm" v-permission="['admin','wooSysConfig:aliyunsms_sumbit']">立即保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import {getAliyunSms, querySysconfig, edit} from '@/api/wooSysConfig'
// import querySysconfig from '@/api/wooSysConfig'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import FilesModal from "../filesModal/FilesModal";

const defaultCrud = CRUD({
  title: '系统配置',
  url: 'api/wooSysConfig',
  query: {menuName: 'WOOSHOP_SYSCONFIG_ALIYUNSMS'},
  sort: 'sort,asc',
  crudMethod: {...querySysconfig}
})
const defaultForm = {
  id: null,
  menuName: 'WOOSHOP_SYSCONFIG_ALIYUNSMS',
  value: {
    sort: 99,
    id: null,
    signName: '',
    templateId: '',
    accessKey: '',
    region: '',
    accessKeySecret: '',
    menuName: 'WOOSHOP_SYSCONFIG_ALIYUNSMS',
    enabled: 1
  },
  enabled: 1,
  sort: 99
}

export default {
  name: "aliyunSms",
  // components: {crudOperation, rrOperation, udOperation, pagination},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      labelPosition: 'top',
      formAliyunSms: {
        id: '',
        signName: '',
        templateId: '',
        accessKey: '',
        region: '',
        accessKeySecret: '',
        enabled: 1,
        menuName: 'WOOSHOP_SYSCONFIG_ALIYUNSMS'
      }
    }
  },
  created() {
    console.log('打印进来页面', this.formAliyunSms.menuName)
    // this.getsms()

  },
  watch: {},
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },// 获取数据后设置好接口地址
    [CRUD.HOOK.afterRefresh](crud, form) {
      // this.homeMeunData = []
      this.crud.data.forEach(item => {
        // this.homeMeunData.push(JSON.parse(item.value))
        item.value = JSON.parse(item.value)
      })
      this.crud.toEdit(this.crud.data[0])
      // this.form =this.crud.data[0]
      console.log('获取数据后', this.form)
      // this.crud.status.edit=1
    },
    getsms() {
      querySysconfig('WOOSHOP_SYSCONFIG_ALIYUNSMS').then(res => {
        console.log(JSON.parse(res.value))
        console.log(res.value)
        console.log(JSON.parse(res.value).id)
        this.formAliyunSms = JSON.parse(res.value)
        this.formAliyunSms.id = JSON.parse(res.value).id
      })
    },
    submitForm() {
      // console.log('打印获取的数据', this.form)
      // this.crud.toEdit(this.crud.data[0])
      // this.crud.submitCU
      edit(this.form).then(res => {
        this.$message({
          message: '提交成功',
          type: 'success'
        });
      })

      /*this.$refs[formName].validate((valid) => {
        if (valid) {
          getAliyunSms(formName).then(res => {
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
    /*    resetForm(formName) {
          this.$refs[formName].resetFields();
        }*/
  }
}
</script>

<style scoped>

</style>
