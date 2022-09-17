<template>
  <div>
    <el-button :loading="loading" style="margin-left:1.6%;" size="medium" type="primary" @click="exportFile('word',2)">生成WORD</el-button>
    <el-button :loading="loading" style="margin-left:1.6%;" size="medium" type="success" @click="exportFile('excel',2)">生成EXCEL</el-button>
    <el-button :loading="loading" style="margin-left:1.6%;" size="medium" type="warning" @click="exportFile('html',2)">生成HTML</el-button>
    <el-button :loading="loading" style="margin-left:1.6%;" size="medium" type="info" @click="exportFile('md',2)">生成MD</el-button>
  </div>
</template>

<script>
import { download } from '@/api/generator/codeScrewConfig'
import { downloadFile } from '@/utils'
export default {
  name: 'Index',
  data() {
    return {
    }
  },
  computed: {
  },
  mounted() {

  },
  methods: {
    exportFile(fileType, type) {
      let suffix = 'doc'
      if (fileType === 'html') {
        suffix = 'html'
      } else if (fileType === 'excel') {
        suffix = 'xlsx'
      } else if (fileType === 'md') {
        suffix = 'md'
      }
      download(fileType, type).then(data => {
        downloadFile(data, '表结构文档', suffix)
      })
    }
  }
}
</script>

<style scoped>
  .editor{
    text-align:left;
    margin: 20px;
    width: 730px;
  }
 ::v-deep .w-e-text-container {
    height: 360px !important;
  }
</style>
