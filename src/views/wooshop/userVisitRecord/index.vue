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
          <el-form-item label="主键id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时期">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户uid">
            <el-input v-model="form.uid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="访问类型:1-首页，2-详情页，3-营销活动详情页，4-个人中心，5-购物车、">
            <el-input v-model="form.visitType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="设备类型">
            <el-input v-model="form.clienttype" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="0">
            <el-input v-model="form.isDel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品id">
            <el-input v-model="form.goodsId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品类型:0非商品、1普通商品、2砍价商品、3团购商品、4秒杀商品、5积分商品">
            <el-input v-model="form.goodsType" style="width: 370px;" />
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
        <el-table-column prop="createTime" label="创建时期" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="用户uid" :show-overflow-tooltip="true" />
        <el-table-column prop="visitType" label="访问类型:1-首页，2-详情页，3-营销活动详情页，4-个人中心，5-购物车、" :show-overflow-tooltip="true" />
        <el-table-column prop="updateTime" label="更新时间" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="clienttype" label="设备类型" :show-overflow-tooltip="true" />
        <el-table-column prop="isDel" label="0" :show-overflow-tooltip="true" />
        <el-table-column prop="goodsId" label="商品id" :show-overflow-tooltip="true" />
        <el-table-column prop="goodsType" label="商品类型:0非商品、1普通商品、2砍价商品、3团购商品、4秒杀商品、5积分商品" :show-overflow-tooltip="true" />
        <el-table-column v-permission="['admin','wooshopUserVisitRecord:edit','wooshopUserVisitRecord:del']" label="操作" width="150px" align="center">
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
import crudWooshopUserVisitRecord from '@/api/wooshopUserVisitRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '用户浏览记录', url: 'api/wooshopUserVisitRecord', sort: 'id,desc', crudMethod: { ...crudWooshopUserVisitRecord }})
const defaultCrud = CRUD({ title: '用户浏览记录', url: 'api/wooshopUserVisitRecord', sort: '', crudMethod: { ...crudWooshopUserVisitRecord }})
const defaultForm = { id: null, createTime: null, uid: null, visitType: null, updateTime: null, clienttype: null, isDel: null, goodsId: null, goodsType: null }
export default {
  name: 'WooshopUserVisitRecord',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      
      permission: {
        add: ['admin', 'wooshopUserVisitRecord:add'],
        edit: ['admin', 'wooshopUserVisitRecord:edit'],
        del: ['admin', 'wooshopUserVisitRecord:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'id', display_name: '主键id' },
        { key: 'uid', display_name: '用户uid' },
        { key: 'visitType', display_name: '访问类型:1-首页，2-详情页，3-营销活动详情页，4-个人中心，5-购物车、' },
        { key: 'clienttype', display_name: '设备类型' },
        { key: 'goodsId', display_name: '商品id' },
        { key: 'goodsType', display_name: '商品类型:0非商品、1普通商品、2砍价商品、3团购商品、4秒杀商品、5积分商品' }
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
        delete this.crud.params.visitType
        delete this.crud.params.clienttype
        delete this.crud.params.goodsId
        delete this.crud.params.goodsType
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
