<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--  修改弹窗    -->
      <el-dialog
        width="30%"
        title="修改连续签到奖励积分"
        :visible.sync="innerVisible"
        append-to-body>
        <el-form ref="formValue" :model="formValue" :rules="rules" size="small" label-width="80px">
          <el-form-item label="签到时间">
            <el-input
              v-model="formValue.signDay==='dayOne'?'第一天':formValue.signDay==='dayTwo'?'第二天':formValue.signDay==='dayThree'?'第三天':formValue.signDay==='dayFour'?'第四天':formValue.signDay==='dayFive'?'第五天':formValue.signDay==='daySix'?'第六天':'第七天'"
              style="width: 80%;" :disabled="true"/>
          </el-form-item>
          <el-form-item label="赠送积分" prop="giveIntegral">
            <!--            <el-input v-model="formValue.giveIntegral" style="width:  80%;"/>-->
            <el-input-number v-model="formValue.giveIntegral" :step="1" :min="0" style="width:  80%;"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="签到经验" prop="experience">
            <!--            <el-input v-model="formValue.giveIntegral" style="width:  80%;"/>-->
            <el-input-number v-model="formValue.experience" :step="1" :min="0" style="width:  80%;"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="">
            <el-button size="medium" type="primary" @click="doSubmit"  v-permission="['admin','wooSysConfig:signConfig_submit']" >保存配置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--  列表    -->
      <el-table ref="table" :default-sort="{prop: 'index', order: 'descending'}" :data="form.value.value" size="small"
                style="width: 100%;">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="signDay" label="连续签到天数" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.day == 1">
              第一天
            </div>
            <div v-if="scope.row.day == 2">
              第二天
            </div>
            <div v-if="scope.row.day == 3">
              第三天
            </div>
            <div v-if="scope.row.day == 4">
              第四天
            </div>
            <div v-if="scope.row.day == 5">
              第五天
            </div>
            <div v-if="scope.row.day == 6">
              第六天
            </div>
            <div v-if="scope.row.day == 7">
              第七天
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="giveIntegral" label="奖励积分" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="experience" label="奖励经验" :show-overflow-tooltip="true" align="center"/>
        <el-table-column v-permission="['admin','wooSysConfig:edit']" label="操作"
                         width="150px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editClick(scope.row,scope.$index)"></el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
import {getAliyunSms, querySysconfig, add} from '@/api/wooSysConfig'
export default {
  name: "signConfig",
  data() {
    return {
      form: {
        id: null,
        menuId: null,
        menuName: 'WOOSHOP_SYSCONFIG_SIGNCONFIG',
        value: {
          menuName: 'WOOSHOP_SYSCONFIG_SIGNCONFIG',
          enabled: 1,
          value: []
        },
        enabled: 1,
        sort: 999
      },
      formValue: [],
      formValueIndex: 0,
      innerVisible: false,
      rules: {
        giveIntegral: [
          {required: true, message: '请输入赠送积分', trigger: 'blur'}
        ],
        experience: [
          {required: true, message: '请输入经验', trigger: 'blur'}
        ],
      }
    }
  },
  created() {
    this.getSignConfig()
  },
  watch: {},
  methods: {
    getSignConfig() {
      querySysconfig('WOOSHOP_SYSCONFIG_SIGNCONFIG').then(res => {
        // console.log(JSON.parse(res.value))
        console.log(res)
        // console.log(JSON.parse(res.value).menuId)
        this.form.id = res.id
        this.form.value.value = JSON.parse(res.value).value
        this.form.menuId = res.menuId
      })
    },
    editClick(item, index) {
      console.log('点击修改', item, index)
      this.formValue = item
      this.formValueIndex = index
      this.innerVisible = true
    },
    doSubmit() {
      this.form.value.value[this.formValueIndex] = this.formValue
      console.log('提交', this.form.value)
      add(this.form).then(res => {
        console.log(res)
      })
      // this.formValue = []
      this.formValueIndex = 0
      this.innerVisible = false
    }
  }
}
</script>

<style scoped>

</style>
