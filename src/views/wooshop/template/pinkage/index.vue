<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--      <div v-if="crud.props.searchToggle">-->
      <!-- 搜索 -->
      <!--        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
              <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
                <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
              <rrOperation :crud="crud" />
            </div>-->
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <!--      <crudOperation :permission="permission" />-->
      <!--      <el-button @click="xinzheng">获取传递参数</el-button>-->
      <!--表单组件-->
      <!--      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
              <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
                <el-form-item label="免邮费编号">
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
                <el-form-item label="包邮件数" prop="number">
                  <el-input v-model="form.number" style="width: 370px;" />
                </el-form-item>
                <el-form-item label="包邮金额" prop="price">
                  <el-input v-model="form.price" style="width: 370px;" />
                </el-form-item>
                <el-form-item label="运费计费类型：1按体积计费、2按重量计费、3按件数计费" prop="ttype">
                  <el-input v-model="form.ttype" style="width: 370px;" />
                </el-form-item>
                <el-form-item label="免运费分组唯一值" prop="pinkageUuid">
                  <el-input v-model="form.pinkageUuid" style="width: 370px;" />
                </el-form-item>
                <el-form-item label="是否开启">
                  <el-input v-model="form.isStart" style="width: 370px;" />
                </el-form-item>
                <el-form-item label="创建时间" prop="createTime">
                  <el-input v-model="form.createTime" style="width: 370px;" />
                </el-form-item>
                <el-form-item label="更新时间" prop="updateTime">
                  <el-input v-model="form.updateTime" style="width: 370px;" />
                </el-form-item>
                <el-form-item label="物理删除 1表示删除">
                  <el-input v-model="form.isDel" style="width: 370px;" />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="crud.cancelCU">取消</el-button>
                <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
              </div>
            </el-dialog>-->
      <!--表格渲染-->
      <!--      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="免邮费编号" />
              <el-table-column prop="templateId" label="模板ID" />
              <el-table-column prop="cityId" label="城市ID" />
              <el-table-column prop="area" label="城市id和城市表父类id" />
              <el-table-column prop="number" label="包邮件数" />
              <el-table-column prop="price" label="包邮金额" />
              <el-table-column prop="ttype" label="运费计费类型：1按体积计费、2按重量计费、3按件数计费" />
              <el-table-column prop="pinkageUuid" label="免运费分组唯一值" />
              <el-table-column prop="isStart" label="是否开启" />
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
              <el-table-column prop="isDel" label="物理删除 1表示删除" />
              <el-table-column v-permission="['admin','wooshopFreightTemplatePinkage:edit','wooshopFreightTemplatePinkage:del']" label="操作" width="150px" align="center">
                <template slot-scope="scope">
                  <udOperation
                    :data="scope.row"
                    :permission="permission"
                  />
                </template>
              </el-table-column>
            </el-table>-->
      <!--分页组件-->
      <!--      <pagination />-->
      <!--  模板名称    -->
      <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="form.name" style="width: 85.4%"/>
              <!--          <span style="color: #C0C0C0;margin-left: 10px;">应用APPID,收款账号既是APPID对应支付宝账号</span>-->
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item label="排序" align="left" prop="sort">
              <el-input-number v-model="form.sort" :min="1" :max="999" label="描述文字"></el-input-number>
              <span style="color: #C0C0C0;margin-left: 2px;">数字越小越靠前</span>
            </el-form-item>
          </el-col>
        </el-row>
        <!--   计费方式     -->
        <el-form-item label="计费方式" prop="type">
          <el-radio v-model="form.ttype" label=2 border style="width: 10.5%">2按重量</el-radio>
          <el-radio v-model="form.ttype" label=3 border style="width: 10.5%">3按件数</el-radio>
          <el-radio v-model="form.ttype" label=1 border style="width: 10.5%">1按体积</el-radio>
          <!--          <span style="color: #C0C0C0;margin-left: 10px;">应用APPID,收款账号既是APPID对应支付宝账号</span>-->
        </el-form-item>

        <!--   指定区域     -->
        <el-form-item label="计费区域:">
          <el-table
              :data="form.assignData"
              style="width: 948px"
              border>
            <el-table-column label="计费区域" align="center" width="250" prop="assignListelectCyti">
              <template slot-scope="scope">
                <!--     显示选中的区域           -->
                <div class="dispatchingAreas">
                  <span v-if="scope.$index === 0">默认全国</span>
                  <el-cascader
                      v-else
                      v-model="scope.row.area"
                      style="width: 90%"
                      :options="areaData"
                      :props="props"
                      collapse-tags
                      clearable
                      filterable
                  />
                  <!--                  <div style="float: right;">
                                      <el-button type="text" plain @click="noEditArea(scope.row, scope.$index)">编辑</el-button>
                                      <el-button type="text" plain @click="noDelArea(scope.$index)">删除</el-button>
                                    </div>-->
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="form.ttype === '1' ? '首件体积（m³）': form.ttype==='2'?'首件重量（kg）':'首件（个）'"
                             align="center" width="155" prop="firstPartprop">
              <template slot-scope="scope">
                <el-input-number :min="0" v-model="scope.row.firstPart"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="运费（元）" prop="firstMoneyprop" align="center" width="155">
              <template slot-scope="scope">
                <el-input-number :min="0.00" :step="0.01" v-model="scope.row.firstMoney"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column :label="form.ttype === '1' ? '续件体积（m³）': form.ttype==='2'?'续件重量（kg）':'续件（个）'"
                             prop="assignListrenewal"
                             align="center" width="155">
              <template slot-scope="scope">
                <el-input-number :min="0.00" v-model="scope.row.renewal"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="续费（元）" prop="assignListrenewalMoney" align="center" width="155">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.renewalMoney" :step="0.01" :min="0.00"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="80">
              <template slot-scope="scope">
                <el-button type="text" plain @click="delAssign(scope.$index,scope)" v-if="scope.$index !== 0">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item prop="area">
          <el-button type="text" plain @click="chooseAssign(form.assignData)">指定计费区域和运费</el-button>
        </el-form-item>
        <!--  免费包邮    -->
        <el-form-item label="免运费">
          <el-switch v-model="form.pinkage"></el-switch>
        </el-form-item>
        <span v-show="form.pinkage">
        <el-form-item label="免邮区域:" prop="items">
          <el-table
              :data="form.pinkageData"
              style="width: 630px"
              border>
            <el-table-column label="免邮区域" align="center" width="250">
              <template slot-scope="scope">
                <!--     显示选中的区域           -->
                <div class="dispatchingAreas">
                  <el-cascader
                      v-model="scope.row.area"
                      style="width: 90%"
                      :options="areaData"
                      :props="props"
                      collapse-tags
                      clearable
                      filterable
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="form.ttype === '1' ? '免邮体积（m³）': form.ttype==='2'?'免邮重量（kg）':'免邮件（个）数'" prop="id"
                             align="center" width="155">
              <template slot-scope="scope">
                <el-input-number :min="1" :max="9999999999"
                                 v-model="scope.row.number"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="免邮金额（元）" prop="name" align="center" width="155">
              <template slot-scope="scope">
                <el-input-number :min="0.00" :step="0.01" :max="9999999999" v-model="scope.row.price"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="77">
              <template slot-scope="scope">
                <el-button type="text" plain @click="delPinkage(scope.$index,scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="text" plain @click="choosePinkage(form.pinkageData)">指定免邮区域</el-button>
          </el-form-item>
          </span>
        <el-form-item>
          <el-button type="primary" round @click="submitEffect(form.isStart=0)"
                     v-permission="['admin','wooshopFreightTemplate:save_draft']"
          >保存草稿</el-button>
          <el-button type="success" round @click="submitEffect(form.isStart=1)"
                     v-permission="['admin','wooshopFreightTemplate:IMediate']"
          >立刻生效</el-button>
        </el-form-item>
      </el-form>

      <!--  选择计费区域    -->
      <!--      <el-dialog
              title="选择计费区域"
              center
              :close-on-click-modal="false"
              :visible.sync="areaDialog"
              width="550px">
              <TransferTree
                :title="title"
                :resolveGrade="2"
                :from_data="fromData"
                :to_data="toData"
                height="400px"
                @from_data_change="fromDataChange"
                @to_data_change="toDataChange"
                @from_load_more="fromLoadMore"
                @to_load_more="toLoadMore"
                @from_selected_all="fromSelectedAll"
                @to_selected_all="toSelectedAll"
              ></TransferTree>
              <span slot="footer" class="dialog-footer">
              <el-button @click="areaDialog = false">取 消</el-button>
              <el-button type="primary" @click="addTransItem">确 定</el-button>
            </span>
            </el-dialog>-->
    </div>
  </div>
</template>

<script>
/*
import crudWooshopFreightTemplatePinkage from '@/api/wooshopFreightTemplatePinkage'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MaterialList from '@/components/material'
const defaultCrud = CRUD({ title: '运费包邮模板', url: 'api/wooshopFreightTemplatePinkage', sort: '', crudMethod: { ...crudWooshopFreightTemplatePinkage }})
const defaultForm = { id: null, templateId: null, cityId: null, area: null, number: null, price: null, ttype: null, pinkageUuid: null, isStart: null, createTime: null, updateTime: null, isDel: null }
export default {
  name: 'WooshopFreightTemplatePinkage',
  props: ['paramdata'],
  components: { pagination, crudOperation, rrOperation, udOperation , MaterialList},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'wooshopFreightTemplatePinkage:add'],
        edit: ['admin', 'wooshopFreightTemplatePinkage:edit'],
        del: ['admin', 'wooshopFreightTemplatePinkage:del']
      },
      rules: {
        templateId: [
          { required: true, message: '模板ID不能为空', trigger: 'blur' }
        ],
        cityId: [
          { required: true, message: '城市ID不能为空', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '包邮件数不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '包邮金额不能为空', trigger: 'blur' }
        ],
        ttype: [
          { required: true, message: '运费计费类型：1按体积计费、2按重量计费、3按件数计费不能为空', trigger: 'blur' }
        ],
        pinkageUuid: [
          { required: true, message: '免运费分组唯一值不能为空', trigger: 'blur' }
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
  created(val) {
    this.xinzheng()
  },
  mounted() {
  },
  methods: {
    xinzheng(){
      console.log("this.pinkageData",this.paramdata)
    },
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
*/
import {getCityTree} from '@/api/wooshopSysCity'
import {queryGet} from '@/api/wooshopFreightTemplate'
// import TransferTree from '@/components/TransferTree'
import {add} from '@/api/wooshopFreightTemplate'

export default {
  name: 'WooshopFreightTemplatePinkage',
  props: ['paramdata'],
  // components: {TransferTree},
  // components: { pagination, crudOperation, rrOperation, udOperation , MaterialList},
  // mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'wooshopFreightTemplatePinkage:add'],
        edit: ['admin', 'wooshopFreightTemplatePinkage:edit'],
        del: ['admin', 'wooshopFreightTemplatePinkage:del']
      },
      //运费模板
      form: {
        id: '', ttype: '2', pinkage: false, sort: 999, name: '', isStart: 1, pinkageData: [{
          id: '',
          number: 0,
          price: 0,
          area: []
        }], assignData: [{
          id: '',
          firstPart: 0,
          firstMoney: 0,
          renewal: 0,
          renewalMoney: 0,
          area: []
        }]
      },
      //免邮区域
      pinkageList: [
        {
          id: '',
          number: 0,
          price: 0,
          area: []
        }
      ],
      //指定区域
      assignList: [{
        id: '',
        firstPart: 0,
        firstMoney: 0,
        renewal: 0,
        renewalMoney: 0,
        electCyti: []
      }],
      props: {
        children: 'children',
        label: 'name',
        value: 'cityId',
        multiple: true
      },
      //指定运费
      /** 模板表单信息 */
      mouldForm: {
        /** 模板id */
        template_id: '',

        /** 模板名称 */
        name: '',

        /** 模版类型 */
        ttype: 1,

        items: [],

        /** 免运费区域 **/
        noItems: []
      },
      /** 地区选择器是否打开 */
      areaDialog: false,
      /** 全部地区信息 */
      areaData: [],

      /** 是否是编辑模式 默认是添加模式(false) 编辑模式(true) */
      isEdit: false,

      /** 操作当前行索引 */
      currentIndex: -1,

      /** 过滤地区数据 */
      filterData: [],

      /** 树形地区选择器源数据 */
      fromData: {},

      /** 上一次更新的源数据 */
      lastFromData: {},

      /** 树形地区选择器目标数据 */
      toData: {},

      /** 树形地区选择器静态数据 用于存储用户操作的原始数据 */
      staticData: {},

      /** 树形地区选择器标题 */
      title: ['可选省、市、县', '已选省、市、县'],
      rules: {
        sort: [
          {required: true, message: '排序不能为空', trigger: 'blur'}
        ],
        assignListrenewalMoney: [
          {required: true, message: '续件金额不能为空', trigger: 'blur'}
        ],
        assignListrenewal: [
          {required: true, message: '续件数不能为空', trigger: 'blur'}
        ],
        assignListProp: [
          {required: true, message: '指定区域不能为空', trigger: 'blur'}
        ],
        assignListelectCyti: [
          {required: true, message: '指定区域不能为空', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '运费模板名称不能为空', trigger: 'blur'}
        ],
        ttype: [
          {required: true, message: '运费模板名称不能为空', trigger: 'blur'}
        ],
        templateId: [
          {required: true, message: '模板ID不能为空', trigger: 'blur'}
        ],
        cityId: [
          {required: true, message: '城市ID不能为空', trigger: 'blur'}
        ],
        number: [
          {required: true, message: '包邮件数不能为空', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '包邮金额不能为空', trigger: 'blur'}
        ],
        firstPartprop: [
          {required: true, message: '首件/首重/首件体积不能为空', trigger: 'blur'}
        ],
        firstMoneyprop: [
          {required: true, message: '运费不能为空', trigger: 'blur'}
        ],
        ttype: [
          {required: true, message: '运费计费类型：1按体积计费、2按重量计费、3按件数计费不能为空', trigger: 'blur'}
        ],
        pinkageUuid: [
          {required: true, message: '免运费分组唯一值不能为空', trigger: 'blur'}
        ],
        createTime: [
          {required: true, message: '创建时间不能为空', trigger: 'blur'}
        ],
        updateTime: [
          {required: true, message: '更新时间不能为空', trigger: 'blur'}
        ]
      },
      queryTypeOptions: [
        {key: 'templateId', display_name: '模板ID'},
        {key: 'cityId', display_name: '城市ID'},
        {key: 'area', display_name: '城市id和城市表父类id'}
      ],
      ciryTreeData: []
    }
  },
  watch: {},
  created(val) {
    this.xinzheng()
  },
  mounted() {
  },
  methods: {
    submitEffect() {
      //提交立刻生效
      console.log("点击立刻生效this.form", this.form)
      for (let i = 1; i < this.form.assignData.length; i++) {
        if (this.form.assignData[i].area.length === 0) {
          this.$message({
            message: '计费区域不能为空，请选择计费区域！',
            type: 'warning'
          });
          return
        }
      }
      if (this.form.pinkage && this.form.pinkageData.length === 0) {
        this.$message({
          message: '免邮区域不能为空,请选择免邮区域！',
          type: 'warning'
        });
        return
      } else if (this.form.pinkage) {
        for (let i = 0; i < this.form.pinkageData.length; i++) {
          if (this.form.pinkageData[i].area.length === 0) {
            this.$message({
              message: '免邮区域不能为空,请选择免邮区域！',
              type: 'warning'
            });
            return
          }
        }

      }
      add(this.form).then(res => {
        if (res === '运费模板名称已经存在') {
          this.$message({
            message: '运费模板名称已经存在',
            type: 'warning'
          });
        } else {
          this.$router.push({path: '/wooshopconfig/wooshop/FreightTemplate/' + ':add'})
        }
        console.log("点击立刻生效res", res)
      })
      this.form = {
        id: '', ttype: '2', pinkage: false, sort: 999, name: '', isStart: 1, pinkageData: [{
          id: '',
          number: 0,
          price: 0,
          area: []
        }], assignData: [{
          id: '',
          firstPart: 0,
          firstMoney: 0,
          renewal: 0,
          renewalMoney: 0,
          area: []
        }]
      }

    },
    delPinkage(i, r) {
      //免邮区域删除
      console.log('删除', r)
      this.form.pinkageData.splice(i, 1)
    },
    delAssign(i, r, e) {
      //指定区域删除
      console.log('删除', r, e)
      this.form.assignData.splice(i, 1)
    },
    queryGetByid(val) {
      // debugger
      queryGet({id: val}).then(async res => {
        console.log('携带参数', res)
        // this.form.splice(0, 1)
        if (res.content[0].pinkageData.length > 0) {
          this.form.pinkageData = res.content[0].pinkageData;
          this.form.pinkageData.forEach((item, index) => {
            // item.area=[]
            var areastr = item.area
            item.area = []
            // item.area=areastr
            item.area = JSON.parse(areastr)
            console.log()
          })
          // this.form.pinkageData.assign=JSON.parse(res.content[0].pinkageData.assign)
        }
        if (res.content[0].assignData.length > 0) {
          this.form.assignData = res.content[0].assignData;
          this.form.assignData.forEach((item, index) => {
            // item.area=item.area.array()
            var areastr = item.area
            item.area = JSON.parse(areastr)
            // item.area=areastr
          })
          // this.form.assignData.assign=JSON.parse(res.content[0].assignData.assign)
        }
        this.form.assignData = res.content[0].assignData;
        this.form.ttype = res.content[0].ttype.toString();
        this.form.id = res.content[0].id;
        this.form.name = res.content[0].name;
        this.form.pinkage = res.content[0].pinkage === 1;
        this.form.sort = res.content[0].sort;
        console.log('打印携带参数请求结果', this.form)
      })
    },
    xinzheng() {
      console.log("const add = this.$route.params", this.$route.params.add !== ":add")
      getCityTree().then(res => {
        console.log('获取城市数据', res)
        this.areaData = this.getTreeData(res)
        if (this.$route.params.add !== ":add") {
          if (this.$route.params.add !== "0") {
            this.queryGetByid(this.$route.params.add);
          }
        }
      })
    },
    // 递归方法
    getTreeData(data) {
      // debugger
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {

        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    choosePinkage(pinkageData) {
      //免邮 区域添加
      console.log('免邮 区域添加', pinkageData)
      pinkageData.push(Object.assign({}, {
        id: '',
        number: 0,
        price: 0,
        area: []
      }))
    },
    chooseAssign(assignData) {
      // 指定区域运费添加方法
      console.log('添加区域', assignData)
      assignData.push(Object.assign({}, {
        id: '',
        firstPart: 0,
        firstMoney: 0,
        renewal: 0,
        renewalMoney: 0,
        area: []
      }))

    },
    /**
     * 将一维的扁平数组转换为多层级对象
     * @param  {[type]} list 一维数组，数组中每一个元素需包含id和parent_id两个属性
     * @return {[type]} tree 多层级树状结构
     */
    buildTree(list) {
      let temp = {}
      let tree = {}
      for (let i in list) {
        temp[list[i].id] = list[i]
      }
      for (let i in temp) {
        if (temp[i].parent_id && temp[temp[i].parent_id]) {
          if (Array.isArray(temp[temp[i].parent_id].children)) {
            temp[temp[i].parent_id].children = {}
          }
          temp[temp[i].parent_id].children[temp[i].id] = temp[i]
        } else {
          tree[temp[i].id] = temp[i]
        }
      }
      return tree
    },
    /** 初始化源数据 & 目标数据  每次只能给15条用来进行渲染 暂时没有用到 用于进行后期性能优化*/
    initArea() {
      // 初始化源数据
      const init_from = Object.keys(this.staticData).slice(0, 11)
      init_from.forEach(key => {
        this.fromData[key] = this.staticData[key]
      })
      // 初始化目标数据
      this.toData = {}
      this.noToData = {} // *****************************************

      // 2s 之后加载完整数据 用来加快弹框加载显示
      setTimeout(() => {
        this.fromData = JSON.parse(JSON.stringify(this.staticData))
      }, 2000)
    },
    /** 源数据更新*/
    fromDataChange(data, type) {
      if (type) { // 如果type 为1 则进行添加 否则移除
        // 如果源数据（fromData）是空对象 则直接赋值 如果不是 则进行对象合并
        if (!Object.keys(this.fromData).length) {
          this.fromData = JSON.parse(JSON.stringify(data))
        } else {
          this.objAssign(this.fromData, data)
        }
      } else { // 移除
        this.objDel(this.fromData, data)
      }
      this.resetSelected(this.fromData)
    },
    /** 目标数据更新 */
    toDataChange(data, type) {
      if (type) { // 如果type 为1 则进行添加 否则移除
        // 如果目标数据（toData）是空对象 则直接赋值 如果不是 则进行对象合并
        if (!Object.keys(this.toData).length) {
          this.toData = JSON.parse(JSON.stringify(data))
        } else {
          this.objAssign(this.toData, data)
        }
      } else { // 移除
        this.objDel(this.toData, data)
      }
      this.resetSelected(this.toData)
    },
    // 对象合并 同名对象子节点添加
    objAssign(origins, data) {
      for (let i in data) {
        if (!origins[i]) { // 如果level1中被整合的目标数据中不存在当前选中项 直接把当前level1进行赋值
          this.$set(origins, i, JSON.parse(JSON.stringify(data[i])))
        } else { // 在level1中存在被整合的目标数据中不存在当前选中项 则进行检测下一级别（level2）
          for (let j in data[i].children) { // 如果level2中被整合的目标数据中不存在当前选中项 直接把当前level2进行赋值
            if (!origins[i].children[j]) {
              this.$set(origins[i].children, j, JSON.parse(JSON.stringify(data[i].children[j])))
            } else { // 在level2中存在被整合的目标数据中不存在当前选中项 则进行检测下一级别（level3）
              for (let k in data[i].children[j].children) { // 如果level3中被整合的目标数据中不存在当前选中项 直接把当前level3进行赋值
                if (!origins[i].children[j].children[k]) {
                  this.$set(origins[i].children[j].children, k, JSON.parse(JSON.stringify(data[i].children[j].children[k])))
                }
              }
            }
          }
        }
      }
    },
    // 对象递归移除 同名对象子节点移除
    objDel(origins, data) {
      for (let i in data) {
        if (data[i].isSelected) { // level1全选
          this.$delete(origins, i)
        } else {
          for (let j in data[i].children) { // level1级别未全选 则循环检查level2
            if (data[i].children[j].isSelected) { // level2全选
              this.$delete(origins[i].children, j)
            } else { // level2级别未全选 则循环检查level3
              for (let k in data[i].children[j].children) {
                if (data[i].children[j].children[k].isSelected) {
                  this.$delete(origins[i].children[j].children, k)
                }
              }
            }
          }
        }
      }
    },
    /** 重置选中数据 isSelected 为false*/
    resetSelected(model) {
      let stack = []
      for (let i in model) {
        stack.push(model[i])
      }
      let item
      while (stack.length) {
        item = stack.shift()
        // 如果当前节点的兄弟节点 全部跟当前节点一样 则父节点保持同步
        item.isSelected = false
        // 如果该节点有子节点，继续添加进入栈顶
        if (item && item.children && !Array.isArray(item.children)) {
          for (let i in item.children) {
            stack.push(item.children[i])
          }
        }
      }
    },
    /** 滚动监听触发 继续加载更多源数据 */
    fromLoadMore() {
      // console.log('滚动加载源数据')
    },
    /** 滚动监听触发 继续加载更多目标数据 */
    toLoadMore() {
      // console.log('滚动加载目标数据')
    },
    /** 源数据全选 */
    fromSelectedAll(val) {
      let stack = []
      for (let i in this.fromData) {
        stack.push(this.fromData[i])
      }
      let item
      while (stack.length) {
        item = stack.shift()
        // 如果当前节点的兄弟节点 全部跟当前节点一样 则父节点保持同步
        item.isSelected = val
        // 如果该节点有子节点，继续添加进入栈顶
        if (item && item.children && !Array.isArray(item.children)) {
          for (let i in item.children) {
            stack.push(item.children[i])
          }
        }
      }
    },

    /** 目标数据全选 */
    toSelectedAll(val) {
      let stack = []
      for (let i in this.toData) {
        stack.push(this.toData[i])
      }
      let item
      while (stack.length) {
        item = stack.shift()
        // 如果当前节点的兄弟节点 全部跟当前节点一样 则父节点保持同步
        item.isSelected = val
        // 如果该节点有子节点，继续添加进入栈顶
        if (item && item.children && !Array.isArray(item.children)) {
          for (let i in item.children) {
            stack.push(item.children[i])
          }
        }
      }
    },
    /** 执行删除子地区 */
    implementDel($index) {
      // 更新表格数据
      this.mouldForm.items.splice($index, 1)
      // 更新过滤数据 删除
      const delItem = this.filterData.splice($index, 1)
      // 更新源数据
      for (let i in delItem[0]) {
        if (!this.fromData[i]) { // 不存在level1
          this.$set(this.fromData, i, delItem[0][i])
        } else {
          for (let j in delItem[0][i].children) {
            if (!this.fromData[i].children[j]) { // 不存在level2
              this.$set(this.fromData[i].children, j, delItem[0][i].children[j])
            } else {
              for (let k in delItem[0][i].children[j].children) {
                this.$set(this.fromData[i].children[j].children, k, delItem[0][i].children[j].children[k])
              }
            }
          }
        }
      }
    },
    /** 树形地区选择器确认回调 */
    addTransItem() {
      // 关闭地区选择器
      this.areaDialog = false
      // 如果是编辑模式 则进行对应运费模版子项的更新
      if (this.isEdit) {
        // 检测目标数据是否为空对象 如果是则执行删除
        if (!Object.keys(this.toData).length) {
          this.implementDel(this.currentIndex)
        } else {
          this.mouldForm.items[this.currentIndex].area = JSON.parse(JSON.stringify(this.toData))
        }
      } else { // 如果是添加模式 则添加运费模版子项
        // 校验目标数据是否为空
        if (!Object.keys(this.toData).length) {
          this.$message.warning('目标地区数据为空，可点击取消或右上角关闭地区选择器')
          return
        }
        this.mouldForm.items.push({
          first_company: 1,
          first_price: 1,
          continued_company: 1,
          continued_price: 0,
          area: JSON.parse(JSON.stringify(this.toData))
        })
      }
      // 更新过滤地区数据  把新添加或者删除的目标数据更新进入过滤地区中
      if (this.filterData[this.currentIndex]) { // 替换
        this.filterData[this.currentIndex] = JSON.parse(JSON.stringify(this.toData))
      } else { // 添加
        this.filterData.push(JSON.parse(JSON.stringify(this.toData)))
      }
      // 置空目标数据
      this.toData = {}
      // 上次源数据更新
      this.lastFromData = JSON.parse(JSON.stringify(this.fromData))
    },
    // 获取数据前设置好接口地址
    // [CRUD.HOOK.beforeRefresh]() {
    //   const query = this.query
    //   if (query.type && query.value) {
    //     this.crud.params[query.type] = query.value
    //   } else {
    //     delete this.crud.params.templateId
    //     delete this.crud.params.cityId
    //     delete this.crud.params.area
    //   }
    //   return true
    // }, // 新增与编辑前做的操作
    // [CRUD.HOOK.afterToCU](crud, form) {
    // }
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
