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
          <el-form-item label="微信关键字回复id主键">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="关键字" prop="replyKey">
            <el-input v-model="form.replyKey" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="回复类型" prop="replyType">
            <el-input v-model="form.replyType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="回复数据" prop="replyData">
            <el-input v-model="form.replyData" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="0=不可用  1 =可用" prop="isStatus">
            <el-input v-model="form.isStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否隐藏">
            <el-input v-model="form.replyHide" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="逻辑删除:1删除">
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
        <el-table-column prop="id" label="微信关键字回复id主键" :show-overflow-tooltip="true" />
        <el-table-column prop="replyKey" label="关键字" :show-overflow-tooltip="true" />
        <el-table-column prop="replyType" label="回复类型" :show-overflow-tooltip="true" />
        <el-table-column prop="replyData" label="回复数据" :show-overflow-tooltip="true" />
        <el-table-column prop="isStatus" label="0=不可用  1 =可用" :show-overflow-tooltip="true" />
        <el-table-column prop="replyHide" label="是否隐藏" :show-overflow-tooltip="true" />
        <el-table-column prop="isDel" label="逻辑删除:1删除" :show-overflow-tooltip="true" />
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
        <el-table-column v-permission="['admin','wooshopWechatReply:edit','wooshopWechatReply:del']" label="操作" width="150px" align="center">
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
import crudWooshopWechatReply from '@/api/wooshopWechatReply'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '微信公众号回复表', url: 'api/wooshopWechatReply', sort: 'id,desc', crudMethod: { ...crudWooshopWechatReply }})
const defaultCrud = CRUD({ title: '微信公众号回复表', url: 'api/wooshopWechatReply', sort: '', crudMethod: { ...crudWooshopWechatReply }})
const defaultForm = { id: null, replyKey: null, replyType: null, replyData: null, isStatus: null, replyHide: null, isDel: null, createTime: null, updateTime: null }
export default {
  name: 'WooshopWechatReply',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      
      permission: {
        add: ['admin', 'wooshopWechatReply:add'],
        edit: ['admin', 'wooshopWechatReply:edit'],
        del: ['admin', 'wooshopWechatReply:del']
      },
      rules: {
        replyKey: [
          { required: true, message: '关键字不能为空', trigger: 'blur' }
        ],
        replyType: [
          { required: true, message: '回复类型不能为空', trigger: 'blur' }
        ],
        replyData: [
          { required: true, message: '回复数据不能为空', trigger: 'blur' }
        ],
        isStatus: [
          { required: true, message: '0=不可用  1 =可用不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'id', display_name: '微信关键字回复id主键' },
        { key: 'replyType', display_name: '回复类型' },
        { key: 'replyData', display_name: '回复数据' },
        { key: 'isStatus', display_name: '0=不可用  1 =可用' },
        { key: 'replyHide', display_name: '是否隐藏' },
        { key: 'isDel', display_name: '逻辑删除:1删除' }
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
        delete this.crud.params.replyType
        delete this.crud.params.replyData
        delete this.crud.params.isStatus
        delete this.crud.params.replyHide
        delete this.crud.params.isDel
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
