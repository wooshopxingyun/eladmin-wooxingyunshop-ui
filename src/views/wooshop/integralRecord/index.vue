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
          <el-form-item label="关联订单id，2签到、3系统默认为0" prop="integralId">
            <el-input v-model="form.integralId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="关联类型: 1订单积分、2签到积分、3系统添加" prop="integralType">
            <el-input v-model="form.integralType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="积分类型：1-增加积分，2-扣减积分" prop="integralRecordType">
            <el-input v-model="form.integralRecordType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="积分名称" prop="integralTitle">
            <el-input v-model="form.integralTitle" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="积分" prop="integral">
            <el-input v-model="form.integral" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="剩余积分" prop="beforeIntegral">
            <el-input v-model="form.beforeIntegral" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="积分备注" prop="remarks">
            <el-input v-model="form.remarks" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="积分状态：1-订单创建，2-冻结期，3-完成，4-失效（订单退款）" prop="isState">
            <el-input v-model="form.isState" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="积分冻结期时间（天）" prop="freezeDate">
            <el-input v-model="form.freezeDate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="积分解冻时间" prop="thawDate">
            <el-input v-model="form.thawDate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="添加时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="逻辑删除">
            <el-input v-model="form.isDel" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" :default-sort = "{prop: 'index', order: 'descending'}" v-loading="crud.loading" :data="crud.data" size="small"
                style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="主键id" :show-overflow-tooltip="true" />
        <el-table-column prop="uid" label="用户uid" :show-overflow-tooltip="true" />
        <el-table-column prop="integralType" label="积分类型" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <div v-if="scope.row.integralType == 1">
              购买支付成功
            </div>
            <div v-else-if="scope.row.integralType == 2">
              每天签到
            </div>
            <div v-else>
              手动添加
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="integralRecordType" label="分值" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <div>
              <el-tag effect="dark" v-if="scope.row.integralRecordType == 1" style="cursor: pointer" :type="'success'">增加</el-tag>
              <el-tag effect="dark" v-else style="cursor: pointer" :type="'warning'">扣减</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="integralTitle" label="积分名称" :show-overflow-tooltip="true" />
        <el-table-column prop="integral" label="积分" :show-overflow-tooltip="true" />
        <el-table-column prop="beforeIntegral" label="剩余积分" :show-overflow-tooltip="true" />
        <el-table-column prop="createTime" label="添加时间" :show-overflow-tooltip="true" >
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
import crudWooshopIntegralRecord from '@/api/wooshopIntegralRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '积分记录', url: 'api/wooshopIntegralRecord', sort: 'id,desc', crudMethod: { ...crudWooshopIntegralRecord }})
const defaultCrud = CRUD({ title: '积分记录', url: 'api/wooshopIntegralRecord', sort: 'id,desc', crudMethod: { ...crudWooshopIntegralRecord }})
const defaultForm = { id: null, uid: null, integralId: null, integralType: null, integralRecordType: null, integralTitle: null, integral: null, beforeIntegral: null, remarks: null, isState: null, freezeDate: null, thawDate: null, createTime: null, updateTime: null, isDel: null }
export default {
  name: 'WooshopIntegralRecord',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'wooshopIntegralRecord:add'],
        edit: ['admin', 'wooshopIntegralRecord:edit'],
        del: ['admin', 'wooshopIntegralRecord:del']
      },
      rules: {
        uid: [
          { required: true, message: '用户uid不能为空', trigger: 'blur' }
        ],
        integralId: [
          { required: true, message: '关联订单id，2签到、3系统默认为0不能为空', trigger: 'blur' }
        ],
        integralType: [
          { required: true, message: '关联类型: 1订单积分、2签到积分、3系统添加不能为空', trigger: 'blur' }
        ],
        integralRecordType: [
          { required: true, message: '积分类型：1-增加积分，2-扣减积分不能为空', trigger: 'blur' }
        ],
        integralTitle: [
          { required: true, message: '积分名称不能为空', trigger: 'blur' }
        ],
        integral: [
          { required: true, message: '积分不能为空', trigger: 'blur' }
        ],
        beforeIntegral: [
          { required: true, message: '剩余积分不能为空', trigger: 'blur' }
        ],
        remarks: [
          { required: true, message: '积分备注不能为空', trigger: 'blur' }
        ],
        isState: [
          { required: true, message: '积分状态：1-订单创建，2-冻结期，3-完成，4-失效（订单退款）不能为空', trigger: 'blur' }
        ],
        freezeDate: [
          { required: true, message: '积分冻结期时间（天）不能为空', trigger: 'blur' }
        ],
        thawDate: [
          { required: true, message: '积分解冻时间不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'integralType', display_name: '关联类型: 1订单积分、2签到积分、3系统添加' },
        { key: 'integralTitle', display_name: '积分名称' }
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
        delete this.crud.params.integralType
        delete this.crud.params.integralTitle
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
