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
      <crudOperation  :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="主键id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户id" prop="uid">
            <el-input v-model="form.uid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="充值订单id" prop="orderId">
            <el-input v-model="form.orderId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="充值金额" prop="money">
            <el-input v-model="form.money" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="赠送金额">
            <el-input v-model="form.giveMoney" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="充值类型">
            <el-input v-model="form.moneyType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否充值金额">
            <el-input v-model="form.isPaid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="充值金额支付时间">
            <el-input v-model="form.payTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="充值金额时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="退款金额">
            <el-input v-model="form.refundMoney" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="逻辑删除 1删除">
            <el-input v-model="form.isDel" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU"
                     v-permission="['admin','wooshopMoneyRecord:submit']"
          >确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" :default-sort = "{prop: 'index', order: 'descending'}" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="主键id" :show-overflow-tooltip="true" />
        <el-table-column prop="uid" label="用户名" :show-overflow-tooltip="true" />
        <el-table-column prop="money" label="充值金额" :show-overflow-tooltip="true" />
        <el-table-column prop="giveMoney" label="赠送金额" :show-overflow-tooltip="true" />
        <el-table-column prop="moneyType" label="充值类型" :show-overflow-tooltip="true" />
        <el-table-column prop="createTime" label="充值时间" :show-overflow-tooltip="true" >
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
import crudWooshopMoneyRecord from '@/api/wooshopMoneyRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '会员充值记录', url: 'api/wooshopMoneyRecord', sort: 'id,desc', crudMethod: { ...crudWooshopMoneyRecord }})
const defaultCrud = CRUD({ title: '会员充值记录', url: 'api/wooshopMoneyRecord', sort: '', crudMethod: { ...crudWooshopMoneyRecord }})
const defaultForm = { id: null, uid: null, orderId: null, money: null, giveMoney: null, moneyType: null, isPaid: null, payTime: null, createTime: null, refundMoney: null, updateTime: null, isDel: null }
export default {
  name: 'WooshopMoneyRecord',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'wooshopMoneyRecord:add'],
        edit: ['admin', 'wooshopMoneyRecord:edit'],
        del: ['admin', 'wooshopMoneyRecord:del']
      },
      rules: {
        uid: [
          { required: true, message: '用户id不能为空', trigger: 'blur' }
        ],
        orderId: [
          { required: true, message: '充值订单id不能为空', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '充值金额不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'uid', display_name: '用户id' },
        { key: 'orderId', display_name: '充值订单id' },
        { key: 'money', display_name: '充值金额' },
        { key: 'giveMoney', display_name: '赠送金额' }
      ]
    }
  },
  watch: {
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      this.crud.optShow.add=false
      this.crud.optShow.edit=false
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      } else {
        delete this.crud.params.uid
        delete this.crud.params.orderId
        delete this.crud.params.money
        delete this.crud.params.giveMoney
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
