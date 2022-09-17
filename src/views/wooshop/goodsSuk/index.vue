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
          <el-form-item label="属性对应">
            <el-input v-model="form.specificationValue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品id">
            <el-input v-model="form.goodsId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品属性索引值">
            <el-input v-model="form.suk" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="库存">
            <el-input v-model="form.quantity" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="销售量">
            <el-input v-model="form.sales" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="金额">
            <el-input v-model="form.price" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="规格图片">
            <el-input v-model="form.sukImg" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="成本">
            <el-input v-model="form.cost" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="条形码">
            <el-input v-model="form.goodsCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="原价">
            <el-input v-model="form.originalPrice" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.weight" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品体积">
            <el-input v-model="form.volume" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="一级分销佣金">
            <el-input v-model="form.distribution" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="二级分销佣金">
            <el-input v-model="form.distributionSecond" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="活动类型 0普通商品 1秒杀 2砍价 3拼团">
            <el-input v-model="form.activityType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="活动限购数量">
            <el-input v-model="form.restrictions" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="显示限购的数量">
            <el-input v-model="form.restrictionsShow" style="width: 370px;" />
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
        <el-table-column prop="specificationValue" label="属性对应" :show-overflow-tooltip="true" />
        <el-table-column prop="goodsId" label="商品id" :show-overflow-tooltip="true" />
        <el-table-column prop="suk" label="商品属性索引值" :show-overflow-tooltip="true" />
        <el-table-column prop="quantity" label="库存" :show-overflow-tooltip="true" />
        <el-table-column prop="sales" label="销售量" :show-overflow-tooltip="true" />
        <el-table-column prop="price" label="金额" :show-overflow-tooltip="true" />
        <el-table-column prop="sukImg" label="规格图片" :show-overflow-tooltip="true" />
        <el-table-column prop="cost" label="成本" :show-overflow-tooltip="true" />
        <el-table-column prop="goodsCode" label="条形码" :show-overflow-tooltip="true" />
        <el-table-column prop="originalPrice" label="原价" :show-overflow-tooltip="true" />
        <el-table-column prop="weight" label="商品重量" :show-overflow-tooltip="true" />
        <el-table-column prop="volume" label="商品体积" :show-overflow-tooltip="true" />
        <el-table-column prop="distribution" label="一级分销佣金" :show-overflow-tooltip="true" />
        <el-table-column prop="distributionSecond" label="二级分销佣金" :show-overflow-tooltip="true" />
        <el-table-column prop="activityType" label="活动类型 0普通商品 1秒杀 2砍价 3拼团" :show-overflow-tooltip="true" />
        <el-table-column prop="restrictions" label="活动限购数量" :show-overflow-tooltip="true" />
        <el-table-column prop="restrictionsShow" label="显示限购的数量" :show-overflow-tooltip="true" />
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
        <el-table-column v-permission="['admin','wooshopStoreGoodsSuk:edit','wooshopStoreGoodsSuk:del']" label="操作" width="150px" align="center">
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
import crudWooshopStoreGoodsSuk from '@/api/wooshopStoreGoodsSuk'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '商品规格 suk', url: 'api/wooshopStoreGoodsSuk', sort: 'id,desc', crudMethod: { ...crudWooshopStoreGoodsSuk }})
const defaultCrud = CRUD({ title: '商品规格 suk', url: 'api/wooshopStoreGoodsSuk', sort: '', crudMethod: { ...crudWooshopStoreGoodsSuk }})
const defaultForm = { id: null, specificationValue: null, goodsId: null, suk: null, quantity: null, sales: null, price: null, sukImg: null, cost: null, goodsCode: null, originalPrice: null, weight: null, volume: null, distribution: null, distributionSecond: null, activityType: null, restrictions: null, restrictionsShow: null, isDel: null, createTime: null, updateTime: null }
export default {
  name: 'WooshopStoreGoodsSuk',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      
      permission: {
        add: ['admin', 'wooshopStoreGoodsSuk:add'],
        edit: ['admin', 'wooshopStoreGoodsSuk:edit'],
        del: ['admin', 'wooshopStoreGoodsSuk:del']
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'goodsId', display_name: '商品id' }
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
