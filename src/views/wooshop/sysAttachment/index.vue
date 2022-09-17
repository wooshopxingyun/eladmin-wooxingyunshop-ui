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
          <el-form-item label="附件名称" prop="attName">
            <el-input v-model="form.attName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="附件路径" prop="attDir">
            <el-input v-model="form.attDir" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="压缩图片路径">
            <el-input v-model="form.sattDir" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="附件大小" prop="attSize">
            <el-input v-model="form.attSize" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="附件类型" prop="attType">
            <el-input v-model="form.attType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类ID0编辑器,1产品图片,2拼团图片,3砍价图片,4秒杀图片,5文章图片,6组合数据图" prop="attPid">
            <el-input v-model="form.attPid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="图片上传类型 1本地 2七牛云 3OSS 4COS " prop="imageType">
            <el-input v-model="form.imageType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="图片上传模块类型 1 后台上传 2 用户生成" prop="moduleType">
            <el-input v-model="form.moduleType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户id">
            <el-input v-model="form.uid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="邀请码">
            <el-input v-model="form.inviteCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="createTime">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="updateTime">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="isDel">
            <el-input v-model="form.isDel" style="width: 370px;" />
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
        <el-table-column prop="attName" label="附件名称" :show-overflow-tooltip="true" />
        <el-table-column prop="attDir" label="附件路径" :show-overflow-tooltip="true" />
        <el-table-column prop="sattDir" label="压缩图片路径" :show-overflow-tooltip="true" />
        <el-table-column prop="attSize" label="附件大小" :show-overflow-tooltip="true" />
        <el-table-column prop="attType" label="附件类型" :show-overflow-tooltip="true" />
        <el-table-column prop="attPid" label="分类ID0编辑器,1产品图片,2拼团图片,3砍价图片,4秒杀图片,5文章图片,6组合数据图" :show-overflow-tooltip="true" />
        <el-table-column prop="imageType" label="图片上传类型 1本地 2七牛云 3OSS 4COS " :show-overflow-tooltip="true" />
        <el-table-column prop="moduleType" label="图片上传模块类型 1 后台上传 2 用户生成" :show-overflow-tooltip="true" />
        <el-table-column prop="uid" label="用户id" :show-overflow-tooltip="true" />
        <el-table-column prop="inviteCode" label="邀请码" :show-overflow-tooltip="true" />
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
        <el-table-column prop="isDel" label="isDel" :show-overflow-tooltip="true" />
        <el-table-column v-permission="['admin','wooshopSystemAttachment:edit','wooshopSystemAttachment:del']" label="操作" width="150px" align="center">
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
import crudWooshopSystemAttachment from '@/api/wooshopSystemAttachment'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '附件管理', url: 'api/wooshopSystemAttachment', sort: 'id,desc', crudMethod: { ...crudWooshopSystemAttachment }})
const defaultCrud = CRUD({ title: '附件管理', url: 'api/wooshopSystemAttachment', sort: '', crudMethod: { ...crudWooshopSystemAttachment }})
const defaultForm = { id: null, attName: null, attDir: null, sattDir: null, attSize: null, attType: null, attPid: null, imageType: null, moduleType: null, uid: null, inviteCode: null, createTime: null, updateTime: null, isDel: null }
export default {
  name: 'WooshopSystemAttachment',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      
      permission: {
        add: ['admin', 'wooshopSystemAttachment:add'],
        edit: ['admin', 'wooshopSystemAttachment:edit'],
        del: ['admin', 'wooshopSystemAttachment:del']
      },
      rules: {
        attName: [
          { required: true, message: '附件名称不能为空', trigger: 'blur' }
        ],
        attDir: [
          { required: true, message: '附件路径不能为空', trigger: 'blur' }
        ],
        attSize: [
          { required: true, message: '附件大小不能为空', trigger: 'blur' }
        ],
        attType: [
          { required: true, message: '附件类型不能为空', trigger: 'blur' }
        ],
        attPid: [
          { required: true, message: '分类ID0编辑器,1产品图片,2拼团图片,3砍价图片,4秒杀图片,5文章图片,6组合数据图不能为空', trigger: 'blur' }
        ],
        imageType: [
          { required: true, message: '图片上传类型 1本地 2七牛云 3OSS 4COS 不能为空', trigger: 'blur' }
        ],
        moduleType: [
          { required: true, message: '图片上传模块类型 1 后台上传 2 用户生成不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'id', display_name: '主键id' },
        { key: 'attName', display_name: '附件名称' },
        { key: 'attDir', display_name: '附件路径' }
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
        delete this.crud.params.attName
        delete this.crud.params.attDir
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
