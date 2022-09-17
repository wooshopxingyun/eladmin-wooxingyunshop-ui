<template>
  <div>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" width="1050px"
               title="资源库" :visible.sync="outerVisible" center>
      <el-row :gutter="40">
        <el-col v-bind="dialog_grid1">
          <div>
            <div>
              <el-button style="width: 100%;" icon="el-icon-plus" type="primary" @click="innerVisible=true">添加分类
              </el-button>
            </div>
            <div class="trees-list infinite-list-wrapper"  style="height: 350px;border: 1px solid #409EFF;overflow:auto">
              <div class="trees-list-div">
                <div class="trees">
                  <el-tree
                    ref="tree"
                    :data="options"
                    :props="defaultProps"
                    :default-checked-keys="[0]"
                  >
                    <div slot-scope="{ node, data}" class="trees-list-node" @click.stop="handleNodeClick(data)">
                      <div>
                        <span :title="node.label">{{ node.label }}</span>
                      </div>
                    </div>
                  </el-tree>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col v-bind="dialog_grid2">
          <div class="files-conter mb15">
            <div class="files-zujian-gonju">
              <el-input v-model="queryParamFileName" type="text" placeholder="请输入搜索内容" size="small"
                        style="width: 200px;" clearable></el-input>
              <el-button type="success" icon="el-icon-search" @click="handleIconClick">搜索</el-button>
              <el-button type="primary" size="small" @click="xuanzhonImages">使用选中图片</el-button>
              <el-tooltip class="item" effect="dark" content="删除图片" placement="top-start">
                <el-button icon="el-icon-delete" type="danger" style="font-size: 15px;" size="mini" @click="deleImage"
                ></el-button>
              </el-tooltip>
              <div class="fl-r">
                <el-tooltip class="item" effect="dark" content="上传图片" placement="top-start">
                  <el-button type="primary" @click="localVisible=true">上传本地<i class="el-icon-upload el-icon--right"></i>
                  </el-button>
                </el-tooltip>
              </div>
              <div class="fl-r">
                <el-tooltip class="item" style="margin-right: 10px" effect="dark" content="上传图片" placement="top-start">
                  <el-button type="primary" @click="qiniuVisible=true">上传七牛云<i
                    class="el-icon-upload el-icon--right"></i></el-button>
                  <!--                  </el-upload>-->
                </el-tooltip>
              </div>
            </div>
            <div class="files-div files-zujian">
              <div v-show="isShowPic" class="is-not-img" style="">
                <div style="text-align: center;display: grid;">
                  <i class="el-icon-picture" style="  font-size: 60px; color: rgb(219, 219, 219);"/>
                  <span class="no-img-text">图片库为空</span>
                </div>
              </div>
              <ul class="clearfix file-ul">
                <li v-for="(item, index) in fileListData.content"
                    :key="index"
                    :class="selectedIndexs.indexOf(item)>-1 ? 'actives-select-masks':'actives-select-masks_no'"
                    class="ulimagesCss"
                    @click="onSelectItem(item)"
                >
                  <div class="imagesCss"
                       :style="{backgroundImage: `url('${baseApi + '/file/' + item.type + '/' + item.realName}')`}"></div>
                  <p class="file-name oneline-hide">{{ item.realName }}</p>
                  <!--                  <div class="select-masks">
                                      <icon class="selecteds-icon" type="check"/>
                                    </div>-->
                </li>
              </ul>
            </div>

            <div class="footer-operate">
              <el-pagination class="fl-r"
                             @size-change="handleSizeChange"
                             @current-change="handleCurrentChange"
                             :current-page.sync="currentPage"
                             :page-size="10"
                             layout="total,prev, pager, next,jumper"
                             :total="fileListData.totalElements">
              </el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>

      <!--   新增分类   -->
      <el-dialog
        width="30%"
        title="新增分类"
        :visible.sync="innerVisible"
        append-to-body>
        <el-form ref="addCategory" :model="addCategory" :rules="rules" size="small" label-width="80px">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="addCategory.name" style="width: 90%;"/>
          </el-form-item>

          <el-form-item label="上级分类" prop="categoryId">
            <el-cascader :options="optionsAdd"
                         :change-on-select="true"
                         v-model="addCategory.categoryId"
                         :props="defaultParams"
                         @visible-change="xialaTruu($event,null)"
                         style="width: 90%;"
                         ref="cascader"
            >
              <template slot-scope="{ node, data }" @click.stop="addCategoryGetClick(data)">
                <span>{{ data.name }}</span>
                <span v-if="!node.isLeaf"> ({{ data.childClass.length }}) </span>
              </template>
            </el-cascader>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="addCategory.sort" :min="1" :max="9999"
                             label="描述文字"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="categorySubmitCU(addCategory)">确认</el-button>
        </div>
      </el-dialog>
      <!--  本地上传图片    -->
      <!--表单组件-->
      <el-dialog append-to-body :close-on-click-modal="false"
                 :visible.sync="localVisible" title="文件上传到本地" width="500px">
        <el-form ref="localForm" :model="localForm" size="small" label-width="80px">
          <el-form-item label="文件名">
            <el-input v-model="localForm.name" style="width: 370px;"/>
          </el-form-item>

          <el-form-item label="分类">
            <el-cascader :options="localOptions"
                         @visible-change="xialaTruu($event,'/0/')"
                         :change-on-select="true"
                         v-model="localForm.selectedOptions"
                         :props="defaultParams"
                         :key="localForm.selectedOptions"
                         @change="clickziyuan()"
                         style="width: 370px;"
            >
              <template slot-scope="{ node, data }">
                <span>{{ data.name }}</span>
                <span v-if="!node.isLeaf"> ({{ data.childClass.length }}) </span>
              </template>
            </el-cascader>
          </el-form-item>
          <!--   上传文件   -->
          <el-form-item label="上传文件">
            <el-upload
              ref="upload"
              multiple
              drag
              :before-upload="beforeUpload"
              :auto-upload="false"
              :headers="headers"
              :on-success="handleSuccess"
              :on-error="handleError"
              :action="fileUploadApi + '?name=' + localForm.name+ '&categoryId=' + localForm.selectedOptions"
            >
              <div class="eladmin-upload"><i class="el-icon-upload"/> 添加图片</div>
              <div slot="tip" class="el-upload__tip">可上传任意格式图片，且不超过3M</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="cancel">取消</el-button>
          <el-button type="primary" @click="upload">确认</el-button>
        </div>
      </el-dialog>
      <!--  七牛云    -->
      <!-- 文件上传 -->
      <el-dialog :visible.sync="qiniuVisible" :close-on-click-modal="false" append-to-body width="500px">
        <div style="padding-bottom:15px ">分类
          <el-cascader :options="localOptions" label="分类"
                       @visible-change="xialaTruu($event,'/1/')"
                       :change-on-select="true"
                       v-model="localForm.selectedOptions"
                       :props="defaultParams"
                       :key="localForm.selectedOptions"
                       @change="clickziyuan"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.childClass.length }}) </span>
            </template>
          </el-cascader>
        </div>
        <el-upload
          :before-remove="handleBeforeRemove"
          :on-success="qiniuhandleSuccess"
          :on-error="handleError"
          :file-list="qiniufileList"
          :headers="headers"
          :data="{categoryId:localForm.selectedOptions}"
          :action="qiNiuUploadApi"
          class="upload-demo"
          multiple
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" style="display: block;" class="el-upload__tip">请勿上传违法文件，且文件不超过15M</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="qiniuupload">确认</el-button>
        </div>
      </el-dialog>

    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getToken} from '@/utils/auth'
import {add} from '@/api/tools/localStorage'
import {getimgcategory, addCategoryinfo, byCategoryGetAllImg} from '@/api/wooshopConfigCategory'
import {del} from '@/api/tools/localStorage'
import {del as qiniudel} from '@/api/tools/qiniu'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
// import pagination from '@crud/Pagination'

const defaultForm = {queryName: '', path: ''}
export default {
  name: "FilesModal",
  mixins: [header(), crud()],
  // components: {pagination},
  data() {
    return {
      num: 0, //需要使用图片的数量
      parentName: '',
      localForm: {
        name: '',
        selectedOptions: ''
      },
      form: {
        name: '',
        selectedOptions: ''
      },
      headers: {'Authorization': getToken()},
      //调起组件获取的分类 含全部图片
      options: [],
      localOptions: [],//本地点击上传弹窗，分类数据
      //新增 获取的分类
      optionsAdd: [],
      defaultParams: {
        emitPath: false,
        label: 'name',
        value: 'id',
        children: 'childClass',
        expandTrigger: 'hover'
      },
      rules: {
        name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
          {min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur'}
        ],
        categoryId: [
          {required: true, message: '请选择分类类型', trigger: 'change'}
        ]
      },
      //添加图片弹窗
      outerVisible: false,
      innerVisible: false,
      localVisible: false,//本地上传图片弹窗
      qiniuVisible: false,//七牛云上传图片弹窗
      dialog_grid1: {
        xl: 7,
        lg: 7,
        md: 7,
        sm: 7,
        xs: 24
      }, dialog_grid2: {
        xl: 17,
        lg: 17,
        md: 17,
        sm: 17,
        xs: 24
      },
      defaultProps: {
        children: 'childClass',
        label: 'name'
      },
      //点击数据结构临时存放
      treeCheckedData: [],
      addCategory: {
        sort: 99999,
        name: '',
        categoryId: '',
        type: 1
      },
      queryParam: {
        fileName: ""
      },
      queryParamFileName: '',
      isShowPic: false,
      loadingPic: false,
      //所有请求的图片列表
      fileListData: [],
      localImg: '',
      // 选中的文件 id
      selectedIndexs: [],
      //当前页数
      currentPage: 1,
      qiniuFiles: [],
      qiniufileList: [],
      getImageNumBoolen: true,
    }
  }, computed: {
    ...mapGetters([
      'baseApi',
      'fileUploadApi',
      'qiNiuUploadApi'
    ])
  },
  created() {
    this.tianjiawenj()
  }, methods: {
    xuanzhonImages() {
      console.log('使用选中图片', this.selectedIndexs)
      console.log('需要使用图片数量', this.num)
      if ( this.selectedIndexs.length <= this.num  && this.getImageNumBoolen) {
        const imageMap = {image: this.selectedIndexs, parentName: this.parentName}
        //选中数量和需要获取数量相等
        this.$emit('getFileImage', imageMap)
        this.selectedIndexs = []
        this.outerVisible = false
      }else if (!this.getImageNumBoolen){
        //不限制选中数量
        const imageMap = {image: this.selectedIndexs, parentName: ''}
        //选中数量和需要获取数量相等
        this.$emit('getFileImage', imageMap)
        this.selectedIndexs = []
        this.outerVisible = false
      } else {
        this.$message({
          showClose: true,
          message: '最多只能选取' + this.toChinesNum(this.num) + '张图片!',
          type: 'warning'
        })
        return
      }
    },
    handleBeforeRemove(file, fileList) {
      //七牛云删除钩子函数
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].uid === file.uid) {
          qiniudel([this.files[i].id]).then(res => {
          })
          return true
        }
      }
    },
    qiniuhandleSuccess(response, file, fileList) {
      //七牛云上传成功
      const uid = file.uid
      const id = response.id
      this.qiniuFiles.push({uid, id})

      this.resetForms()
      this.qiniuVisible = false;
      this.tianjiawenj()
    },
    handleSuccess(response, file, fileList) {
      //监听上传成功
      this.resetForms()
      this.crud.notify('上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      this.$refs.upload.clearFiles()
      this.localVisible = false
      this.qiniuVisible = false
      this.tianjiawenj()
      // this.crud.toQuery()
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      // this.loading = false
      this.localVisible = false
      this.qiniuVisible = false
    },
    cancel() {
      //取消按钮
      this.$refs.upload.clearFiles()
      this.localVisible = false
      this.qiniuVisible = false
      this.localOptions = [];//点击上传弹窗，分类数据
      this.localForm = {name: '', selectedOptions: ''};
    },
    qiniuupload() {
      //七牛上传文件 点击确定按钮
      this.fileList = []
      this.localOptions = [];//点击上传弹窗，分类数据
      this.localForm = {name: '', selectedOptions: ''};
      // this.dialogVisible = false
      // this.dialog = false
      // this.crud.toQuery()
    },
    // 上传文件
    upload() {
      console.log('点击上传文件', this.$refs.upload)
      if (this.localForm.selectedOptions == '') {
        // this.$message.error('分类选项不能为空!')
        this.$message({
          showClose: true,
          message: '分类选项不能为空!',
          type: 'warning'
        })
        return;
      }
      if (this.$refs.upload.uploadFiles.length == 0) {
        this.$message({
          showClose: true,
          message: '请选择图片!',
          type: 'warning'
        })
        return;
      }
      this.$refs.upload.submit()
    },
    beforeUpload(file) {
      //判断
      const isPic =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif' ||
        file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isPic) {
        this.$message.error('上传图片只能是 JPG、JPEG、PNG、GIF 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isPic && isLt2M
    },
    resetForms() {
      //重新刷新表单
      this.selectedIndexs = [];
      this.queryParamFileName = '';
      this.addCategory = {sort: 99999, name: '', categoryId: '', type: 1};
      this.treeCheckedData = [];
      // this.options = [];
      this.localOptions = [];//点击上传弹窗，分类数据
      this.optionsAdd = [];//新增 获取的分类
      this.localForm = {name: '', selectedOptions: ''};
      this.form = {name: '', selectedOptions: ''};
      // this.treeCheckedData=[];
    },
    handleSizeChange(val) {
      console.log('handleSizeChange')
    },
    deleImage() {
      //点击删除  删除图片
      console.log('点击删除', this.selectedIndexs)
      var delArray = [];
      // this.fileListData.content = [];
      this.selectedIndexs.forEach(value => {
        delArray.push(value.id)
      })
      console.log('点击删除array', this.selectedIndexs, delArray)
      del(delArray).then(res => {
        console.log('删除成功', this.fileListData)
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        });
        this.selectedIndexs = [];
        this.fileListData.content.splice(0, 10)
        //重新获取 图片
        this.isShowPic = false;
        let datas = this.treeCheckedData.id == 0 ? null : this.treeCheckedData.id;
        byCategoryGetAllImg({
          categoryId: datas,
          page: this.currentPage-1,
          realName: this.queryParamFileName
        }).then(res => {
          if (res.content.length > 0) {
            // this.$set(this.fileListData,'content',res.content)
            // this.$set(this.fileListData,'totalElements',res.totalElements)
            this.fileListData = res;
            console.log("删除成功重新获取全部图片", res);
          } else {
            this.isShowPic = true
          }
        })
      })

    },
    handleIconClick() {
      //点击搜索
      console.log('点击搜索', this.queryParamFileName)
      let datas = this.treeCheckedData.id == 0 ? null : this.treeCheckedData.id;
      this.fileListData = [];
      this.isShowPic = false;
      byCategoryGetAllImg({categoryId: datas, realName: this.queryParamFileName}).then(res => {
        if (res.content.length > 0) {
          this.fileListData = res;
          this.selectedIndexs = [];
          console.log("获取全部图片", res);
        } else {
          this.isShowPic = true
        }
      })
    },
    handleCurrentChange(val) {
      //点击下一页

      this.currentPage = val;
      console.log(`下一页: ${val}`, this.currentPage);
      // this.$set(this.currentPage, val)
      let datas = this.treeCheckedData.id == 0 ? null : this.treeCheckedData.id;
      this.fileListData.content = [];
      // this.$set(this.fileListData, [])
      this.isShowPic = false;
      byCategoryGetAllImg({categoryId: datas, page: this.currentPage-1, realName: this.queryParamFileName}).then(res => {
        if (res.content.length > 0) {
          this.fileListData.content = res.content;
          // this.$set(this.fileListData.content, 'content', res.content)
          this.selectedIndexs = [];
          console.log("获取全部图片", res);
        } else {
          this.isShowPic = true
        }

      })
      // this.init()
    },
    onSelectItem(index) {
      //选中图片
      // this.selectedIndexs.push(index)
      const key = this.selectedIndexs.indexOf(index)
      const selected = key > -1
      if (selected) {
        this.selectedIndexs.splice(key, 1);
        // this.selectedIndexsbollen=false;
      } else {
        this.selectedIndexs.push(index);
        // this.selectedIndexsbollen=true;
      }
      console.log("选中图片", this.selectedIndexs)
    },
    categorySubmitCU(addCategory) {
      //新增分类信息
      console.log("新增分类提交", this.addCategory)

      addCategoryinfo(this.addCategory).then(res => {
        console.log("新增分类提交", res)
        this.optionsAdd = []
        this.addCategory = {
          sort: 99999,
          name: '',
          categoryId: '',
          type: 1
        }
        const addQuanBufenZu = res
        addQuanBufenZu.unshift({id: 0, name: '全部分组', childClass: []})
        console.log("请求", addQuanBufenZu)
        this.options = this.getTreeData(addQuanBufenZu);
        this.selectedIndexs = [];
        this.innerVisible = false;
        this.treeCheckedData = [];
        this.tianjiawenj()
      })
    },
    addCategoryGetClick(data) {
      console.log("新增分类获取data", data)
    },
    handleNodeClick(data) {
      //点击树形结构分类
      console.log("点击", data)
      let datas = data.id == 0 ? null : data.id;
      // let realNameData=this.queryParamFileName===''?'':this.queryParamFileName;
      this.treeCheckedData = data;
      this.fileListData = [];
      this.isShowPic = false;
      byCategoryGetAllImg({categoryId: datas, realName: this.queryParamFileName, page: this.currentPage-1}).then(res => {
        if (res.content.length > 0) {
          this.fileListData = res;
          this.selectedIndexs = [];
          console.log("获取全部图片", res);
        } else {
          this.isShowPic = true
        }

      })
    },
    tianjiawenj() {
      //点击资源库弹窗
      // this.outerVisible = true
      console.log("图片组件弹窗")
      //获取分类
      getimgcategory({type: 1}).then(res => {
        const addQuanBufenZu = res
        addQuanBufenZu.unshift({id: 0, name: '全部分组', childClass: []})
        this.treeCheckedData = {id: 0, name: '全部分组', childClass: undefined}//初始化点击值
        console.log("请求", addQuanBufenZu)
        this.options = this.getTreeData(addQuanBufenZu);
      })
      this.fileListData = [];
      this.isShowPic = false;
      byCategoryGetAllImg().then(res => {
        if (res.content.length > 0) {
          this.fileListData = res
          console.log("获取全部图片", res);
        } else {
          this.isShowPic = true
        }

      })
    },
    clickziyuan(val) {
      console.log("点击下拉框")
    },
    xialaTruu(e, path) {
      console.log("点击下拉框进来", e)
      if (e) {
        getimgcategory({type: 1, path: path}).then(res => {
          console.log("请求", res)
          if (path !== null) {
            this.localOptions = this.getTreeData(res);
          } else {
            this.optionsAdd = this.getTreeData(res);
          }
        })
      }
    },
    // 递归方法
    getTreeData(data) {
      // debugger
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {

        if (data[i].childClass.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].childClass = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].childClass);
        }
      }
      return data;
    },
    toChinesNum(num) {
      let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      let unit = ["", "十", "百", "千", "万"];
      num = parseInt(num);
      let getWan = (temp) => {
        let strArr = temp.toString().split("").reverse();
        let newNum = "";
        for (var i = 0; i < strArr.length; i++) {
          newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
        }
        return newNum;
      }
      let overWan = Math.floor(num / 10000);
      let noWan = num % 10000;
      if (noWan.toString().length < 4) {
        noWan = "0" + noWan;
      }
      return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
    }
  }
}
</script>

<style scoped>

/* ---------------------------------------图片组件 ------------------------------------------------- */
.actives-select-masks {
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(24, 144, 255, 0.80);
  text-align: center;
  border-radius: 2px;
}

.actives-select-masks_no {
  /*display: none;*/
  background: rgba(0, 0, 0, 0);
}

.ulimagesCss {
  width: 110px;
  padding: 4px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  float: left;
  margin: 8px;
  list-style: none;

  width: 110px;
  position: relative;
  cursor: pointer;
  border-radius: 2px;
  /*padding: 4px;*/
  border: 1px solid rgba(0, 0, 0, 0.05);
  float: left;
  margin: 8px;
  -webkit-transition: All 0.2s ease-in-out;
  -moz-transition: All 0.2s ease-in-out;
  -o-transition: All 0.2s ease-in-out;
  transition: All 0.2s ease-in-out;

&
:hover {
  border: 1px solid #16bce2;
}

}
.imagesCss {
  margin: 0 auto;
  width: 95px;
  height: 95px;
  background: no-repeat center center / 100%;
}


.files-zujian {
  margin-top: 10px;
}


.trees-list {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  position: relative;

.trees-list-div {
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 10px 0 10px 0;
  box-sizing: border-box;

.trees {
  width: 100%;
}

}
.trees-list-div::-webkit-scrollbar {
  display: none;
}

}
.trees-list-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
  color: #4386c6;
}


.files-conter {
  /*width: 90%; //原来*/
  width: 680px;
  height: 100%;

.files-zujian-gonju {
  width: 100%;
  /*padding: 0 13px 10px 7px;*/ /*顶部工具栏*/
  box-sizing: border-box;
  display: flex;
  padding-left: 10px; /*设置工具栏 边距*/
}

.files-div {
  /*padding-left: 15px;*/
  width: 100%;

el-image {
  width: 100%;
  border: 2px solid #fff;
}

}


.imagesNo {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 65px 0;

.no-img-text {
  font-size: 13px;
  color: #dbdbdb;
  line-height: 3;
}

}


&
:hover {
  border: 1px solid #16bce2;
}

/*// 文件名称*/
.file-name {
  font-size: 12px;
  text-align: center;
}

/*// 底部操作栏*/
.footer-operate {
  height: 28px;
  margin-top: 10px;

}

}

.fl-l {
  float: left;
}

.fl-r {
  float: right;
}

/* 浮动 */
.
clearfix

(
)
{
  zoom: 1
;

&
::before,

&
::after {
  display: table;
  content: ' ';
}

&
::after {
  clear: both;
  height: 0;
  font-size: 0;
  visibility: hidden;
}

}
.oneline-hide {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  margin: 0;
}

.mb15 {
  margin-bottom: 15px;
}

/* 浮动 */
.
clearfix

(
)
{
  zoom: 1
;

&
::before,

&
::after {
  display: table;
  content: ' ';
}

&
::after {
  clear: both;
  height: 0;
  font-size: 0;
  visibility: hidden;
}

}
.file-ul {
  padding: 0;
}

/* 浮动 */
.
clearfix

(
)
{
  zoom: 1
;

&
::before,

&
::after {
  display: table;
  content: ' ';
}

&
::after {
  clear: both;
  height: 0;
  font-size: 0;
  visibility: hidden;
}

}
.is-not-img {
  height: 280px;
  margin: 0 auto;

  display: flex;
  flex-wrap: wrap;
  align-content: space-around;
  justify-content: space-around;
  align-items: center;

}

.image-no-icon {

}
</style>
