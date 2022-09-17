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
          <el-form-item label="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类父级ID" prop="parentPid">
            <el-input v-model="form.parentPid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类路径" prop="path">
            <el-input v-model="form.path" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类类型，1 附件分类，2 文章分类">
            <el-input v-model="form.type" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类地址，">
            <el-input v-model="form.url" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类扩展字段 ">
            <el-input v-model="form.extra" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类状态, 1启用，0失效" prop="enabled">
            <el-input v-model="form.enabled" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="分类排序" prop="sort">
            <el-input v-model="form.sort" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="createUid">
            <el-input v-model="form.createUid" style="width: 370px;" />
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
        <el-table-column prop="id" label="id" />
        <el-table-column prop="parentPid" label="分类父级ID" />
        <el-table-column prop="path" label="分类路径" />
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="type" label="分类类型，1 附件分类，2 文章分类" />
        <el-table-column prop="url" label="分类地址，" />
        <el-table-column prop="extra" label="分类扩展字段 " />
        <el-table-column prop="enabled" label="分类状态, 1启用，0失效" />
        <el-table-column prop="sort" label="分类排序" />
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
        <el-table-column prop="createUid" label="createUid" />
        <el-table-column v-permission="['admin','wooshopConfigCategory:edit','wooshopConfigCategory:del']" label="操作" width="150px" align="center">
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
import crudWooshopConfigCategory from '@/api/wooshopConfigCategory'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MaterialList from '@/components/material'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '系统分类', url: 'api/wooshopConfigCategory', sort: 'id,desc', crudMethod: { ...crudWooshopConfigCategory }})
const defaultForm = { id: null, parentPid: null, path: null, name: null, type: null, url: null, extra: null, enabled: null, sort: null, createTime: null, updateTime: null, createUid: null }
export default {
  name: 'WooshopConfigCategory',
  components: { pagination, crudOperation, rrOperation, udOperation , MaterialList},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      
      permission: {
        add: ['admin', 'wooshopConfigCategory:add'],
        edit: ['admin', 'wooshopConfigCategory:edit'],
        del: ['admin', 'wooshopConfigCategory:del']
      },
      rules: {
        parentPid: [
          { required: true, message: '分类父级ID不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '分类路径不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '分类状态, 1启用，0失效不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '分类排序不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'parentPid', display_name: '分类父级ID' },
        { key: 'path', display_name: '分类路径' },
        { key: 'name', display_name: '分类名称' }
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
        delete this.crud.params.parentPid
        delete this.crud.params.path
        delete this.crud.params.name
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
