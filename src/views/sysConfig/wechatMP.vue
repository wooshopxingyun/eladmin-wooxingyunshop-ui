<template>
  <div style="height: 100%">

    <div style="margin: 20px;"></div>
    <el-form label-width="150px" :model="form" :ref="form">
      <el-form-item label="小程序 AppID:">
        <el-input v-model="form.value.appId" style="width: 370px;"></el-input>
      </el-form-item>
      <el-form-item label="小程序 AppSecret:">
        <el-input v-model="form.value.appSecret" style="width: 370px;" type="password"></el-input>
      </el-form-item>
      <el-form-item label="单独注册商户号:">
        <el-radio-group v-model="form.value.wechatMpPay">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商户号编码:" v-if="form.value.wechatMpPay===1">
        <el-input v-model="form.value.mchId" style="width: 370px;"></el-input>
      </el-form-item>
      <el-form-item label="商户密钥:"  v-if="form.value.wechatMpPay===1">
        <el-input v-model="form.value.secretKey" style="width: 370px;" type="password"></el-input>
      </el-form-item>
      <el-form-item label="微信证书: " v-if="form.value.wechatMpPay===1">
        <el-upload
          ref="upload"
          multiple
          drag
          :limit="1"
          :before-upload="beforeUpload"
          :auto-upload="true"
          :headers="headers"
          :on-success="handleSuccess"
          :on-error="handleError"
          :action="WeiXinPayFileUploadApi"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div v-if="form.value.payCertificateName!==''">{{form.value.payCertificateName}}</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitFormMp(formWechatMP)"  v-permission="['admin','wooSysConfig:wechatMP_sumbit']">立即保存</el-button>
        <!--        <el-button @click="resetForm(formAliyunSms)">取消</el-button>-->
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import querySysconfig, {querySysconfigweixinMP, getweixinMPConfig, edit} from '@/api/wooSysConfig'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import {mapGetters} from "vuex";
import {getToken} from '@/utils/auth'

const defaultCrud = CRUD({
  title: '系统配置',
  url: 'api/wooSysConfig',
  query: {menuName: 'WOOSHOP_SYSCONFIG_WECHATMP'},
  sort: 'sort,asc',
  crudMethod: {...querySysconfig}
})
const defaultForm = {
  id: null,
  menuName: 'WOOSHOP_SYSCONFIG_WECHATMP',
  value: {
    appId: '',
    appSecret: '',
    sort: 99,
    id: null,
    signName: '',
    templateId: '',
    accessKey: '',
    wechatMpPay: 0,
    mchId: '',
    secretKey: '',
    payCertificateName: '',
    region: '',
    accessKeySecret: '',
    menuName: 'WOOSHOP_SYSCONFIG_WECHATMP',
    enabled: 1
  },
  enabled: 1,
  sort: 99
}
export default {
  name: "wechatMP",
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      headers: {'Authorization': getToken()},
      labelPosition: 'top',
      formWechatMP: {
        id: '',
        appId: '',
        appSecret: '',
        wechatMpPay: 0,
        mchId: '',
        secretKey: '',
        payCertificateName: '',
        enabled: true,
        menuName: 'WOOSHOP_SYSCONFIG_WECHATMP'
      }
    }
  }, created() {
    // console.log('打印进来页面', this.formWechatMP.menuName)
    // this.getweixinMPdata()

  },
  computed: {
    ...mapGetters([
      'baseApi',
      'WeiXinPayFileUploadApi'
    ])
  },
  methods: {
    // 上传文件
    upload() {
      this.$refs.upload.submit()
    },
    beforeUpload(file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      return isLt2M
    },
    handleSuccess(response, file, fileList) {
      this.form.value.payCertificateName=response;
      console.log("上传微信支付文件成功",response)
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    },
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },// 获取数据后设置好接口地址
    [CRUD.HOOK.afterRefresh](crud, form) {
      this.crud.data.forEach(item => {
        // debugger
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
