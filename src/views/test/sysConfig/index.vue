<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="主键id">
            <el-input v-model="form.menuId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="值">
            <el-input v-model="form.value" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态：1启用、0禁用">
            <el-input v-model="form.enabled" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="form.menuName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="isDel">
            <el-input v-model="form.isDel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="createTime">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="updateTime">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" :default-sort = "{prop: 'index', order: 'descending'}" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" prop="index" sortable >
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="menuId" label="主键id" :show-overflow-tooltip="true" />
        <el-table-column prop="value" label="值" :show-overflow-tooltip="true" />
        <el-table-column prop="enabled" label="状态：1启用、0禁用" :show-overflow-tooltip="true" />
        <el-table-column prop="menuName" label="名称" :show-overflow-tooltip="true" />
        <el-table-column prop="isDel" label="isDel" :show-overflow-tooltip="true" />
        <el-table-column prop="createTime" label="createTime" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="updateTime" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','wooSysConfig:edit','wooSysConfig:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudWooSysConfig from '@/api/wooSysConfig'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '系统配置', url: 'api/wooSysConfig', sort: 'menuId,desc', crudMethod: { ...crudWooSysConfig }})
const defaultCrud = CRUD({ title: '系统配置', url: 'api/wooSysConfig', sort: '', crudMethod: { ...crudWooSysConfig }})
const defaultForm = { menuId: null, value: null, enabled: null, menuName: null, isDel: null, createTime: null, updateTime: null }
export default {
  name: 'WooSysConfig',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      
      permission: {
        add: ['admin', 'wooSysConfig:add'],
        edit: ['admin', 'wooSysConfig:edit'],
        del: ['admin', 'wooSysConfig:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'menuId', display_name: '主键id' },
        { key: 'enabled', display_name: '状态：1启用、0禁用' },
        { key: 'menuName', display_name: '名称' }
      ]
    }
  },
  watch: {
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      } else {
        delete this.crud.params.menuId
        delete this.crud.params.enabled
        delete this.crud.params.menuName
      }
      return true
    }, // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    }
  }
}


</script>

<style scoped>

</style>
