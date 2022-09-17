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
<!--          <el-form-item label="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>-->
          <el-form-item label="父级分类" >
<!--            <el-input v-model="form.parentPid" style="width: 370px;" />-->
            <el-select :disabled="form.parentPid===0" v-model="form.parentPid===0?'':form.parentPid" @change="selectChange" clearable placeholder="顶级分类" style="width: 370px;"  >
              <el-option
                v-for="item in caregoryData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
         <!--  <el-form-item label="分类路径" >
            <el-input v-model="form.path" style="width: 370px;" />
          </el-form-item>-->
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" placeholder="请输入6个字符以内!" />
          </el-form-item>
<!--          <el-form-item label="分类类型，1 附件分类，2 商品分类">
            <el-input v-model="form.type" style="width: 370px;" />
          </el-form-item>-->
<!--          <el-form-item label="分类地址，">
            <el-input v-model="form.url" style="width: 370px;" />
          </el-form-item>-->
          <el-form-item label="分类图片" prop="extra">
<!--            <el-input v-model="form.extra" style="width: 370px;" />-->
<!--            <div style="text-align: center">
              <div class="el-upload">
                <img :src="user.avatarName ? baseApi + '/avatar/' + user.avatarName : Avatar" title="点击上传头像" class="avatar" @click="toggleShow">
                <myUpload
                  :headers="headers"
                  :url="updateAvatarApi"
                  @crop-upload-success="cropUploadSuccess"
                />
              </div>
            </div>-->
            <div class="upLoadPicBox" @click="imagesFile(1,'form.extra')">
              <div v-if="form.extra" class="pictrue"><img :src="form.extra"></div>
              <div v-else class="upLoad">
                <i class="el-icon-camera cameraIconfont" />
              </div>
            </div>
          </el-form-item>

          <el-form-item label="排序:" >
<!--            <el-input v-model="form.sort" style="width: 370px;" />-->
            <el-input-number v-model="form.sort" :min="1" :max="999"  label="排序"></el-input-number>
            <span style="color: #C0C0C0;margin-left: 2px;">数字越小越靠前</span>
          </el-form-item>
<!--          <el-form-item label="分类状态, 1启用，0失效" prop="enabled">-->
<!--          <el-input v-model="form.enabled" style="width: 370px;" />-->
            <el-form-item label="状态">
              <el-radio v-model="form.enabled" :label=1 >显示</el-radio>
              <el-radio v-model="form.enabled" :label=0 >隐藏</el-radio>
            </el-form-item>
<!--          </el-form-item>-->
<!--          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="createUid">
            <el-input v-model="form.createUid" style="width: 370px;" />
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU" v-permission="['admin','wooshopConfigCategory:submit']" >确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" row-key="id"
                default-expand-all
                :tree-props="{children: 'childClass'}"
                v-loading="crud.loading" :data="crud.data"
                size="small" style="width: 100%;"
                @select="crud.selectChange"
                @select-all="crud.selectAllChange"
                @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
<!--        <el-table-column prop="id" label="id" sortable/>-->
<!--        <el-table-column prop="parentPid" label="分类父级ID" />-->
<!--        <el-table-column prop="path" label="分类路径" />-->
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="type" label="类型" >
          <template slot-scope="scope">
            <div>
              <el-tag style="cursor: pointer" >商品分类</el-tag>
            </div>
          </template>
        </el-table-column>
<!--        <el-table-column prop="url" label="分类地址，" />-->
        <el-table-column prop="extra" label="分类图片"  >
          <template slot-scope="scope">
            <el-image
              :src="scope.row.extra"
              :preview-src-list="[scope.row.extra]"
              fit="contain"
              lazy
              class="el-avatar"
            >
              <div slot="error">
                <i class="el-icon-document"/>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column  label="状态" >
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.enabled == 1" style="cursor: pointer" :type="''">显示</el-tag>
              <el-tag v-else style="cursor: pointer" :type=" 'info' ">隐藏</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="分类排序" />
<!--        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>-->
<!--        <el-table-column prop="createUid" label="createUid" />-->
<!--        <el-table-column v-permission="['admin','wooshopConfigCategory:edit','wooshopConfigCategory:del']" label="操作" width="150px" align="center">-->
        <el-table-column v-permission="['admin','wooshopConfigCategory:edit','wooshopConfigCategory:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
              msg="确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
    <FilesModal ref="tupianziyuan" @getFileImage="getFileImage"></FilesModal>
  </div>
</template>

<script>
import crudWooshopConfigCategory,{getimgcategory} from '@/api/wooshopConfigCategory'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
// import MaterialList from '@/components/material'
import {mapGetters} from "vuex";
import FilesModal from '../../filesModal/FilesModal'
// import {getimgcategory} from '@/api/wooshopConfigCategory'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '系统分类', url: 'api/wooshopConfigCategory', query: { types: 2 }, sort: 'sort,asc', crudMethod: { ...crudWooshopConfigCategory }})
const defaultForm = { id: null, parentPid: null, path: null, name: null, type: 2, url: null, extra: null, enabled: 1, sort: 999, createTime: null, updateTime: null, createUid: null }
export default {
  name: 'Classification',
  components: { pagination, crudOperation, rrOperation, udOperation, FilesModal },
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
        extra: [
          { required: true, message: '分类图片不能为空', trigger: 'blur' }
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
      ],
      caregoryData: []
    }
  },
  computed: {
   ...mapGetters([
      'baseApi',
      'fileUploadApi'
    ])
  },
  watch: {
  },
  methods: {
    getFileImage(img) {
      //父类接收图片
      console.log('父组件获取图片',img)
      this.form.extra=img.image[0].path;
    },
    imagesFile(num, path) {
      // 获取图片
      const _this = this.$refs.tupianziyuan
      _this.num = num
      _this.outerVisible = true
    },
    selectChange() {
      //修改类型级别
      console.log('选中类别(更改前)',this.form)
      if (this.form.path !== null) {
        this.form.path = '/0/' + this.form.parentPid + '/'
      }
      console.log('选中类别(更改后)',this.form)
    },
    [CRUD.HOOK.afterRefresh]() {
      console.log('刷新之后',this.crud.data)
      // this.crud.data=this.getTreeData(this.crud.data)
    },
    // 递归方法
    getTreeData(data) {
      // debugger
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        data[i].hasChildren = false;
       /* if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }*/
      }
      return data;
    },
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
    }, // 新增与编辑后做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    },
    // /** 开始 "新建/编辑" - 之前 */
    [CRUD.HOOK.beforeToCU](crud, form) {
      console.log('之前')
      getimgcategory({type:2}).then ( res => {
        console.log('响应商品分类',res)
        this.caregoryData =res;
      })
    },
    // 编辑之后做的操作
    [CRUD.HOOK.afterToEdit](crud, form) {
      console.log('编辑之后',form)
    },
    // 提交 - 之前 form没有数据
    [CRUD.HOOK.beforeSubmit](crud, form) {
      console.log('提交 - 之前',this.form)
    },
    // 提交 - 之后
    [CRUD.HOOK.afterSubmit](crud, form) {
      console.log('提交 - 之后',this.form)
    },
    // /** "新建/编辑" 验证 - 之前 */
    [CRUD.HOOK.beforeValidateCU](crud, form) {
      console.log(' "新建/编辑" 验证 - 之前',this.form)
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
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
</style>
