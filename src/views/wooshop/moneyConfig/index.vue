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
          <el-form-item label="充值金额" prop="money">
            <el-input-number v-model="form.money" :step="1" :min="0" :precision="2"></el-input-number>
          </el-form-item>
          <el-form-item label="赠送金额">
            <el-input-number v-model="form.giveMoney" :step="1" :min="0" :precision="2"></el-input-number>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.sort" :step="1" :min="0" ></el-input-number>
          </el-form-item>
          <el-form-item label="状态:">
            <el-radio-group v-model="form.isStart">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU"
                     v-permission="['admin','wooshopMoneyConfig:submit']"
          >确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" :default-sort = "{prop: 'index', order: 'descending'}" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="money" label="充值金额" :show-overflow-tooltip="true" />
        <el-table-column prop="giveMoney" label="赠送金额" :show-overflow-tooltip="true" />
        <el-table-column prop="sort" label="排序" :show-overflow-tooltip="true" />
        <el-table-column prop="isStart" label="状态" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <div>
              <el-tag effect="dark" v-if="scope.row.isStart == 1" style="cursor: pointer" :type="'success'">显示
              </el-tag>
              <el-tag effect="dark" v-else style="cursor: pointer" :type="'warning'">不显示</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','wooshopMoneyConfig:edit','wooshopMoneyConfig:del']" label="操作" width="150px" align="center">
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
import crudWooshopMoneyConfig from '@/api/wooshopMoneyConfig'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '充值金额配置', url: 'api/wooshopMoneyConfig', sort: 'id,desc', crudMethod: { ...crudWooshopMoneyConfig }})
const defaultCrud = CRUD({ title: '充值金额配置', url: 'api/wooshopMoneyConfig', sort: '', crudMethod: { ...crudWooshopMoneyConfig }})
const defaultForm = { id: null, money: 0.00, giveMoney: 0.00, sort: 99, isDel: null, isStart: 1, createTime: null, updateTime: null }
export default {
  name: 'WooshopMoneyConfig',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'wooshopMoneyConfig:add'],
        edit: ['admin', 'wooshopMoneyConfig:edit'],
        del: ['admin', 'wooshopMoneyConfig:del']
      },
      rules: {
        money: [
          { required: true, message: '充值金额不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'money', display_name: '充值金额' },
        { key: 'giveMoney', display_name: '赠送金额' },
        { key: 'isStart', display_name: '状态:1显示 0不显示' }
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
        delete this.crud.params.money
        delete this.crud.params.giveMoney
        delete this.crud.params.isStart
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
