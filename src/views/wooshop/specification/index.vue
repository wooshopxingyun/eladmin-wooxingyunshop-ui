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
                 :title="crud.status.title" width="850px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <!--          <el-form-item label="主键">
                      <el-input v-model="form.id" style="width: 370px;" />
                    </el-form-item>-->

          <el-row>
            <el-col :span="12">
              <el-form-item label="标题名称" prop="name">
                <el-input v-model="form.name" style="width: 370px;"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计量单位" prop="name" style="margin-left: 60px">
                <!--                  <el-input v-model="form.unitName" style="width: 100px;" />-->
                <el-select v-model="form.unitName" @focus="focusNameData" clearable placeholder="请选择计量单位"
                           style="width: 150px">
                  <el-option
                    v-for="item in unitData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="排序:">
                <el-input-number v-model="form.sort" :min="1" :max="99" label="排序"></el-input-number>
                <span style="color: #C0C0C0;margin-left: 2px;">数字越小越靠前</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开启状态:">
                <el-radio v-model="form.isStart" :label=1>开启</el-radio>
                <el-radio v-model="form.isStart" :label=0>关闭</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" v-for="(item,index) in form.params">
            <el-col :span="24">
              <el-form-item label="规格:" style="margin-left: 30px">
                <el-input size="mini" v-model="item.k" label="规格名称:" style="width: 150px;" clear></el-input>
                <el-button type="danger" size="mini" plain icon="el-icon-delete" @click="kdel(item.k,index)">删除
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="值:" style="margin-left: 35px">
                <el-tag v-for="(v, vindex) in item.vList"
                        :key="vindex"
                        closable
                        size="medium"
                        :disable-transitions="false"
                        @close="delV(index,vindex)"
                >
                  {{ v }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="item.inputShow"
                  v-model="item.value"

                  size="small"
                  @keyup.enter.native="vInput(item.value,index)"
                  @blur="vInput(item.value,index)"

                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" type="success" @click="addValue(item,index)">添加值
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-button v-show="addguige" @click="clickAddguige" type="success" size="medium" style="margin-left: 70px"
                     plain>新增规格
          </el-button>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU"
                     v-permission="['admin','wooshopStoreProductSpecification:submit']">确认
          </el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column label="序号">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="规格名称" :show-overflow-tooltip="true"/>
        <el-table-column prop="params" label="规格值" :show-overflow-tooltip="true"/>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.isStart == 1" style="cursor: pointer" :type="''">开启</el-tag>
              <el-tag v-else style="cursor: pointer" :type=" 'info' ">关闭</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="创建人"/>
        <!--        <el-table-column prop="storeId" label="storeId" />-->
        <el-table-column label="计量单位" align="center">
          <template slot-scope="scope">
            <el-tag
              type="success"
              disable-transitions>{{ scope.row.unitName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序"/>
        <el-table-column prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-permission="['admin','wooshopStoreProductSpecification:edit','wooshopStoreProductSpecification:del']"
          label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
  </div>
</template>

<script>
import crudWooshopStoreProductSpecification from '@/api/wooshopStoreProductSpecification'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
// import MaterialList from '@/components/material'
import {getAll} from '@/api/wooshopStoreProductUnit'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '商品规格', url: 'api/wooshopStoreProductSpecification', sort: 'id,desc', crudMethod: { ...crudWooshopStoreProductSpecification }})
const defaultCrud = CRUD({
  title: '商品规格',
  url: 'api/wooshopStoreProductSpecification',
  sort: 'sort,asc',
  crudMethod: {...crudWooshopStoreProductSpecification}
})
const defaultForm = {
  id: null,
  name: null,
  params: [],
  sort: 999,
  isDel: null,
  createTime: null,
  updateTime: null,
  isStart: 1,
  uid: null,
  storeId: null,
  unitName: null
}
export default {
  name: 'WooshopStoreProductSpecification',
  components: {pagination, crudOperation, rrOperation, udOperation},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'wooshopStoreProductSpecification:add'],
        edit: ['admin', 'wooshopStoreProductSpecification:edit'],
        del: ['admin', 'wooshopStoreProductSpecification:del']
      },
      rules: {
        name: [
          {required: true, message: '规格名称不能为空', trigger: 'blur'}
        ],
        params: [
          {required: true, message: '规格值不能为空', trigger: 'blur'}
        ]
      },
      queryTypeOptions: [
        {key: 'name', display_name: '规格名称'},
        {key: 'isStart', display_name: '开启状态：1开启、0关闭'}
      ],
      unitData: [],
      addguige: true,
      params: [],
      valueList: null,
      vInpautShow: false
    }
  },
  watch: {},
  methods: {
    selectParam() {
      console.log(this.crud.data)
    },
    delV(index, vindex) {
      //删除规格值
      console.log('删除值前', this.form.params[index].vList)
      this.form.params[index].vList.splice(vindex, 1);
      console.log('删除值后', this.form.params[index].vList)
    },
    vInput(item, index) {
      console.log('输入框失去焦点')
      //值 输入框 失去焦点
      if (this.form.params[index].value != null) {
        this.form.params[index].vList.push(item)
        this.form.params[index].value = null;
        this.form.params[index].inputShow = false;
        // this.valueList=null
        // this.vInpautShow=false
      }
    },
    addValue(item, index) {
      console.log('添加值', item, index)
      this.form.params[index].inputShow = true;
      // this.vInpautShow=true;

    },
    kdel(item, index) {
      //删除规格
      console.log('点击删除', item, index)
      this.form.params.splice(index, 1)
    },
    clickAddguige() {
      //添加规格
      console.log('添加规格')
      this.form.params.push(Object.assign({}, {
        k: '',
        value: null,
        vList: [],
        inputShow: true,
        inputShowK: false
      }))
    },
    focusNameData() {
      //get请求获取数据（计量单位）
      getAll({isStart: 1, page: 0, size: -1, sort: 'sort,asc'}).then(res => {
        console.log('获取焦点数据', res)
        this.unitData = res.content
      })
    },
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
      // console.log('新增与编辑前做的操作',form)

    }, //编辑之后
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.form.params = JSON.parse(this.form.params);
      console.log('新增与编辑前做的操作', form)

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

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
