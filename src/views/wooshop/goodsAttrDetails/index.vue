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
          <el-form-item label="属性详情参数表">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="关联商品id" prop="goodsId">
            <el-input v-model="form.goodsId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="属性参数 json" prop="attrText">
            <el-input v-model="form.attrText" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="活动类型 0普通商品 1秒杀 2砍价 3拼团">
            <el-input v-model="form.activityType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="逻辑删除 1删除">
            <el-input v-model="form.isDel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="规格原始数据">
            <el-input v-model="form.specorig" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="规格参数">
            <el-input v-model="form.sprcificationparlams" style="width: 370px;" />
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
        <el-table-column prop="id" label="属性详情参数表" :show-overflow-tooltip="true" />
        <el-table-column prop="goodsId" label="关联商品id" :show-overflow-tooltip="true" />
        <el-table-column prop="attrText" label="属性参数 json" :show-overflow-tooltip="true" />
        <el-table-column prop="activityType" label="活动类型 0普通商品 1秒杀 2砍价 3拼团" :show-overflow-tooltip="true" />
        <el-table-column prop="isDel" label="逻辑删除 1删除" :show-overflow-tooltip="true" />
        <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="specorig" label="规格原始数据" :show-overflow-tooltip="true" />
        <el-table-column prop="sprcificationparlams" label="规格参数" :show-overflow-tooltip="true" />
        <el-table-column v-permission="['admin','wooshopStoreGoodsAttrDetails:edit','wooshopStoreGoodsAttrDetails:del']" label="操作" width="150px" align="center">
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
import crudWooshopStoreGoodsAttrDetails from '@/api/wooshopStoreGoodsAttrDetails'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '属性详情', url: 'api/wooshopStoreGoodsAttrDetails', sort: 'id,desc', crudMethod: { ...crudWooshopStoreGoodsAttrDetails }})
const defaultCrud = CRUD({ title: '属性详情', url: 'api/wooshopStoreGoodsAttrDetails', sort: '', crudMethod: { ...crudWooshopStoreGoodsAttrDetails }})
const defaultForm = { id: null, goodsId: null, attrText: null, activityType: null, isDel: null, createTime: null, updateTime: null, specorig: null, sprcificationparlams: null }
export default {
  name: 'WooshopStoreGoodsAttrDetails',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      
      permission: {
        add: ['admin', 'wooshopStoreGoodsAttrDetails:add'],
        edit: ['admin', 'wooshopStoreGoodsAttrDetails:edit'],
        del: ['admin', 'wooshopStoreGoodsAttrDetails:del']
      },
      rules: {
        goodsId: [
          { required: true, message: '关联商品id不能为空', trigger: 'blur' }
        ],
        attrText: [
          { required: true, message: '属性参数 json不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'goodsId', display_name: '关联商品id' },
        { key: 'activityType', display_name: '活动类型 0普通商品 1秒杀 2砍价 3拼团' }
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
        delete this.crud.params.goodsId
        delete this.crud.params.activityType
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
