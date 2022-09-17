<template>
  <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="110px">
    <el-form-item label="版本号">
      <el-input v-model="form.version" style="width: 370px;" />
    </el-form-item>
    <el-form-item label="描述">
      <el-input v-model="form.description" style="width: 370px;" />
    </el-form-item>
    <el-form-item label="忽略表名">
      <el-input v-model="form.ignoreTableName" style="width: 370px;" />
    </el-form-item>
    <el-form-item label="忽略表前缀">
      <el-input v-model="form.ignoreTablePrefix" style="width: 370px;" />
    </el-form-item>
    <el-form-item label="忽略表后缀">
      <el-input v-model="form.ignoreTableSuffix" style="width: 370px;" />
    </el-form-item>
    <el-form-item label="指定表名生成">
      <el-input v-model="form.designatedTableName" style="width: 370px;" />
    </el-form-item>
    <el-form-item label="指定表前缀生成">
      <el-input v-model="form.designatedTablePrefix" style="width: 370px;" />
    </el-form-item>
    <el-form-item label="指定表后缀生成">
      <el-input v-model="form.designatedTableSuffix" style="width: 370px;" />
    </el-form-item>
    <el-form-item label="">
      <el-button :loading="loading" size="medium" type="primary" @click="doSubmit">保存配置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { get, edit } from '@/api/generator/codeScrewConfig'
export default {
  name: 'Config',
  data() {
    return {
      loading: false, form: { configId: 1, version: '', description: '', ignoreTableName: '', ignoreTablePrefix: '', ignoreTableSuffix: '', designatedTableName: '', designatedTablePrefix: '', designatedTableSuffix: '' },
      rules: {

      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      get().then(res => {
        if (res) {
          this.form = res
        }
      })
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          edit(this.form).then(res => {
            this.$notify({
              title: '修改成功',
              type: 'success',
              duration: 2500
            })
            this.loading = false
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
