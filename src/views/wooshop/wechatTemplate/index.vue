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
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="模板编号" prop="tempCode">
            <el-input v-model="form.tempCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="模板名称" prop="tempName">
            <el-input v-model="form.tempName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="回复内容" prop="tempContent">
            <el-input v-model="form.tempContent" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="模板ID">
            <el-input v-model="form.tempId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="添加时间" prop="createTime">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态:0不启用/1启用" prop="isStatus">
            <el-input v-model="form.isStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="isDel">
            <el-input v-model="form.isDel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="类型：temp:模板消息 sub:订阅消息">
            <el-input v-model="form.tempType" style="width: 370px;" />
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
        <el-table-column prop="id" label="主键id" :show-overflow-tooltip="true" />
        <el-table-column prop="tempCode" label="模板编号" :show-overflow-tooltip="true" />
        <el-table-column prop="tempName" label="模板名称" :show-overflow-tooltip="true" />
        <el-table-column prop="tempContent" label="回复内容" :show-overflow-tooltip="true" />
        <el-table-column prop="tempId" label="模板ID" :show-overflow-tooltip="true" />
        <el-table-column prop="createTime" label="添加时间" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isStatus" label="状态:0不启用/1启用" :show-overflow-tooltip="true" />
        <el-table-column prop="isDel" label="isDel" :show-overflow-tooltip="true" />
        <el-table-column prop="tempType" label="类型：temp:模板消息 sub:订阅消息" :show-overflow-tooltip="true" />
        <el-table-column v-permission="['admin','wooshopWechatTemplate:edit','wooshopWechatTemplate:del']" label="操作" width="150px" align="center">
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
import crudWooshopWechatTemplate from '@/api/wooshopWechatTemplate'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
// const defaultCrud = CRUD({ title: '微信模板', url: 'api/wooshopWechatTemplate', sort: 'id,desc', crudMethod: { ...crudWooshopWechatTemplate }})
const defaultCrud = CRUD({ title: '微信模板', url: 'api/wooshopWechatTemplate', sort: '', crudMethod: { ...crudWooshopWechatTemplate }})
const defaultForm = { id: null, tempCode: null, tempName: null, tempContent: null, tempId: null, createTime: null, updateTime: null, isStatus: null, isDel: null, tempType: null }
export default {
  name: 'WooshopWechatTemplate',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'wooshopWechatTemplate:add'],
        edit: ['admin', 'wooshopWechatTemplate:edit'],
        del: ['admin', 'wooshopWechatTemplate:del']
      },
      rules: {
        tempCode: [
          { required: true, message: '模板编号不能为空', trigger: 'blur' }
        ],
        tempName: [
          { required: true, message: '模板名称不能为空', trigger: 'blur' }
        ],
        tempContent: [
          { required: true, message: '回复内容不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '添加时间不能为空', trigger: 'blur' }
        ],
        isStatus: [
          { required: true, message: '状态:0不启用/1启用不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'id', display_name: '主键id' },
        { key: 'tempCode', display_name: '模板编号' },
        { key: 'tempId', display_name: '模板ID' },
        { key: 'isStatus', display_name: '状态:0不启用/1启用' },
        { key: 'tempType', display_name: '类型：temp:模板消息 sub:订阅消息' }
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
        delete this.crud.params.id
        delete this.crud.params.tempCode
        delete this.crud.params.tempId
        delete this.crud.params.isStatus
        delete this.crud.params.tempType
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
