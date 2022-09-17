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
          <el-form-item label="城市id" prop="cityId">
            <el-input v-model="form.cityId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="省市级别" prop="cityLevel">
            <el-input v-model="form.cityLevel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="父级id" prop="parentId">
            <el-input v-model="form.parentId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="区号" prop="areaCode">
            <el-input v-model="form.areaCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="合并名称" prop="mergerName">
            <el-input v-model="form.mergerName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="经度" prop="lng">
            <el-input v-model="form.lng" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="纬度" prop="lat">
            <el-input v-model="form.lat" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="1展示 0不展示" prop="isStart">
            <el-input v-model="form.isStart" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="//国标编码">
            <el-input v-model="form.standardCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="邮编">
            <el-input v-model="form.postcode" style="width: 370px;" />
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
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU"
                     v-permission="['admin','wooshopSysCity:submit']"
          >确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="主键id" />
        <el-table-column prop="cityId" label="城市id" />
        <el-table-column prop="cityLevel" label="省市级别" />
        <el-table-column prop="parentId" label="父级id" />
        <el-table-column prop="areaCode" label="区号" />
        <el-table-column prop="name" label="名称" />
<!--        <el-table-column prop="mergerName" label="合并名称" />-->
        <el-table-column prop="mergersName" label="合并名称" />
<!--        <el-table-column prop="lng" label="经度" />
        <el-table-column prop="lat" label="纬度" />-->
        <el-table-column prop="coordinate" label="经纬度" :show-overflow-tooltip="true"/>
        <el-table-column prop="isStart" label="1展示 0不展示" />
        <el-table-column prop="standardCode" label="//国标编码" />
        <el-table-column prop="postcode" label="邮编" />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','wooshopSysCity:edit','wooshopSysCity:del']" label="操作" width="150px" align="center">
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
import crudWooshopSysCity from '@/api/wooshopSysCity'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MaterialList from '@/components/material'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '城市配置表', url: 'api/wooshopSysCity', sort: '', crudMethod: { ...crudWooshopSysCity }})
const defaultForm = { id: null, cityId: null, cityLevel: null, parentId: 0, areaCode: null, name: null, mergerName: null, lng: null, lat: null, isStart: null, standardCode: null, postcode: null, createTime: null, updateTime: null }
export default {
  name: 'WooshopSysCity',
  components: { pagination, crudOperation, rrOperation, udOperation , MaterialList},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'wooshopSysCity:add'],
        edit: ['admin', 'wooshopSysCity:edit'],
        del: ['admin', 'wooshopSysCity:del']
      },
      rules: {
        cityId: [
          { required: true, message: '城市id不能为空', trigger: 'blur' }
        ],
        cityLevel: [
          { required: true, message: '省市级别不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '父级id不能为空', trigger: 'blur' }
        ],
        areaCode: [
          { required: true, message: '区号不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        mergerName: [
          { required: true, message: '合并名称不能为空', trigger: 'blur' }
        ],
        lng: [
          { required: true, message: '经度不能为空', trigger: 'blur' }
        ],
        lat: [
          { required: true, message: '纬度不能为空', trigger: 'blur' }
        ],
        isStart: [
          { required: true, message: '1展示 0不展示不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '更新时间不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '名称' },
        { key: 'mergerName', display_name: '合并名称' },
        { key: 'postcode', display_name: '邮编' }
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
        delete this.crud.params.mergerName
        delete this.crud.params.postcode
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
