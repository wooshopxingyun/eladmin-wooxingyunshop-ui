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
<!--        <rrOperation :crud="crud" />-->
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="主键id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户uid" prop="uid">
            <el-input v-model="form.uid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="关联id" prop="linkId">
            <el-input v-model="form.linkId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="0 = 支出 1 = 获得" prop="billPm">
            <el-input v-model="form.billPm" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="会员账单标题" prop="billTitle">
            <el-input v-model="form.billTitle" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="账单明细种类" prop="category">
            <el-input v-model="form.category" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="账单明细类型" prop="billType">
            <el-input v-model="form.billType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="账单明细数字" prop="billNumber">
            <el-input v-model="form.billNumber" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="账单剩余" prop="balance">
            <el-input v-model="form.balance" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="账单备注" prop="mark">
            <el-input v-model="form.mark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="0 = 带确定 1 = 有效 -1 = 无效" prop="status">
            <el-input v-model="form.status" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="添加时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="逻辑删除: 1表示删除">
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
        <!--        <el-table-column prop="id" label="编码" :show-overflow-tooltip="true" />-->
        <!--        <el-table-column prop="uid" label="用户uid" :show-overflow-tooltip="true" />-->
        <el-table-column prop="linkId" label="关联订单" :show-overflow-tooltip="true" />
        <el-table-column prop="billPm" label="收支" :show-overflow-tooltip="true" >
          <template template slot-scope="scope">
            <div>
              <el-tag effect="dark" v-if="scope.row.billPm===1" size="small" style="cursor: pointer"
                      :type="'success'">获得
              </el-tag>
              <el-tag effect="dark" v-else size="small" style="cursor: pointer" :type="'warning'">支出
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="billTitle" label="标题" :show-overflow-tooltip="true" />
        <el-table-column prop="category" label="种类" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <div v-if="scope.row.category==='yuepay'">
              <el-tag effect="dark"  size="small" style="cursor: pointer"
                      :type="'warning'">余额
              </el-tag>
            </div>
            <div v-else-if="scope.row.category==='integral'">
              <el-tag effect="dark" size="small" style="cursor: pointer"
                      :type="''">积分
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <!--        <el-table-column prop="billType" label="账单明细类型" :show-overflow-tooltip="true" />-->
        <el-table-column prop="billNumber" label="明细金额" :show-overflow-tooltip="true" />
        <el-table-column prop="balance" label="账单剩余" :show-overflow-tooltip="true" />
        <el-table-column prop="mark" label="账单备注" :show-overflow-tooltip="true" />
        <!--        <el-table-column prop="status" label="0 = 待确定 1 = 有效 -1 = 无效" :show-overflow-tooltip="true" />-->
        <el-table-column prop="createTime" label="添加时间" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
<!--        <el-table-column prop="isDel" label="逻辑删除: 1表示删除" :show-overflow-tooltip="true" />-->
<!--        <el-table-column v-permission="['admin','wooshopUserBill:edit','wooshopUserBill:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>-->
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudWooshopUserBill from '@/api/wooshopUserBill'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '会员记录表', url: 'api/wooshopUserBill', sort: 'id,desc', crudMethod: { ...crudWooshopUserBill }})
const defaultCrud = CRUD({ title: '会员记录表', url: 'api/wooshopUserBill', sort: '', crudMethod: { ...crudWooshopUserBill }})
const defaultForm = { id: null, uid: null, linkId: null, billPm: null, billTitle: null, category: null, billType: null, billNumber: null, balance: null, mark: null, status: null, createTime: null, updateTime: null, isDel: null }
export default {
  name: 'WooshopUserBill',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'wooshopUserBill:add'],
        edit: ['admin', 'wooshopUserBill:edit'],
        del: ['admin', 'wooshopUserBill:del']
      },
      rules: {
        uid: [
          { required: true, message: '用户uid不能为空', trigger: 'blur' }
        ],
        linkId: [
          { required: true, message: '关联id不能为空', trigger: 'blur' }
        ],
        billPm: [
          { required: true, message: '0 = 支出 1 = 获得不能为空', trigger: 'blur' }
        ],
        billTitle: [
          { required: true, message: '会员账单标题不能为空', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '账单明细种类不能为空', trigger: 'blur' }
        ],
        billType: [
          { required: true, message: '账单明细类型不能为空', trigger: 'blur' }
        ],
        billNumber: [
          { required: true, message: '账单明细数字不能为空', trigger: 'blur' }
        ],
        balance: [
          { required: true, message: '账单剩余不能为空', trigger: 'blur' }
        ],
        mark: [
          { required: true, message: '账单备注不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '0 = 带确定 1 = 有效 -1 = 无效不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'uid', display_name: '用户uid' },
        { key: 'linkId', display_name: '关联id' },
        { key: 'billPm', display_name: '0 = 支出 1 = 获得' },
        { key: 'category', display_name: '账单明细种类' },
        { key: 'billType', display_name: '账单明细类型' },
        { key: 'status', display_name: '0 = 带确定 1 = 有效 -1 = 无效' }
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
        delete this.crud.params.linkId
        delete this.crud.params.billPm
        delete this.crud.params.category
        delete this.crud.params.billType
        delete this.crud.params.status
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
