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
<!--          <el-form-item label="主键">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>-->
          <el-form-item label="单位名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态:" prop="isStart">
            <el-radio v-model="form.isStart" :label=1 >开启</el-radio>
            <el-radio v-model="form.isStart" :label=0 >关闭</el-radio>
          </el-form-item>
          <el-form-item label="排序:" >
            <el-input-number v-model="form.sort" :min="1" :max="99"  label="排序"></el-input-number>
            <span style="color: #C0C0C0;margin-left: 2px;">数字越小越靠前</span>
          </el-form-item>
<!--          <el-form-item label="删除：1删除">
            <el-input v-model="form.isDel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建人">
            <el-input v-model="form.uid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="storeId">
            <el-input v-model="form.storeId" style="width: 370px;" />
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU" v-permission="['admin','wooshopStoreProductUnit:submit']" >确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
<!--        <el-table-column prop="id" label="Id" />-->
        <el-table-column label="序号" >
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="单位名称" align="center" />
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.isStart == 1" style="cursor: pointer" :type="''">开启</el-tag>
              <el-tag v-else style="cursor: pointer" :type=" 'info' ">关闭</el-tag>
            </div>
          </template>
        </el-table-column>
<!--        <el-table-column prop="isDel" label="删除：1删除" />-->

        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
<!--        <el-table-column prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>-->
        <el-table-column prop="uid" label="创建人" />
        <el-table-column prop="sort" label="排序" />
<!--        <el-table-column prop="storeId" label="storeId" />-->
        <el-table-column v-permission="['admin','wooshopStoreProductUnit:edit','wooshopStoreProductUnit:del']" label="操作" width="150px" align="center">
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
import crudWooshopStoreProductUnit from '@/api/wooshopStoreProductUnit'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '计量单位', url: 'api/wooshopStoreProductUnit', sort: 'id,desc', crudMethod: { ...crudWooshopStoreProductUnit }})
const defaultCrud = CRUD({ title: '计量单位', url: 'api/wooshopStoreProductUnit', sort: 'sort,asc', crudMethod: { ...crudWooshopStoreProductUnit }})
const defaultForm = { id: null, name: null, isStart: 1, sort: 99, isDel: null, createTime: null, updateTime: null, uid: null, storeId: null }
export default {
  name: 'WooshopStoreProductUnit',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'wooshopStoreProductUnit:add'],
        edit: ['admin', 'wooshopStoreProductUnit:edit'],
        del: ['admin', 'wooshopStoreProductUnit:del']
      },
      rules: {
        name: [
          { required: true, message: '单位名称不能为空', trigger: 'blur' }
        ],
        isStart: [
          { required: true, message: '状态：1开启、0关闭不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '单位名称' },
        { key: 'isStart', display_name: '状态：1开启、0关闭' }
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
        delete this.crud.params.name
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
  .table-img {
    display: inline-block;
    text-align: center;
    background: #ccc;
    color: #fff;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    width: 32px;
    height: 32px;
    line-height: 32px;
  }
</style>
