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
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="主键id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户uid" prop="uid">
            <el-input v-model="form.uid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="签到说明" prop="signTitle">
            <el-input v-model="form.signTitle" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="获得" prop="gainNumber">
            <el-input v-model="form.gainNumber" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="剩余" prop="afterBalance">
            <el-input v-model="form.afterBalance" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="获得类型，1积分，2经验" prop="signType">
            <el-input v-model="form.signType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="添加时间/签到时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="逻辑删除 1删除 默认0">
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
        <el-table-column prop="id" label="Id" :show-overflow-tooltip="true" />
        <el-table-column prop="uid" label="用户名称" :show-overflow-tooltip="true" />
        <el-table-column prop="signTitle" label="签到备注" :show-overflow-tooltip="true" />
        <el-table-column prop="gainNumber" label="获得积分/经验" :show-overflow-tooltip="true" />
        <el-table-column prop="afterBalance" label="剩余积分/经验" :show-overflow-tooltip="true" />
        <el-table-column prop="signType" label="获得类型" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
          <div>
            <el-tag effect="dark" v-if="scope.row.signType == 1" style="cursor: pointer" :type="'success'">积分
            </el-tag>
            <div effect="dark" v-else style="cursor: pointer" :type="'warning'">经验</div>
          </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="签到时间" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudWooshopSignRecord from '@/api/wooshopSignRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '会员签到记录', url: 'api/wooshopSignRecord', sort: 'id,desc', crudMethod: { ...crudWooshopSignRecord }})
const defaultCrud = CRUD({ title: '会员签到记录', url: 'api/wooshopSignRecord', sort: '', crudMethod: { ...crudWooshopSignRecord }})
const defaultForm = { id: null, uid: null, signTitle: null, gainNumber: null, afterBalance: null, signType: null, createTime: null, updateTime: null, isDel: null }
export default {
  name: 'WooshopSignRecord',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'wooshopSignRecord:add'],
        edit: ['admin', 'wooshopSignRecord:edit'],
        del: ['admin', 'wooshopSignRecord:del']
      },
      rules: {
        uid: [
          { required: true, message: '用户uid不能为空', trigger: 'blur' }
        ],
        signTitle: [
          { required: true, message: '签到说明不能为空', trigger: 'blur' }
        ],
        gainNumber: [
          { required: true, message: '获得不能为空', trigger: 'blur' }
        ],
        afterBalance: [
          { required: true, message: '剩余不能为空', trigger: 'blur' }
        ],
        signType: [
          { required: true, message: '获得类型，1积分，2经验不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'uid', display_name: '用户uid' },
        { key: 'signType', display_name: '获得类型，1积分，2经验' }
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
        delete this.crud.params.uid
        delete this.crud.params.signType
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
