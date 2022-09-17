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

      <!--  新增分类    -->
      <el-dialog title="新增分类" :append-to-body="true" :close-on-click-modal="false" :visible.sync="categoryAdd">
        <el-form ref="categoryForm" :model="categoryForm" :rules="rules" size="small" label-width="80px">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="categoryForm.name" style="width: 370px;" placeholder="请输入6个字符以内!"/>
          </el-form-item>
          <el-form-item label="分类图标" prop="extra">
            <div class="upLoadPicBox" @click="imagesFile(1,'categoryForm.extra')">
              <div v-if="categoryForm.extra" class="pictrue"><img :src="categoryForm.extra"></div>
              <div v-else class="upLoad">
                <i class="el-icon-camera cameraIconfont"/>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="排序:">
            <el-input-number v-model="categoryForm.sort" :min="1" :max="999" label="排序"></el-input-number>
            <span style="color: #C0C0C0;margin-left: 2px;">数字越小越靠前</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="categoryAdd=false">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="categoryClickAdd">确认</el-button>
        </div>
      </el-dialog>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="800px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="分类" prop="categoryId">
            <el-select v-model="form.categoryId" placeholder="请选择" style="width: 370px;">
              <el-option clearable
                v-for="item in categoryDataList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-link type="primary" @click="categoryAdd=true" target="_blank">去新增</el-link>
            <el-link type="primary" @click="getClassification(3)" target="_blank">刷新</el-link>
          </el-form-item>
          <el-form-item label="文章标题" prop="articleTitel">
            <el-input v-model="form.articleTitel" style="width: 370px;" placeholder="文章标题"/>
          </el-form-item>
          <el-form-item label="文章作者">
            <el-input v-model="form.articleAuthor" style="width: 370px;" placeholder="文章作者"/>
          </el-form-item>
          <el-form-item label="文章封面" prop="coverImage">
            <!--            <el-input v-model="form.coverImage" style="width: 370px;"/>-->
            <div class="upLoadPicBox" @click="imagesFile(1,'form.coverImage')">
              <div v-if="form.coverImage" class="pictrue"><img :src="form.coverImage"></div>
              <div v-else class="upLoad">
                <i class="el-icon-camera cameraIconfont"/>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="文章简介">
            <el-input v-model="form.synopsis" style="width: 370px;" type="textarea" placeholder="文章简介"/>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <!--            <el-input v-model="form.sort" style="width: 370px;" />-->
            <el-input-number style="width: 220px;" v-model="form.sort" :min="0"
                             :max="9999"></el-input-number>
            <div>
              <span style="color: #C0C0C0;margin-left: 2px;">数字越小越靠前</span>
            </div>
          </el-form-item>
          <el-form-item label="状态" prop="isStart">
            <el-radio-group v-model="form.isStart">
              <el-radio :label="1">发布</el-radio>
              <el-radio :label="0">保存草稿</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文章内容" prop="articleContent">
            <TEditor style="z-index: 3000 !important;"  ref="editor" v-model="form.articleContent" v-if="crud.status.cu > 0"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU" v-permission="['admin','wooshopSysArticle:submit']" >确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" :default-sort="{prop: 'index', order: 'descending'}" v-loading="crud.loading"
                :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="id" label="ID" :show-overflow-tooltip="true"/>
        <el-table-column prop="categoryName" label="分类" :show-overflow-tooltip="true"/>
        <el-table-column prop="articleTitel" label="标题" :show-overflow-tooltip="true"/>
        <el-table-column prop="articleAuthor" label="作者" :show-overflow-tooltip="true"/>
        <el-table-column prop="coverImage" label="封面" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="upLoadPicBox" >
              <div v-if="scope.row.coverImage" class="pictrue">
                <img :src="scope.row.coverImage">
              </div>
              <div v-else class="upLoad">
                <i class="el-icon-camera cameraIconfont"/>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="synopsis" label="文章简介" :show-overflow-tooltip="true"/>
        <el-table-column prop="visitCount" label="浏览次数" :show-overflow-tooltip="true"/>
        <el-table-column prop="sort" label="排序" :show-overflow-tooltip="true"/>
        <el-table-column prop="isStart" label="状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.isStart == 1" style="cursor: pointer" :type="''">已发布</el-tag>
              <el-tag v-else style="cursor: pointer" :type=" 'info' ">未发布</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="articleContent" label="文章内容" :show-overflow-tooltip="true"/>
        <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','wooshopSysArticle:edit','wooshopSysArticle:del']" label="操作"
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
      <!--  图片组件    -->
      <FilesModal ref="tupianziyuan" @getFileImage="getFileImage" ></FilesModal>
    </div>
  </div>
</template>

<script>
import crudWooshopSysArticle from '@/api/wooshopSysArticle'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import TEditor from '../../components/TEditor.vue'
// import {getimgcategory, addCategoryinfo, byCategoryGetAllImg} from '@/api/wooshopConfigCategory'
import {queryGet as queryGetCategory, add as categoryAdd} from '@/api/wooshopConfigCategory'
import FilesModal from '../../filesModal/FilesModal'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '新闻文章', url: 'api/wooshopSysArticle', sort: 'id,desc', crudMethod: { ...crudWooshopSysArticle }})
const defaultCrud = CRUD({
  title: '新闻文章',
  url: 'api/wooshopSysArticle',
  sort: '',
  crudMethod: {...crudWooshopSysArticle}
})
const defaultForm = {
  id: null,
  categoryId: null,
  articleTitel: null,
  articleAuthor: null,
  coverImage: null,
  synopsis: null,
  shareTitle: null,
  shareSynopsis: null,
  visitCount: null,
  sort: 9999,
  url: null,
  mediaId: null,
  isStart: 1,
  hide: 0,
  adminId: null,
  merId: null,
  goodsId: null,
  isHot: 0,
  isBanner: null,
  articleContent: null,
  createTime: null,
  updateTime: null,
  isDel: null,
  likeNum: null
}
export default {
  name: 'WooshopSysArticle',
  components: {pagination, crudOperation, rrOperation, udOperation, TEditor, FilesModal},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'wooshopSysArticle:add'],
        edit: ['admin', 'wooshopSysArticle:edit'],
        del: ['admin', 'wooshopSysArticle:del']
      },
      rules: {
        categoryId: [
          {required: true, message: '分类id不能为空', trigger: 'blur'}
        ],
        articleTitel: [
          {required: true, message: '文章标题不能为空', trigger: 'blur'}
        ],
        coverImage: [
          {required: true, message: '文章图片不能为空', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '排序不能为空', trigger: 'blur'}
        ],
        isStart: [
          {required: true, message: '状态 1启用 0关闭不能为空', trigger: 'blur'}
        ],
        hide: [
          {required: true, message: '是否隐藏 0否不能为空', trigger: 'blur'}
        ],
        goodsId: [
          {required: true, message: '商品关联id不能为空', trigger: 'blur'}
        ],
        isHot: [
          {required: true, message: '是否热门(小程序)不能为空', trigger: 'blur'}
        ],
        articleContent: [
          {required: true, message: '文章内容不能为空', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '分类名称不能为空', trigger: 'blur'}
        ],
        extra: [
          {required: true, message: '分类名称不能为空', trigger: 'blur'}
        ]
      },
      queryTypeOptions: [
        {key: 'categoryId', display_name: '分类id'},
        {key: 'articleTitel', display_name: '文章标题'},
        {key: 'isStart', display_name: '状态 1启用 0关闭'}
      ],
      //获取的分类
      categoryDataList: [],
      categoryAdd: false,//分类弹窗
      categoryForm: {name: null, extra: null, sort: 999, enabled: 1, type: 3}
    }
  },
  watch: {},
  methods: {
    getFileImage(img) {
      //父类接收图片
      console.log('父组件获取图片', img)
      if (img.parentName === 'categoryForm.extra') {
        this.categoryForm.extra = img.image[0].path;
      } else if (img.parentName === 'form.coverImage') {
        this.form.coverImage = img.image[0].path;
      }
    },
    imagesFile(num, path) {
      // 获取图片
      const _this = this.$refs.tupianziyuan
      _this.num = num
      _this.parentName = path
      _this.outerVisible = true
    },
    categoryClickAdd() {
      //提交 新增分类
      console.log('新增分类')
      if (this.categoryForm.extra !== null && this.categoryForm.name !== null) {
        categoryAdd(this.categoryForm).then(res => {
          console.log('新增分类成功', res)
          this.getClassification()
        })
        this.categoryAdd = false
        this.categoryForm = {name: null, extra: null, sort: 999, enabled: 1, type: 3}
      } else {
        this.$message({
          message: '分类名称和分类图标(180*180)不能为空！',
          type: 'error'
        })
      }
    },
    getClassification(num) {
      //获取类别数据初始化
      const classficationData = {type: 3, sort: 'sort,asc', enabled: 1, page: 0, size: 1000}
      queryGetCategory(classficationData).then(res => {
        console.log('商品分类', res)
        this.categoryDataList = res.content
        if (num === 1) {
          this.$message({
            message: '刷新商品类别成功！',
            type: 'success'
          })
        }
      })

    },
    addCategoryGetClick(data) {
      console.log("新增分类获取data", data)
    },
    xialaTruu(e, path) {
      console.log("点击下拉框进来", e)
      if (e) {
        const classficationData = {type: 3, sort: 'sort,asc', enabled: 1, page: 0, size: 1000}
        queryGetCategory(classficationData).then(res => {
          console.log("请求", res)
          // if (path !== null) {
          this.categoryDataList = res.content
          // } else {
          //   this.optionsAdd = this.getTreeData(res);
          // }
        })
      }
    },
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      } else {
        delete this.crud.params.categoryId
        delete this.crud.params.articleTitel
        delete this.crud.params.isStart
      }
      return true
    }, // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.getClassification()
    }
  }
}


</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/*div {

.tox-tinymce-aux {
  z-index: 5000 !important;
}

}*/

/*TEditor{
.tox-tinymce-aux{

}
}*/
</style>
