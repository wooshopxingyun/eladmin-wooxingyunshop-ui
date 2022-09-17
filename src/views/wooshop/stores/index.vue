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
                 :title="crud.status.title" width="600px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
          <!--          <el-form-item label="主键id">
                      <el-input v-model="form.id" style="width: 370px;" />
                    </el-form-item>-->
          <el-form-item label="店铺logo" prop="storesLogo">
            <div class="upLoadPicBoxGoodsAdd">
              <div v-if="form.storesLogo" class="pictrue" @click="imagesFile(1,'form.storesLogo')"><img
                :src="form.storesLogo"></div>
              <div v-else class="upLoad" @click="imagesFile(1,'form.storesLogo')">
                <i class="el-icon-camera cameraIconfont"/>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="店铺名" prop="storesName">
            <el-input v-model="form.storesName" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="店铺介绍">
            <el-input :rows="3" v-model="form.storesInfo" type="textarea" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="联系人称呼" prop="contactName">
            <el-input v-model="form.contactName" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="店铺热线电话" prop="telephone">
            <el-input v-model="form.telephone" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="省市区" prop="storesAddress">
            <el-cascader style="width: 370px;"
                         :options="cityTreeData"
                         :props="defaultParams"
                         v-model="form.storesAddress"
                         @change="handleChange"
                         clearable></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="detailedAddress">
            <el-input v-model="form.detailedAddress" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="获取经纬度" prop="detailedAddress">
            <el-button type="primary" @click="clickAddressItude">查找门店位置</el-button>
          </el-form-item>

          <el-form-item label="地址纬度">
            <el-input v-model="form.latitude" style="width: 370px;" :disabled="true"/>
          </el-form-item>
          <el-form-item label="地址经度">
            <el-input v-model="form.longitude" style="width: 370px;" :disabled="true"/>
          </el-form-item>
          <el-form-item label="营业时间" prop="dayTime">
            <el-time-picker
              is-range
              format="HH:mm"
              value-format="HH:mm"
              v-model="form.dayTime"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="店铺状态:" prop="isStart">
            <el-radio-group v-model="form.isStart">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="自提:" prop="isTake">
            <el-radio-group v-model="form.isTake">
              <el-radio :label="1">允许</el-radio>
              <el-radio :label="0">不允许</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.sort" :min="1" :max="9999"  label="排序"></el-input-number>
            <span style="color: #C0C0C0;margin-left: 2px;">数字越小越靠前</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU"
                     v-permission="['admin','wooshopStores:submit']"
          >确认</el-button>
        </div>
      </el-dialog>

      <!--  获取经纬度    -->
      <el-dialog v-model="getcityTrr" title='上传经纬度' :visible.sync="getcityTrr" append-to-body class="mapBox"
                 width="500px">
        <iframe
          id="mapPage" width="100%" height="500px"
          v-bind:src="key"
        ></iframe>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" :default-sort="{prop: 'index', order: 'descending'}" v-loading="crud.loading"
                :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="id" label="ID" :show-overflow-tooltip="true"/>
        <el-table-column prop="storesName" label="店铺名" :show-overflow-tooltip="true"/>
        <!--        <el-table-column prop="storesInfo" label="店铺信息" :show-overflow-tooltip="true" />-->
        <el-table-column prop="telephone" label="热线电话" :show-overflow-tooltip="true"/>
        <!--        <el-table-column prop="contactName" label="联系称呼" :show-overflow-tooltip="true" />-->
        <el-table-column prop="storesAddressName" label="省市区" :show-overflow-tooltip="true"/>
        <el-table-column prop="detailedAddress" label="详细地址" :show-overflow-tooltip="true"/>
        <el-table-column prop="storesLogo" label="门店logo" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-avatar shape="square" :size="35" :src="scope.row.storesLogo"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="dayTime" label="营业时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{scope.row.dayTime[0]}}-{{scope.row.dayTime[1]}}
          </template>
        </el-table-column>
        <el-table-column prop="isStart" label="状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div>
              <el-tag :type="scope.row.isStart===1 ? 'success' : 'danger'">{{
                  scope.row.isStart === 1 ? '开店' : '关闭'
                }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <!--        <el-table-column prop="isDel" label="是否删除" :show-overflow-tooltip="true" />-->
        <el-table-column prop="isTake" label="自提状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div>
              <el-tag :type="scope.row.isTake===1 ? 'success' : 'danger'">{{
                  scope.row.isTake === 1 ? '允许' : '不允许'
                }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" :show-overflow-tooltip="true"/>

        <el-table-column v-permission="['admin','wooshopStores:edit','wooshopStores:del']" label="操作" width="150px"
                         align="center">
          <template slot-scope="scope">
            <udOperation disabled="true"
              :data="scope.row"
              :permission="permission"
              :disabled-dle="scope.row.id === 1"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination/>
      <!--   图片组件     -->
      <FilesModal ref="tupianziyuan" @getFileImage="getFileImage"></FilesModal>
    </div>
  </div>
</template>

<script>
import crudWooshopStores from '@/api/wooshopStores'
import {querySysConfig} from '@/api/wooSysConfig'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import FilesModal from '../../filesModal/FilesModal'
import {getCityTree} from '@/api/wooshopSysCity'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '店铺列表', url: 'api/wooshopStores', sort: 'id,desc', crudMethod: { ...crudWooshopStores }})
const defaultCrud = CRUD({title: '店铺列表', url: 'api/wooshopStores', sort: 'sort,asc', crudMethod: {...crudWooshopStores}})
const defaultForm = {
  id: null,
  storesName: null,
  storesInfo: null,
  telephone: null,
  contactName: null,
  storesAddress: [],
  detailedAddress: null,
  storesLogo: null,
  latitude: null,
  longitude: null,
  validTime: null,
  dayTime:  [new Date(2021, 9, 10, 8, 40), new Date(2021, 9, 10, 9, 40)],
  isStart: 1,
  isDel: null,
  isTake: 1,
  createTime: null,
  updateTime: null,
  uid: null,
  isAuth: null,
  authMessage: null,
  sort: 999
}
export default {
  name: 'WooshopStores',
  components: {pagination, crudOperation, rrOperation, udOperation, FilesModal},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      key: '',
      getcityTrr: false,
      cityTreeData: [],//城市数据
      permission: {
        add: ['admin', 'wooshopStores:add'],
        edit: ['admin', 'wooshopStores:edit'],
        del: ['admin', 'wooshopStores:del']
      },
      rules: {
        storesName: [
          {required: true, message: '店铺名称不能为空', trigger: 'blur'}
        ],
        storesInfo: [
          {required: true, message: '店铺信息不能为空', trigger: 'blur'}
        ],
        telephone: [
          {required: true, message: '店铺联系手机号码不能为空', trigger: 'blur'}
        ],
        contactName: [
          {required: true, message: '店铺联系称呼不能为空', trigger: 'blur'}
        ],
        storesAddress: [
          {required: true, message: '省市区不能为空', trigger: 'blur'}
        ],
        detailedAddress: [
          {required: true, message: '详细地址不能为空', trigger: 'blur'}
        ],
        storesLogo: [
          {required: true, message: '门店logo不能为空', trigger: 'blur'}
        ],
        latitude: [
          {required: true, message: '店铺地址纬度不能为空', trigger: 'blur'}
        ],
        longitude: [
          {required: true, message: '店铺地址经度不能为空', trigger: 'blur'}
        ],
        validTime: [
          {required: true, message: '允许核销有效日期不能为空', trigger: 'blur'}
        ],
        dayTime: [
          {required: true, message: '营业时间不能为空', trigger: 'blur'}
        ],
        isStart: [
          {required: true, message: '店铺状态:1开启 0隐藏不能为空', trigger: 'blur'}
        ],
        isDel: [
          {required: true, message: '是否删除不能为空', trigger: 'blur'}
        ],
        isTake: [
          {required: true, message: '是否允许自提:1允许 0不允许不能为空', trigger: 'blur'}
        ],
        createTime: [
          {required: true, message: '添加时间不能为空', trigger: 'blur'}
        ],
        updateTime: [
          {required: true, message: '更新时间不能为空', trigger: 'blur'}
        ]
      },
      queryTypeOptions: [
        {key: 'storesName', display_name: '店铺名称'},
        {key: 'telephone', display_name: '店铺联系手机号码'},
        {key: 'isStart', display_name: '店铺状态:1开启 0隐藏'},
        {key: 'id', display_name: '店铺id'}
      ],
      optionProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      defaultParams: {//商品类别下拉框
        multiple: false,
        label: 'name',
        value: 'id',
        children: 'children',
        expandTrigger: 'hover'
      },
    }
  },
  watch: {},
  mounted() {
    window.addEventListener('message', function (event) {
      var proto = event.data;
      if (proto && proto.module === 'locationPicker') {
        console.log('获取经纬度', proto)
        window.parent.setaddress(proto);
      }
    }, false);
    window.setaddress = this.setaddress;
  },
  methods: {
    setaddress(data){
      this.form.latitude = data.latlng.lat
      this.form.longitude = data.latlng.lng
      this.getcityTrr = false
    },
    clickAddressItude() {
      querySysConfig({menuName: 'WOOSHOP_SYSCONFIG_MAPKEY'}).then(res => {
        console.log('获取地图key', res)
        res.content.forEach(item => {
          item.value = JSON.parse(item.value)
        })
        this.key = `https://apis.map.qq.com/tools/locpicker?type=1&key=${res.content[0].value.key}&referer=myapp`
        this.getcityTrr = true
      })
    },
    handleChange(value) {
      //城市
      console.log(value);
    },
    getFileImage(img) {
      //父类接收图片
      console.log('父组件获取图片', img)
      if (img.parentName === 'form.storesLogo') {
        //主图
        this.form.storesLogo = img.image[0].path
      }
    },
    imagesFile(num, name) {
      // 获取图片
      console.log('获取图片', name)
      const _this = this.$refs.tupianziyuan
      _this.num = num

      _this.parentName = name
      _this.outerVisible = true
    },
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      } else {
        delete this.crud.params.storesName
        delete this.crud.params.telephone
        delete this.crud.params.isStart
        delete this.crud.params.id
      }
      return true
    },
    // 获取数据后设置好接口地址
    [CRUD.HOOK.afterRefresh]() {
      this.getcityData()

      this.crud.data.forEach(item=>{
        item.storesAddress=JSON.parse(item.storesAddress)
        item.dayTime=JSON.parse(item.dayTime)
      })
      console.log('获取数据后设置好接口地址',this.crud.data)
    }, // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      // this.getcityData()
    },
    getcityData() {
      getCityTree().then(res => {
        console.log('获取城市数据', res)
        this.cityTreeData = this.getTreeData(res)
        // this.areaData = this.getTreeData(res)
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
    }
  }
}


</script>

<style scoped>
.el-input-group__append, .el-input-group__prepend {
  background-color: #1890ff !important;
  color: #fff !important;
  border-color: #1890ff !important;
  border-radius: 0 4px 4px 0;
}

.cascaderW {
  width: 350px;
}

.mapBox .el-dialog__body {
  height: 640px !important;
}
</style>
