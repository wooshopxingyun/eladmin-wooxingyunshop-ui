<template>
  <div style="height: 100%">

    <div style="margin: 20px;"></div>
    <el-form label-width="150px" :model="form" :ref="form" :rules="rules" >
      <el-form-item label="微信APP支付ID:" prop="weixinAppId">
        <el-input v-model="form.value.apyAppId" style="width: 370px;"></el-input>
      </el-form-item>
      <el-form-item label="商户ID:" prop="sellerId">
        <el-input v-model="form.value.sellerId" style="width: 370px;"></el-input>
      </el-form-item>
      <el-form-item label="商户密钥:" prop="secretKey">
        <el-input v-model="form.value.secretKey" style="width: 370px;" type="password"></el-input>
      </el-form-item>
      <el-form-item label="微信证书: ">
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
        <el-button type="primary" @click="submitFormMp(formWeiXinPaySys)"
                   v-permission="['admin','wooSysConfig:weixinPaySys_sumbit']"
        >立即保存</el-button>
        <!--        <el-button @click="resetForm(formAliyunSms)">取消</el-button>-->
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
// import fileUpload from '@/components/file-upload'
import {getToken} from '@/utils/auth'
import querySysconfig, {querySysconfigweixinMP, getweixinMPConfig, WeiXinPaySys} from '@/api/wooSysConfig'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import {mapGetters} from "vuex";

const defaultCrud = CRUD({
  title: '系统配置',
  url: 'api/wooSysConfig',
  query: {menuName: 'WOOSHOP_SYSCONFIG_WEIXINPAYSYS'},
  sort: 'sort,asc',
  crudMethod: {...querySysconfig}
})
const defaultForm = {
  id: null,
  menuName: 'WOOSHOP_SYSCONFIG_WEIXINPAYSYS',
  // file: [],
  value: {
    apyAppId: '',
    sellerId: '',
    sort: 99,
    id: null,
    secretKey: '',
    payCertificateName: '',
    menuName: 'WOOSHOP_SYSCONFIG_WEIXINPAYSYS',
    enabled: 1
  },
  enabled: 1,
  sort: 99
}
export default {
  // components: { fileUpload },
  name: "weixinPaySys",
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      rules: {
        weixinAppId: [
          {required: true, message: '微信APP支付ID', trigger: 'blur'}
        ],
        sellerId: [
          {required: true, message: '商户ID', trigger: 'blur'}
        ],secretKey: [
          {required: true, message: '商户秘钥', trigger: 'blur'}
        ]
      },
      labelPosition: 'top',
      headers: {'Authorization': getToken()},
      formWeiXinPaySys: {
        id: '',
        apyAppId: '',
        sellerId: '',
        secretKey: '',
        payCertificateName: '',

        enabled: true,
        menuName: 'WOOSHOP_SYSCONFIG_WEIXINPAYSYS'
      },
      file: null,
    }
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'WeiXinPayFileUploadApi'
    ])
  }, methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },// 获取数据后设置好接口地址
    [CRUD.HOOK.afterRefresh](crud, form) {
      this.crud.data.forEach(item => {
        item.value = JSON.parse(item.value)

        // this.handleSuccess(item.payCertificateName,null,null)
      })
      this.crud.toEdit(this.crud.data[0])
      // this.fileList("http://localhost:8013/wooshopconfig/wooSysConfig")
      console.log('微信支付 获取数据后', this.form)
    },
    getweixinMPdata() {
      querySysconfigweixinMP('WOOSHOP_SYSCONFIG_WEIXINPAYSYS').then(res => {
        console.log('进来weixinmp', res)
        this.formWechatMP = JSON.parse(res.value)
      })
    },
    httpRequest(option) {
      console.log("请求的图片数据", option)
      this.file=option;
    },
    filechange(file) {
      console.log("请求的图片数据file", file)
      this.file=file;
    },
    submitFormMp() {
      if (this.form.value.payCertificateName===''){
        this.$message({
          message: '加密文件不能为空',
          type: 'success'
        })
        return false;
      }
      WeiXinPaySys(this.form).then(res => {
        this.$message({
          message: '提交成功',
          type: 'success'
        });
      })
    },
    // 上传文件
    upload() {
      this.$refs.upload.submit()
    },
    beforeUpload(file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        // this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      // this.form.name = file.name
      return isLt2M
    },
    handleSuccess(response, file, fileList) {
      // this.crud.notify('上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      // this.$refs.upload.clearFiles()
      // this.crud.status.add = CRUD.STATUS.NORMAL
      // this.crud.resetForm()
      // this.crud.toQuery()
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
      // this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
