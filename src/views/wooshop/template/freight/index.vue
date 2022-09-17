<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle=true">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <div class="crud-opts">
    <span class="crud-opts-left">
      <!--左侧插槽-->
      <slot name="left" />
      <el-button
        v-permission="permission.add"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="tiaozhuan"
      >
        新增
      </el-button>
    </span>
      </div>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="bianji>1" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="运费模板编号">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="运费模板名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="运费计费类型：按体积计费、按重量计费、按件数计费" prop="ttype">
            <el-input v-model="form.ttype" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指定包邮项是否开启" prop="pinkage">
            <el-input v-model="form.pinkage" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="顺序" prop="sort">
            <el-input v-model="form.sort" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="逻辑删除。1表示删除">
            <el-input v-model="form.isDel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间" prop="updateTime">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="//创建人id">
            <el-input v-model="form.uid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="storeId">
            <el-input v-model="form.storeId" style="width: 370px;" />
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
        <el-table-column prop="id" label="编号" align="center" />

        <el-table-column prop="name" label="模板名称" align="center" />
        <el-table-column label="计费类型" align="center">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.ttype == '1'">体积计费</el-tag>
              <el-tag v-else-if="scope.row.ttype == '2'">重量计费</el-tag>
              <el-tag v-else>件数计费</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否免运费">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.pinkage == '1'">是</el-tag>
              <el-tag v-else>否</el-tag>
            </div>
          </template>

        </el-table-column>
        <el-table-column prop="sort" label="排序" align="center" />
        <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.isStart === 1" style="cursor: pointer" :type="''">开启</el-tag>
            <el-tag v-else style="cursor: pointer" :type=" 'info' ">关闭</el-tag>
          </div>
        </template>
        </el-table-column>
        <el-table-column prop="uid" label="创建人id" align="center" />
        <el-table-column  v-permission="['admin','wooshopFreightTemplate:edit','wooshopFreightTemplate:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope" >
            <el-button v-permission="permission.edit" size="mini" type="primary" icon="el-icon-edit" @click="jintinBianji(scope.row.id)" > </el-button>
            <el-popover v-permission="permission.del" :ref="scope.row.id" placement="top" width="180" >
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteQuedin(scope.row)">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-popover>
          </template>

        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudWooshopFreightTemplate from '@/api/wooshopFreightTemplate'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '运费模板', url: 'api/wooshopFreightTemplate', sort: 'id,desc', crudMethod: { ...crudWooshopFreightTemplate }})
const defaultCrud = CRUD({ title: '运费模板', url: 'api/wooshopFreightTemplate', sort: 'sort,asc', crudMethod: { ...crudWooshopFreightTemplate }})
const defaultForm = { id: null, name: null, ttype: null, pinkage: null, isStart: null, sort: null, isDel: null, createTime: null,updateTime: null, uid: null, storeId: null }
export default {
  name: 'WooshopFreightTemplate',
  components: { pagination, crudOperation, rrOperation, udOperation},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  props:{ },
  data() {
    return {

      permission: {
        add: ['admin', 'wooshopFreightTemplate:add'],
        edit: ['admin', 'wooshopFreightTemplate:edit'],
        del: ['admin', 'wooshopFreightTemplate:del']
      },
      pop: false,
      rules: {
        name: [
          { required: true, message: '运费模板名称不能为空', trigger: 'blur' }
        ],
        ttype: [
          { required: true, message: '运费计费类型：按体积计费、按重量计费、按件数计费不能为空', trigger: 'blur' }
        ],
        pinkage: [
          { required: true, message: '指定包邮项是否开启不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '顺序不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '更新时间不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '运费模板名称' },
        { key: 'ttype', display_name: '运费计费类型：按体积计费、按重量计费、按件数计费' }
      ],
      bianji:0,
    }
  },
  watch: {

    bianji(k,v){
      console.log('监听编辑框',this.crud.status.cu,this.form)
      if (this.crud.status.cu>0){
        this.crud.status.cu=0;
        var id=this.form.id;
        this.$router.push({path:'/wooshopconfig/wooshop/FreightTemplate/'+id},)
      }
    }
  },
  created() {
    // this.crud.updateProp('searchToggle', true)

  },
  methods: {
    deleteQuedin(val){
      //删除
      const boolen=this.crud.doDelete(val);
      this.$refs[val.id].doClose()
      console.log('点击删除确定按钮',boolen)
      // this.pop=this.crud.dataStatus[this.crud.getDataId(val)].delete === 2;
    },
    jintinBianji(val){
      console.log('监听到是编辑框',val)
      this.$router.push({path:'/wooshopconfig/wooshop/FreightTemplate/'+val})
    },
    tiaozhuan(){
      //新增快递模板
      this.$router.push({path:'/wooshopconfig/wooshop/FreightTemplate/'+'0'})
      // this.$router.push({path:'/wooshopconfig/wooshop/FreightTemplate/pinkageAdd'+'tianjia'})
    },
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      } else {
        delete this.crud.params.name
        delete this.crud.params.type
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
