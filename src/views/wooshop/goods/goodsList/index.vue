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
      <!--          <el-radio-group v-model="radio1">-->

      <!--          </el-radio-group>-->

      <!--      <el-row>-->
      <!--        <el-col :span="10">-->
      <!--          <crudOperation :permission="permission" slot="left">-->

      <!--          </crudOperation>-->
      <!--        </el-col>-->
      <!--        <el-col :span="14">-->
      <crudOperation :permission="permission">
      </crudOperation>
      <el-radio-group v-model="radio1" size="medium" slot='left' @change="goodsTypeClick(radio1)">
        <el-radio-button :label="0">全部</el-radio-button>
        <el-radio-button :label="1">出售中</el-radio-button>
        <el-radio-button :label="2">已下架</el-radio-button>
        <el-radio-button :label="3">已售罄</el-radio-button>
        <el-radio-button :label="4">回收站</el-radio-button>
      </el-radio-group>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="商品主键id">
            <el-input v-model="form.id" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="商品介绍">
            <el-input v-model="form.goodsInfo" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="form.goodsName" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="商品主图片">
            <el-input v-model="form.coverImage" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="seo关键字">
            <el-input v-model="form.metaKeywords" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="商品条码（一维码）">
            <el-input v-model="form.barCode" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="商品分类id" prop="categoryId">
            <el-input v-model="form.categoryId" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.price" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="市场价格">
            <el-input v-model="form.mktprice" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="谁承担运费0：买家承担，1：卖家承担">
            <el-input v-model="form.goodsTransfeeCharge" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="计量单位">
            <el-input v-model="form.goodsUnit" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="购买数量">
            <el-input v-model="form.buyCount" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="总的库存数量">
            <el-input v-model="form.quantity" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="是否优惠  1是">
            <el-input v-model="form.isBenefit" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="是否热卖 1热卖">
            <el-input v-model="form.isHot" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="是否精品 1是">
            <el-input v-model="form.isBest" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="是否新品 1是">
            <el-input v-model="form.isNew" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="购买商品获得积分">
            <el-input v-model="form.giveIntegral" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="积分抵扣状态:0不开启、1开启抵扣">
            <el-input v-model="form.isIntegral" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="成本价格">
            <el-input v-model="form.cost" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="秒杀状态 0未开启 1已开启">
            <el-input v-model="form.seckillStart" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="砍价状态 0未开启 1开启">
            <el-input v-model="form.bargainStart" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="是否优质商品推荐 0否 1是">
            <el-input v-model="form.goodStart" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="是否单独分销佣金 0是 1不是">
            <el-input v-model="form.distributionStart" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="虚拟销量">
            <el-input v-model="form.fictitiousVolume" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="浏览数量">
            <el-input v-model="form.viewCount" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="商品二维码地址(用户小程序海报)">
            <el-input v-model="form.codePath" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="运费模板id">
            <el-input v-model="form.templateId" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="规格类型 0单规格 1多规格" prop="specType">
            <el-input v-model="form.specType" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="是否是自营商品 0 不是 1是">
            <el-input v-model="form.selfOperated" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="0 需要审核 并且待审核，1 不需要审核 2需要审核 且审核通过 3 需要审核 且审核未通过">
            <el-input v-model="form.isAuth" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="审核信息">
            <el-input v-model="form.authMessage" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="下架原因">
            <el-input v-model="form.underMessage" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="评论数量">
            <el-input v-model="form.commentNum" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="商品好评率">
            <el-input v-model="form.grade" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="服务承诺">
            <el-input v-model="form.promiseId" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="店铺id">
            <el-input v-model="form.sellerId" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="创建人">
            <el-input v-model="form.uid" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="逻辑删除 1表示删除">
            <el-input v-model="form.isDel" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="商品排序" prop="sort">
            <el-input v-model="form.sort" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="商品编码">
            <el-input v-model="form.goodsCode" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="状态（0：未上架，1：上架）">
            <el-input v-model="form.isStart" style="width: 370px;"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" :default-sort="{prop: 'index', order: 'descending'}" v-loading="crud.loading"
                :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="id" label="Id" :show-overflow-tooltip="true"/>
        <el-table-column prop="coverImage" label="主图" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.coverImage"
              :preview-src-list="[scope.row.coverImage]"
              fit="contain"
              lazy
              class="el-avatarGoods"
            >
              <div slot="error">
                <i class="el-icon-document"/>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="名称" :show-overflow-tooltip="true">
          <template slot-scope="scope" width="60">
            {{ scope.row.goodsName }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="商品价格">
          <template slot-scope="scope">
            {{ scope.row.specTypeListData[0].price }}
          </template>
        </el-table-column>
        <el-table-column prop="buyCount" label="购买数量" :show-overflow-tooltip="true"/>
        <el-table-column prop="quantity" label="库存量" :show-overflow-tooltip="true"/>
        <el-table-column prop="viewCount" label="浏览数量" :show-overflow-tooltip="true"/>
        <el-table-column prop="sort" label="排序" :show-overflow-tooltip="true"/>
        <el-table-column prop="goodsCode" label="编码" :show-overflow-tooltip="true"/>
        <el-table-column prop="isStart" label="状态">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.isStart == 1" style="cursor: pointer" :type="''">上架</el-tag>
              <el-tag v-else style="cursor: pointer" :type=" 'info' ">下架</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','wooshopStoreGoods:edit','wooshopStoreGoods:del']" label="操作"
                         width="150px" align="center">
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
import crudWooshopStoreGoods from '@/api/wooshopStoreGoods'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '商品信息', url: 'api/wooshopStoreGoods', sort: 'id,desc', crudMethod: { ...crudWooshopStoreGoods }})
const defaultCrud = CRUD({
  title: '商品信息',
  url: 'api/wooshopStoreGoods',
  sort: 'sort,asc',
  query: {goodsStartType: 0},
  crudMethod: {...crudWooshopStoreGoods}
})
const defaultForm = {
  id: null,
  goodsInfo: null,
  goodsName: null,
  coverImage: null,
  metaKeywords: null,
  barCode: null,
  categoryId: null,
  price: null,
  mktprice: null,
  goodsTransfeeCharge: null,
  goodsUnit: null,
  buyCount: null,
  quantity: null,
  isBenefit: null,
  isHot: null,
  isBest: null,
  isNew: null,
  giveIntegral: null,
  isIntegral: null,
  cost: null,
  seckillStart: null,
  bargainStart: null,
  goodStart: null,
  distributionStart: null,
  fictitiousVolume: null,
  viewCount: null,
  codePath: null,
  templateId: null,
  specType: null,
  selfOperated: null,
  isAuth: null,
  authMessage: null,
  underMessage: null,
  commentNum: null,
  grade: null,
  promiseId: null,
  sellerId: null,
  uid: null,
  isDel: null,
  createTime: null,
  updateTime: null,
  sort: null,
  goodsCode: null,
  isStart: null,
  goodsStartType: 0
}
export default {
  name: 'WooshopStoreGoods',
  components: {pagination, crudOperation, rrOperation, udOperation},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      radio1: 0,
      permission: {
        add: ['admin', 'wooshopStoreGoods:add'],
        edit: ['admin', 'wooshopStoreGoods:edit'],
        del: ['admin', 'wooshopStoreGoods:del']
      },
      rules: {
        goodsName: [
          {required: true, message: '商品名称不能为空', trigger: 'blur'}
        ],
        categoryId: [
          {required: true, message: '商品分类id不能为空', trigger: 'blur'}
        ],
        specType: [
          {required: true, message: '规格类型 0单规格 1多规格不能为空', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '商品排序不能为空', trigger: 'blur'}
        ]
      },
      queryTypeOptions: [
        {key: 'goodsCode', display_name: '商品编码'},
        {key: 'isStart', display_name: '状态（0：未上架，1：上架）'}
      ]
    }
  },
  watch: {
    /*"crud.status.cu": {
      handler: function (val) {
        console.log('商品新增watch触发', this.crud.status.cu)
        console.log('crud.data watch触发', this.crud.data)
        // this.$router.push({path:'/product/goods/'+'0'})
      },
      immediate: false,
      deep: true
    }*/
  },
  methods: {
    goodsTypeClick(num) {
      this.crud.params['goodsStartType'] = num
      console.log('点击商品类型', this.crud.params)
      this.crud.toQuery()
    },
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query

      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      } else {
        delete this.crud.params.goodsCode
        delete this.crud.params.isStart
      }
      // console.log('query',this.crud.params)
      return true
    }, // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    },
    // 新增前做的操作
    [CRUD.HOOK.beforeToAdd](crud, form) {
      console.log('新增之前')
      this.$router.push({path: '/product/goods/' + '0'})
    },
    // 编辑前做的操作
    [CRUD.HOOK.afterToEdit](crud, form) {
      console.log('编辑之后', this.crud.form.id)
      this.$router.push({path: '/product/goods/' + this.crud.form.id})
    }
  }
}

</script>

<style scoped>

</style>
