<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item"
                  @keyup.enter.native="crud.toQuery"/>
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
        <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="600px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="110px">
          <el-form-item label="会员id" prop="uid">
            <el-input v-model="form.uid" style="width: 370px;" :disabled="true"/>
          </el-form-item>
          <el-form-item label="提款名称" >
            <el-input v-model="form.withdrawName" style="width: 370px;" :disabled="true"/>
          </el-form-item>
          <el-form-item label="提现方式:">
            <el-tag effect="dark" v-if="form.withdrawType==2" size="small" style="cursor: pointer"
                    :type="'success'">微信
            </el-tag>
            <el-tag effect="dark" v-else size="small" style="cursor: pointer" :type="''">支付宝
            </el-tag>
          </el-form-item>
          <el-form-item label="支付宝账号">
            <el-input v-model="form.alipayCode" style="width: 370px;" :disabled="true"/>
          </el-form-item>
          <el-form-item label="提款微信号">
            <el-input v-model="form.wechatCode" style="width: 370px;" :disabled="true"/>
          </el-form-item>
          <el-form-item label="提款金额">
            <el-input v-model="form.withdrawMoney" style="width: 370px;" :disabled="true"/>
          </el-form-item>
          <el-form-item label="剩余余额">
            <el-input v-model="form.afterBalance" style="width: 370px;" :disabled="true"/>
          </el-form-item>
          <el-form-item label="审核状态:">
            <el-radio-group v-model="form.isStart">
              <el-radio :label="0" >审核中</el-radio>
              <el-radio :label="1" >已提现</el-radio>
              <el-radio :label="2">未通过</el-radio>
              <el-radio :label="3" :disabled="true">会员撤销</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="未通过原因" v-if="form.isStart==2" prop="auditMsg">
            <el-input v-model="form.auditMsg" style="width: 370px;" type="textarea"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" :default-sort="{prop: 'index', order: 'descending'}" v-loading="crud.loading"
                :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="id" label="主键id" :show-overflow-tooltip="true"/>
        <el-table-column prop="uid" label="会员名称" :show-overflow-tooltip="true"/>
        <el-table-column prop="withdrawName" label="提款名称" :show-overflow-tooltip="true"/>
        <el-table-column prop="withdrawType" label="提现方式" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div>
              <el-tag effect="dark" v-if="scope.row.withdrawType==2" size="small" style="cursor: pointer"
                      :type="'success'">微信
              </el-tag>
              <el-tag effect="dark" v-else size="small" style="cursor: pointer" :type="''">支付宝
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="alipayCode" label="支付宝账号" :show-overflow-tooltip="true"/>
        <el-table-column prop="wechatCode" label="提款微信号" :show-overflow-tooltip="true"/>
        <el-table-column prop="withdrawMoney" label="提款金额" :show-overflow-tooltip="true"/>
        <el-table-column prop="mark" label="备注" :show-overflow-tooltip="true"/>
        <el-table-column prop="afterBalance" label="剩余余额" :show-overflow-tooltip="true"/>
        <el-table-column prop="auditMsg" label="审核情况" :show-overflow-tooltip="true"/>
        <el-table-column prop="isStart" label="审核状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-tag effect="dark" v-if="scope.row.isStart==0" size="small" style="cursor: pointer"
                    :type="'warning'">审核中
            </el-tag>
            <el-tag effect="dark" v-else-if="scope.row.isStart==1" size="small" style="cursor: pointer"
                    :type="'success'">已提现
            </el-tag>
            <el-tag effect="dark" v-else-if="scope.row.isStart==2" size="small" style="cursor: pointer"
                    :type="'danger'">未通过
            </el-tag>
            <el-tag effect="dark" v-else size="small" style="cursor: pointer" :type="''">用户撤销
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="qrCode" label="二维码" :show-overflow-tooltip="true"/>
        <el-table-column v-permission="['admin','wooshopWithdrawRecord:edit','wooshopWithdrawRecord:del']" label="操作"
                         width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
  </div>
</template>

<script>
import crudWooshopWithdrawRecord from '@/api/wooshopWithdrawRecord'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '提现记录', url: 'api/wooshopWithdrawRecord', sort: 'id,desc', crudMethod: { ...crudWooshopWithdrawRecord }})
const defaultCrud = CRUD({
  title: '提现记录',
  url: 'api/wooshopWithdrawRecord',
  sort: '',
  crudMethod: {...crudWooshopWithdrawRecord}
})
const defaultForm = {
  id: null,
  uid: null,
  withdrawName: null,
  withdrawType: null,
  alipayCode: null,
  wechatCode: null,
  withdrawMoney: null,
  mark: null,
  afterBalance: null,
  auditMsg: null,
  isStart: null,
  createTime: null,
  updateTime: null,
  isDel: null,
  failTime: null,
  qrCode: null
}
export default {
  name: 'WooshopWithdrawRecord',
  components: {pagination, crudOperation, rrOperation, udOperation},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'wooshopWithdrawRecord:add'],
        edit: ['admin', 'wooshopWithdrawRecord:edit'],
        del: ['admin', 'wooshopWithdrawRecord:del']
      },
      rules: {
        uid: [
          {required: true, message: '会员id不能为空', trigger: 'blur'}
        ],auditMsg: [
          {required: true, message: '请输入未通过原因', trigger: 'blur'}
        ]
      },
      queryTypeOptions: [
        {key: 'withdrawType', display_name: '提现方式:1支付宝,2微信'},
        {key: 'auditMsg', display_name: '审核情况'},
        {key: 'isStart', display_name: '审核状态:0审核中、1已提现、2未通过、3会员撤销'}
      ]
    }
  },
  watch: {},
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      this.crud.optShow.add = false
      // this.crud.optShow.edit=false
      this.crud.optShow.del = false
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      } else {
        delete this.crud.params.withdrawType
        delete this.crud.params.auditMsg
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
