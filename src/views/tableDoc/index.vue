<template>
  <el-tabs v-model="activeName" style="padding-left: 8px;">
    <el-tab-pane label="文档生成配置" name="first">
      <Config />
    </el-tab-pane>
    <el-tab-pane label="文档生成导出" name="second">
      <Export />
    </el-tab-pane>
    <el-tab-pane label="使用说明" name="third">
      <div>
        <blockquote class="my-blockquote"> 文档生成配置</blockquote>
        <pre class="my-code">
 # 忽略表、表前缀、表后缀有多个用英文逗号“,”分隔
 # 指定表，表前缀，表后缀有多个用英文逗号“,”分隔
        </pre>
        <blockquote class="my-blockquote">更多帮助</blockquote>
        <pre class="my-code">更多帮助请查看文档：<a style="color:#009688" href="https://gitee.com/rayson517/screw-pro" target="_black">screw-pro</a></pre>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Config from './config'
import Export from './export'
export default {
  name: 'Email',
  components: { Config, Export },
  data() {
    return {
      activeName: 'second'
    }
  }
}
</script>

<style scoped>
</style>
