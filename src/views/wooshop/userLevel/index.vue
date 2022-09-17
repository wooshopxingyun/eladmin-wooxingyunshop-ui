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
          <el-form-item label="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户uid" prop="uid">
            <el-input v-model="form.uid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="等级vip" prop="levelId">
            <el-input v-model="form.levelId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="会员等级" prop="grade">
            <el-input v-model="form.grade" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="0:禁止,1:正常" prop="isStart">
            <el-input v-model="form.isStart" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注" prop="mark">
            <el-input v-model="form.mark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否已通知" prop="remind">
            <el-input v-model="form.remind" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否删除,0=未删除,1=删除" prop="isDel">
            <el-input v-model="form.isDel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="享受折扣" prop="discount">
            <el-input v-model="form.discount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="过期时间">
            <el-input v-model="form.expiredTime" style="width: 370px;" />
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
        <el-table-column prop="id" label="id" :show-overflow-tooltip="true" />
        <el-table-column prop="uid" label="用户uid" :show-overflow-tooltip="true" />
        <el-table-column prop="levelId" label="等级vip" :show-overflow-tooltip="true" />
        <el-table-column prop="grade" label="会员等级" :show-overflow-tooltip="true" />
        <el-table-column prop="isStart" label="0:禁止,1:正常" :show-overflow-tooltip="true" />
        <el-table-column prop="mark" label="备注" :show-overflow-tooltip="true" />
        <el-table-column prop="remind" label="是否已通知" :show-overflow-tooltip="true" />
        <el-table-column prop="isDel" label="是否删除,0=未删除,1=删除" :show-overflow-tooltip="true" />
        <el-table-column prop="discount" label="享受折扣" :show-overflow-tooltip="true" />
        <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true" />
        <el-table-column prop="updateTime" label="更新时间" :show-overflow-tooltip="true" />
        <el-table-column prop="expiredTime" label="过期时间" :show-overflow-tooltip="true" />
        <el-table-column v-permission="['admin','wooshopUserLevel:edit','wooshopUserLevel:del']" label="操作" width="150px" align="center">
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
import crudWooshopUserLevel from '@/api/wooshopUserLevel'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '会员等级记录', url: 'api/wooshopUserLevel', sort: 'id,desc', crudMethod: { ...crudWooshopUserLevel }})
const defaultCrud = CRUD({ title: '会员等级记录', url: 'api/wooshopUserLevel', sort: '', crudMethod: { ...crudWooshopUserLevel }})
const defaultForm = { id: null, uid: null, levelId: null, grade: null, isStart: null, mark: null, remind: null, isDel: null, discount: null, createTime: null, updateTime: null, expiredTime: null }
export default {
  name: 'WooshopUserLevel',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      
      permission: {
        add: ['admin', 'wooshopUserLevel:add'],
        edit: ['admin', 'wooshopUserLevel:edit'],
        del: ['admin', 'wooshopUserLevel:del']
      },
      rules: {
        uid: [
          { required: true, message: '用户uid不能为空', trigger: 'blur' }
        ],
        levelId: [
          { required: true, message: '等级vip不能为空', trigger: 'blur' }
        ],
        grade: [
          { required: true, message: '会员等级不能为空', trigger: 'blur' }
        ],
        isStart: [
          { required: true, message: '0:禁止,1:正常不能为空', trigger: 'blur' }
        ],
        mark: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
        ],
        remind: [
          { required: true, message: '是否已通知不能为空', trigger: 'blur' }
        ],
        isDel: [
          { required: true, message: '是否删除,0=未删除,1=删除不能为空', trigger: 'blur' }
        ],
        discount: [
          { required: true, message: '享受折扣不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'id', display_name: 'id' },
        { key: 'uid', display_name: '用户uid' },
        { key: 'levelId', display_name: '等级vip' },
        { key: 'grade', display_name: '会员等级' },
        { key: 'discount', display_name: '享受折扣' }
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
        delete this.crud.params.uid
        delete this.crud.params.levelId
        delete this.crud.params.grade
        delete this.crud.params.discount
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
