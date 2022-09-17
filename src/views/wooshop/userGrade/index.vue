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
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="等级名称" prop="gradeName">
            <el-input v-model="form.gradeName" style="width: 370px;"/>
            <div>
              <span style="color: #C0C0C0;margin-left: 2px;">例如：普通、白银、黄金、钻石</span>
            </div>
          </el-form-item>
          <el-form-item label="等级权重">
            <el-input-number style="width: 370px;" v-model="form.gradeWeight" :min="1" :max="20"
                             :step="1"></el-input-number>
            <div>
              <span style="color: #C0C0C0;margin-left: 2px;">会员等级的权重，数字越大 等级越高</span>
            </div>
          </el-form-item>
          <el-form-item label="经验">
            <el-input-number style="width: 370px;" v-model="form.experience" :min="1"
                             :step="1"></el-input-number>
            <div>
              <span style="color: #C0C0C0;margin-left: 2px;">达到该等级所需要的经验</span>
            </div>
          </el-form-item>
          <el-form-item label="升级条件">
            实际消费金额满
            <el-input-number style="width: 200px;" v-model="form.gradeCondition" :min="0" :step="0.01" :precision="2"
            ></el-input-number>
            元
            <div>
              <span style="color: #C0C0C0;margin-left: 2px;">用户的实际消费金额满足后，自动升级</span>
            </div>
          </el-form-item>
          <el-form-item label="等级权益">
            折扣率
            <el-input-number style="width: 200px;" v-model="form.gradeRights" :min="0" :step="1" :max="99"
                             :precision="1"
            ></el-input-number>
            折
            <div>
              <span style="color: #C0C0C0;margin-left: 2px;">折扣率范围0.0-9.9，例如: 98代表9.8折，0代表不折扣</span>
            </div>
          </el-form-item>
          <el-form-item label="状态:">
            <el-radio-group v-model="form.isStart">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="等级图标">
            <el-input v-model="form.gradeIcons" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="排序:">
            <el-input-number style="width: 220px;" v-model="form.sort" :min="0"
                             :max="99999"></el-input-number>
            <div>
              <span style="color: #C0C0C0;margin-left: 2px;">数字越小越靠前</span>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU" v-permission="['admin','sysUserGrade:submit']" >确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" :default-sort="{prop: 'index', order: 'descending'}" v-loading="crud.loading"
                :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="id" label="Id" :show-overflow-tooltip="true"/>
        <el-table-column prop="gradeIcons" label="图标" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="gradeName" label="等级名称" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="gradeWeight" label="等级权重" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="experience" label="经验" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="gradeCondition" label="等级条件" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">
            <div>
              消费满{{scope.row.gradeCondition}}元
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="gradeRights" label="等级权益" :show-overflow-tooltip="true" align="center"/>
        <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isStart" label="状态" align="center">
          <template slot-scope="scope">
            <div>
              <el-tag effect="dark" v-if="scope.row.isStart == 1" style="cursor: pointer" :type="'success'">启用
              </el-tag>
              <el-tag effect="dark" v-else style="cursor: pointer" :type="'warning'">关闭</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" :show-overflow-tooltip="true"/>
        <el-table-column v-permission="['admin','sysUserGrade:edit','sysUserGrade:del']" label="操作" width="150px"
                         align="center">
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

      <!--   图片组件     -->
      <FilesModal ref="tupianziyuan" @getFileImage="getFileImage"></FilesModal>
    </div>
  </div>
</template>

<script>
import crudSysUserGrade from '@/api/sysUserGrade'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import FilesModal from '../../filesModal/FilesModal'

// crud交由presenter持有
//const defaultCrud = CRUD({ title: '会员等级', url: 'api/sysUserGrade', sort: 'id,desc', crudMethod: { ...crudSysUserGrade }})
const defaultCrud = CRUD({title: '会员等级', url: 'api/sysUserGrade', sort: '', crudMethod: {...crudSysUserGrade}})
const defaultForm = {
  id: null,
  gradeName: null,
  gradeWeight: null,
  gradeCondition: null,
  gradeRights: null,
  createTime: null,
  updateTime: null,
  isStart: 1,
  isDel: null,
  gradeIcons: null,
  experience: null,
  sort: 99
}
export default {
  name: 'SysUserGrade',
  components: {pagination, crudOperation, rrOperation, udOperation, FilesModal},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'sysUserGrade:add'],
        edit: ['admin', 'sysUserGrade:edit'],
        del: ['admin', 'sysUserGrade:del']
      },
      rules: {
        gradeName: [
          {required: true, message: '等级名称不能为空', trigger: 'blur'}
        ]
      },
      queryTypeOptions: [
        {key: 'gradeName', display_name: '等级名称'},
        {key: 'isStart', display_name: '1启用 0关闭 状态'}
      ]
    }
  },
  watch: {},
  methods: {
    imagesFile(num, name) {
      // 获取图片
      console.log('获取图片', name)
      const _this = this.$refs.tupianziyuan
      _this.num = num

      _this.parentName = name
      _this.outerVisible = true
    },
    getFileImage(img) {
      //父类接收图片
      console.log('父组件获取图片', img)
      if (img.parentName === 'form.gradeIcons') {
        //主图
        this.form.gradeIcons = img.image[0].path
      }
    },
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      } else {
        delete this.crud.params.gradeName
        delete this.crud.params.isStart
      }
      return true
    }, // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    }
  }
}


</script>

<style scoped>

</style>
