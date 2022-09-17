<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
<!--      <crudOperation :permission="permission" />-->
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="主键id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户uid" prop="uid">
            <el-input v-model="form.uid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="关联id（orderNo,提现id）" prop="linkId">
            <el-input v-model="form.linkId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="关联类型（order,extract，yue）" prop="linkType">
            <el-input v-model="form.linkType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="类型：1-增加，2-扣减（提现）" prop="broType">
            <el-input v-model="form.broType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="标题" prop="broTitle">
            <el-input v-model="form.broTitle" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="金额" prop="broPrice">
            <el-input v-model="form.broPrice" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="剩余" prop="broBalance">
            <el-input v-model="form.broBalance" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注" prop="broMark">
            <el-input v-model="form.broMark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态：1-订单创建，2-冻结期，3-完成，4-失效（订单退款），5-提现申请" prop="isStart">
            <el-input v-model="form.isStart" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="冻结期时间（天）" prop="frozenTime">
            <el-input v-model="form.frozenTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="解冻时间" prop="thawTime">
            <el-input v-model="form.thawTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="添加时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分销等级">
            <el-input v-model="form.brokerageLevel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="逻辑删除:1表示删除、0默认">
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
        <el-table-column prop="uid" label="用户uid" :show-overflow-tooltip="true" />
<!--        <el-table-column prop="linkId" label="关联id（orderNo,提现id）" :show-overflow-tooltip="true" />-->
<!--        <el-table-column prop="linkType" label="关联类型（order,extract，yue）" :show-overflow-tooltip="true" />-->
<!--        <el-table-column prop="broType" label="类型：1-增加，2-扣减（提现）" :show-overflow-tooltip="true" />-->
        <el-table-column prop="broType" label="变动情况" :show-overflow-tooltip="true" />
        <el-table-column prop="broTitle" label="标题" :show-overflow-tooltip="true" />
        <el-table-column prop="broPrice" label="金额" :show-overflow-tooltip="true" />
        <el-table-column prop="broBalance" label="剩余" :show-overflow-tooltip="true" />
        <el-table-column prop="broMark" label="备注" :show-overflow-tooltip="true" />
        <el-table-column prop="isStart" label="状态" :show-overflow-tooltip="true" />
<!--        <el-table-column prop="isStart" label="状态：1-订单创建，2-冻结期，3-完成，4-失效（订单退款），5-提现申请" :show-overflow-tooltip="true" />-->
        <el-table-column prop="frozenTime" label="冻结期（天）" :show-overflow-tooltip="true" />
        <el-table-column prop="thawTime" label="解冻时间" :show-overflow-tooltip="true" />
        <el-table-column prop="createTime" label="添加时间" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="brokerageLevel" label="分销等级" :show-overflow-tooltip="true" />
<!--        <el-table-column prop="isDel" label="逻辑删除:1表示删除、0默认" :show-overflow-tooltip="true" />-->
        <el-table-column v-permission="['admin','wooshopUserBrokerageRecord:edit','wooshopUserBrokerageRecord:del']" label="操作" width="150px" align="center">
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
import crudWooshopUserBrokerageRecord from '@/api/wooshopUserBrokerageRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '会员佣金记录表', url: 'api/wooshopUserBrokerageRecord', sort: 'id,desc', crudMethod: { ...crudWooshopUserBrokerageRecord }})
const defaultCrud = CRUD({ title: '会员佣金记录表', url: 'api/wooshopUserBrokerageRecord', sort: '', crudMethod: { ...crudWooshopUserBrokerageRecord }})
const defaultForm = { id: null, uid: null, linkId: null, linkType: null, broType: null, broTitle: null, broPrice: null, broBalance: null, broMark: null, isStart: null, frozenTime: null, thawTime: null, createTime: null, updateTime: null, brokerageLevel: null, isDel: null }
export default {
  name: 'WooshopUserBrokerageRecord',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'wooshopUserBrokerageRecord:add'],
        edit: ['admin', 'wooshopUserBrokerageRecord:edit'],
        del: ['admin', 'wooshopUserBrokerageRecord:del']
      },
      rules: {
        uid: [
          { required: true, message: '用户uid不能为空', trigger: 'blur' }
        ],
        linkId: [
          { required: true, message: '关联id（orderNo,提现id）不能为空', trigger: 'blur' }
        ],
        linkType: [
          { required: true, message: '关联类型（order,extract，yue）不能为空', trigger: 'blur' }
        ],
        broType: [
          { required: true, message: '类型：1-增加，2-扣减（提现）不能为空', trigger: 'blur' }
        ],
        broTitle: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        broPrice: [
          { required: true, message: '金额不能为空', trigger: 'blur' }
        ],
        broBalance: [
          { required: true, message: '剩余不能为空', trigger: 'blur' }
        ],
        broMark: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
        ],
        isStart: [
          { required: true, message: '状态：1-订单创建，2-冻结期，3-完成，4-失效（订单退款），5-提现申请不能为空', trigger: 'blur' }
        ],
        frozenTime: [
          { required: true, message: '冻结期时间（天）不能为空', trigger: 'blur' }
        ],
        thawTime: [
          { required: true, message: '解冻时间不能为空', trigger: 'blur' }
        ]
      }    }
  },
  watch: {
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }, // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    }
  }
}


</script>

<style scoped>

</style>
