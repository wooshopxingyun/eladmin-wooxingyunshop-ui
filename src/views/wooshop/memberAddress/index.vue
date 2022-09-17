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
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="主键id">
            <el-input v-model="form.id" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="会员id" prop="uid">
            <el-input v-model="form.uid" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="姓名" prop="memberName">
            <el-input v-model="form.memberName" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="电话" prop="memberMobile">
            <el-input v-model="form.memberMobile" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="所在省" prop="provinceName">
            <el-input v-model="form.provinceName" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="所在市" prop="cityName">
            <el-input v-model="form.cityName" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="城市id" prop="cityId">
            <el-input v-model="form.cityId" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="所在区" prop="district">
            <el-input v-model="form.district" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="详细地址" prop="detailedAddress">
            <el-input v-model="form.detailedAddress" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="邮编" prop="postCode">
            <el-input v-model="form.postCode" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="经度" prop="longitude">
            <el-input v-model="form.longitude" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model="form.latitude" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="是否为默认收货地址" prop="isDefault">
            <el-input v-model="form.isDefault" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="是否删除" prop="isDel">
            <el-input v-model="form.isDel" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="form.sort" style="width: 370px;"/>
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
        <el-table-column prop="uid" label="会员id" :show-overflow-tooltip="true"/>
        <el-table-column prop="memberName" label="姓名" :show-overflow-tooltip="true"/>
        <el-table-column prop="memberMobile" label="电话" :show-overflow-tooltip="true"/>
        <el-table-column label="所在城市" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div>
              {{ scope.row.provinceName }}{{ scope.row.cityName }}{{ scope.row.district }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="detailedAddress" label="详细地址" :show-overflow-tooltip="true"/>
      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
  </div>
</template>

<script>
import crudWooshopMemberAddress from '@/api/wooshopMemberAddress'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '会员收货地址', url: 'api/wooshopMemberAddress', sort: 'id,desc', crudMethod: { ...crudWooshopMemberAddress }})
const defaultCrud = CRUD({
  title: '会员收货地址',
  url: 'api/wooshopMemberAddress',
  sort: '',
  crudMethod: {...crudWooshopMemberAddress}
})
const defaultForm = {
  id: null,
  uid: null,
  memberName: null,
  memberMobile: null,
  provinceName: null,
  cityName: null,
  cityId: null,
  district: null,
  detailedAddress: null,
  postCode: null,
  longitude: null,
  latitude: null,
  isDefault: null,
  isDel: null,
  createTime: null,
  updateTime: null,
  sort: null
}
export default {
  name: 'WooshopMemberAddress',
  components: {pagination, crudOperation, rrOperation, udOperation},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'wooshopMemberAddress:add'],
        edit: ['admin', 'wooshopMemberAddress:edit'],
        del: ['admin', 'wooshopMemberAddress:del']
      },
      rules: {
        uid: [
          {required: true, message: '会员id不能为空', trigger: 'blur'}
        ],
        memberName: [
          {required: true, message: '姓名不能为空', trigger: 'blur'}
        ],
        memberMobile: [
          {required: true, message: '电话不能为空', trigger: 'blur'}
        ],
        provinceName: [
          {required: true, message: '所在省不能为空', trigger: 'blur'}
        ],
        cityName: [
          {required: true, message: '所在市不能为空', trigger: 'blur'}
        ],
        cityId: [
          {required: true, message: '城市id不能为空', trigger: 'blur'}
        ],
        district: [
          {required: true, message: '所在区不能为空', trigger: 'blur'}
        ],
        detailedAddress: [
          {required: true, message: '详细地址不能为空', trigger: 'blur'}
        ],
        postCode: [
          {required: true, message: '邮编不能为空', trigger: 'blur'}
        ],
        longitude: [
          {required: true, message: '经度不能为空', trigger: 'blur'}
        ],
        latitude: [
          {required: true, message: '纬度不能为空', trigger: 'blur'}
        ],
        isDefault: [
          {required: true, message: '是否为默认收货地址不能为空', trigger: 'blur'}
        ],
        isDel: [
          {required: true, message: '是否删除不能为空', trigger: 'blur'}
        ]
      },
      queryTypeOptions: [
        {key: 'uid', display_name: '会员id'},
        {key: 'memberName', display_name: '姓名'},
        {key: 'memberMobile', display_name: '电话'},
        {key: 'isDefault', display_name: '是否为默认收货地址'}
      ]
    }
  },
  watch: {},
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      } else {
        delete this.crud.params.uid
        delete this.crud.params.memberName
        delete this.crud.params.memberMobile
        delete this.crud.params.isDefault
      }
      this.crud.optShow.add = false
      this.crud.optShow.edit = false
      this.crud.optShow.del = false
      return true
    }, // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    }
  }
}


</script>

<style scoped>

</style>
