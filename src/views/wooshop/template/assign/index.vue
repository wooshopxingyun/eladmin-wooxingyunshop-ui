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
          <el-form-item label="编号">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="模板ID" prop="templateId">
            <el-input v-model="form.templateId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="城市ID" prop="cityId">
            <el-input v-model="form.cityId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="城市id和城市表父类id">
            <el-input v-model="form.area" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="首件商品" prop="firstPart">
            <el-input v-model="form.firstPart" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="首件运费" prop="firstMoney">
            <el-input v-model="form.firstMoney" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="续件" prop="renewal">
            <el-input v-model="form.renewal" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="续件运费" prop="renewalMoney">
            <el-input v-model="form.renewalMoney" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="运费计费类型：按体积计费、按重量计费、按件数计费" prop="type">
            <el-input v-model="form.type" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分组唯一值" prop="pinkageUuid">
            <el-input v-model="form.pinkageUuid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否生效">
            <el-input v-model="form.start" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间" prop="updateTime">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="编号" />
        <el-table-column prop="templateId" label="模板ID" />
        <el-table-column prop="cityId" label="城市ID" />
        <el-table-column prop="area" label="城市id和城市表父类id" />
        <el-table-column prop="firstPart" label="首件商品" />
        <el-table-column prop="firstMoney" label="首件运费" />
        <el-table-column prop="renewal" label="续件" />
        <el-table-column prop="renewalMoney" label="续件运费" />
        <el-table-column prop="type" label="运费计费类型：按体积计费、按重量计费、按件数计费" />
        <el-table-column prop="pinkageUuid" label="分组唯一值" />
        <el-table-column prop="start" label="是否生效" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column v-permission="['admin','wooshopFreightTemplateAssign:edit','wooshopFreightTemplateAssign:del']" label="操作" width="150px" align="center">
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
import crudWooshopFreightTemplateAssign from '@/api/wooshopFreightTemplateAssign'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MaterialList from '@/components/material'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '运费区域模板', url: 'api/wooshopFreightTemplateAssign', sort: 'id,desc', crudMethod: { ...crudWooshopFreightTemplateAssign }})
const defaultCrud = CRUD({ title: '运费区域模板', url: 'api/wooshopFreightTemplateAssign', sort: '', crudMethod: { ...crudWooshopFreightTemplateAssign }})
const defaultForm = { id: null, templateId: null, cityId: null, area: null, firstPart: null, firstMoney: null, renewal: null, renewalMoney: null, type: null, pinkageUuid: null, start: null, createTime: null, updateTime: null }
export default {
  name: 'WooshopFreightTemplateAssign',
  components: { pagination, crudOperation, rrOperation, udOperation , MaterialList},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'wooshopFreightTemplateAssign:add'],
        edit: ['admin', 'wooshopFreightTemplateAssign:edit'],
        del: ['admin', 'wooshopFreightTemplateAssign:del']
      },
      rules: {
        templateId: [
          { required: true, message: '模板ID不能为空', trigger: 'blur' }
        ],
        cityId: [
          { required: true, message: '城市ID不能为空', trigger: 'blur' }
        ],
        firstPart: [
          { required: true, message: '首件商品不能为空', trigger: 'blur' }
        ],
        firstMoney: [
          { required: true, message: '首件运费不能为空', trigger: 'blur' }
        ],
        renewal: [
          { required: true, message: '续件不能为空', trigger: 'blur' }
        ],
        renewalMoney: [
          { required: true, message: '续件运费不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '运费计费类型：1按体积计费、2按重量计费、3按件数计费不能为空', trigger: 'blur' }
        ],
        pinkageUuid: [
          { required: true, message: '分组唯一值不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '更新时间不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'templateId', display_name: '模板ID' },
        { key: 'cityId', display_name: '城市ID' },
        { key: 'area', display_name: '城市id和城市表父类id' }
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
        delete this.crud.params.templateId
        delete this.crud.params.cityId
        delete this.crud.params.area
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
