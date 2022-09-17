<template>
  <div class="app-container">
    <el-row :gutter="20">

      <!--用户数据-->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input
              v-model="query.blurry"
              clearable
              size="small"
              placeholder="输入名称或者邮箱搜索"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <date-range-picker v-model="query.createTime" class="date-item"/>
            <el-select
              v-model="query.enabled"
              clearable
              size="small"
              placeholder="状态"
              class="filter-item"
              style="width: 90px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in enabledTypeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
            <rrOperation/>
          </div>
          <crudOperation show="" :permission="permission"/>
        </div>

        <!--表格渲染-->
        <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
                  @selection-change="crud.selectionChangeHandler">
          <el-table-column :selectable="checkboxT" type="selection" width="55"/>
          <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名"/>
          <el-table-column :show-overflow-tooltip="true" prop="nickName" label="昵称"/>
          <el-table-column :show-overflow-tooltip="true" prop="avatarName" label="头像" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.avatarName!=null ? scope.row.avatarName : Avatar" class="avatar_list">
            </template>
          </el-table-column>
          <el-table-column prop="sex" label="性别" :formatter="estimate_sex"/>
          <el-table-column :show-overflow-tooltip="true" prop="phone" width="100" label="电话"/>
          <el-table-column :show-overflow-tooltip="true" prop="dept" label="部门">
            <template slot-scope="scope">
              <div>{{ scope.row.dept.name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="enabled">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                :disabled="user.id === scope.row.id"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="changeEnabled(scope.row, scope.row.enabled)"
              />
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="createTime" width="135" label="注册日期"/>
          <el-table-column
            label="操作"
            width="115"
            align="center"
            fixed="right"
          >
<!--            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                style="margin-bottom: 2px"
                @click="look_member_info(scope.row)"
              >
                用户详情
              </el-button>
              <el-dropdown size="mini" split-button type="info" trigger="click">
                更多
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button
                      size="mini"
                      type="success"
                      :loading="crud.status.cu === 2"
                      style="margin-bottom: 2px"
                      @click="crud.toEdit(scope.row)"
                    >
                      编辑用户
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      size="mini"
                      type="success"
                      style="margin-bottom: 2px"
                      @click="click_integral_and_money(scope.row)"
                    >
                      积分余额
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      size="mini"
                      type="success"
                      style="margin-bottom: 2px"
                      @click="edit_user_level(scope.row)"
                    >
                      修改等级
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>-->
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudUser, {getMemberInfo, getUserFriends, updateIntegralMoney, updateUserLevel} from '@/api/system/user'
import {getBrokerageOrderRecords} from '@/api/wooshopUserBrokerageRecord'
import {isvalidPhone} from '@/utils/validate'
import {getDepts, getDeptSuperior} from '@/api/system/dept'
import {getAll, getLevel} from '@/api/system/role'
import {query as gradeQuery} from '@/api/sysUserGrade'
import {getAllJob} from '@/api/system/job'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import {mapGetters} from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
import {query as queryGrade} from '@/api/sysUserGrade'
// import orderRecord from "../orderRecord";
// import WooshopIntegralRecord from "../integralRecord"
// import WooshopSignRecord from "../signRecord"
// import WooshopUserBill from '../userBill'
// import brokerageOrderRecords from '../brokerageOrderRecords'
import Avatar from '@/assets/images/avatar.png'
let userRoles = []
let userJobs = []
const defaultForm = {
  id: null,
  username: null,
  nickName: null,
  sex: '男',
  email: null,
  enabled: 'false',
  roles: [],
  jobs: [],
  dept: {id: null},
  phone: null
}
export default {
  name: 'User',
  components: {
    Treeselect,
    crudOperation,
    rrOperation,
    udOperation,
    pagination,
    DateRangePicker
    // orderRecord,
    // WooshopIntegralRecord,
    // WooshopSignRecord,
    // WooshopUserBill,
    // brokerageOrderRecords
  },
  cruds() {
    return CRUD({title: '用户', url: 'api/users', query: {deptId: 18,isDel:0}, crudMethod: {...crudUser}})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['user_status'],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      Avatar: Avatar,
      height: document.documentElement.clientHeight - 180 + 'px;',
      deptName: '', depts: [], deptDatas: [], jobs: [], level: 3, roles: [],
      jobDatas: [], roleDatas: [], // 多选时使用
      defaultProps: {children: 'children', label: 'name', isLeaf: 'leaf'},
      permission: {
        add: ['admin', 'user:add'],
        edit: ['admin', 'user:edit'],
        del: ['admin', 'user:del']
      },
      enabledTypeOptions: [
        {key: 'true', display_name: '激活'},
        {key: 'false', display_name: '锁定'}
      ],
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
        ],
        nickName: [
          {required: true, message: '请输入用户昵称', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
        ],
        phone: [
          {required: true, trigger: 'blur', validator: validPhone}
        ],
        editType: [
          {required: true, message: '增加类型不能为空', trigger: 'blur'}
        ]
      },
      gradeDataList: [],//用户等级数据
      look_member_info_show: false,//会员详情弹窗
      avatarName: '',
      integral: 0,
      mothConsumeCount: 0,
      mothOrderCount: 0,
      username: '',
      nowMoney: 0,
      sumConsumePrice: 0,
      sumOrderNUm: 0,
      userId: null,
      user_info_tab_val: '0',
      userFriendsList: [],
      click_integral_and_money_dialog_show: false,//编辑积分/余额弹窗
      integralMoneyParams: {
        uid: null,
        genreType: 0,//编辑类型:0-积分、1-余额
        editType: 0,//0-减少、1-增加
        number: 0,//积分/金额 数量
      },//编辑积分/余额 请求参数
      click_user_level_dialog_show: false,//修改等级弹窗
      sys_gradeDataList: [],//等级数据
      user_levelId: '',//用户等级
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.crud.msg.add = '新增成功，默认密码：123456'
  },
  mounted: function () {
    const that = this
    that.crud.optShow.add = false
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    submitCU_user_level() {
      //提交修改等级
      if (this.user_levelId === '') {
        this.$message({
          message: '选择的等级不能为空',
          type: 'warning'
        });
        return
      }
      console.log('修改等级', this.userId, this.user_levelId)
      updateUserLevel({userId: this.userId, levelId: this.user_levelId}).then(res => {
        console.log('修改等级', res)
        this.crud.refresh()
        this.cancel_user_level()
      })
    },
    cancel_user_level() {
      //取消编辑 等级
      this.click_user_level_dialog_show = false
      this.userId = null
      this.user_levelId = ''
      // this.crud.cancelCU()
    },
    edit_user_level(row) {
      //修改等级
      this.click_user_level_dialog_show = true
      this.userId = row.id
      this.user_levelId = row.level === 0 ? '' : row.level
      // this.crud.toEdit(row)
      gradeQuery({isStart: 1}).then(res => {
        console.log('获取到的等级配置', res)
        this.sys_gradeDataList = res.content
      })
    },
    submitCU_edit_integralMoney() {
      //提交修改积分/余额
      updateIntegralMoney(this.integralMoneyParams).then(res => {
        console.log('提交修改积分/余额', res)
        this.cancel_edit_integralMoney()
        this.crud.refresh()
      })
    },
    cancel_edit_integralMoney() {
      //取消编辑积分/余额
      this.click_integral_and_money_dialog_show = false
      this.reset_integralMoneyParams()
    },
    click_integral_and_money(row) {
      //点击 积分/余额弹窗
      this.click_integral_and_money_dialog_show = true
      this.reset_integralMoneyParams()
      console.log('点击 积分/余额弹窗', row)
      this.integralMoneyParams.uid = row.id
    },
    reset_integralMoneyParams() {
      //重置参数
      this.integralMoneyParams = {
        uid: null,
        genreType: 0,//编辑类型:0-积分、1-余额
        editType: 0,//0-减少、1-增加
        number: 0,//积分/金额 数量
      }
    },
    look_member_info(row) {
      //查看会员详情
      this.look_member_info_show = true
      this.userId = row.id
      getMemberInfo(row.id).then(res => {
        // console.log('点击查看会员详情', res)
        this.avatarName = res.avatarName
        this.integral = res.integral
        this.mothConsumeCount = res.mothConsumeCount
        this.mothOrderCount = res.mothOrderCount
        this.username = res.username
        this.nowMoney = res.nowMoney
        this.sumConsumePrice = res.sumConsumePrice
        this.sumOrderNUm = res.sumOrderNUm
      })
      if (row) {
        this.$nextTick(function () {
          console.log('.$refs.wooshopCouponInfo', this.$refs.orderRecord)
          this.$refs.orderRecord.query.uid = row.id
          this.$refs.orderRecord.uid = row.id
          this.$refs.orderRecord.crud.toQuery()
        });
      }
      this.user_info_tab_val = '0'
      this.userFriendsList = []
    },
    click_menber_info_tab(item) {
      //点击会员详情 tab

      console.log('点击查看会员详情', item)
      if (item.name === '0') {
        //消费记录
        console.log('点击会员详情', item.label)
        this.$nextTick(function () {
          console.log('.$refs.wooshopCouponInfo', this.$refs.orderRecord)
          this.$refs.orderRecord.query.uid = this.userId
          this.$refs.orderRecord.uid = this.userId
          this.$refs.orderRecord.crud.toQuery()
        });
      } else if (item.name === '1') {
        //积分记录
        console.log('点击会员详情', item.label)
        this.$nextTick(function () {
          console.log('.$refs.wooshopCouponInfo', this.$refs.integralRecord)
          this.$refs.integralRecord.query.uid = this.userId
          this.$refs.integralRecord.uid = this.userId
          this.$refs.integralRecord.crud.toQuery()
        });
      } else if (item.name === '2') {
        //签到记录
        console.log('点击会员详情', item.label)
        this.$nextTick(function () {
          console.log('.$refs.signRecord', this.$refs.signRecord)
          this.$refs.signRecord.query.uid = this.userId
          this.$refs.signRecord.uid = this.userId
          this.$refs.signRecord.crud.toQuery()
        });
      } else if (item.name === '3') {
        //持有的优惠券
        console.log('点击会员详情', item.label)
        this.$nextTick(function () {
          console.log('.$refs.wooshopCouponInfo', this.$refs.wooshopCouponInfo)
          this.$refs.wooshopCouponInfo.query.uid = this.userId
          this.$refs.wooshopCouponInfo.uid = this.userId
          this.$refs.wooshopCouponInfo.crud.toQuery()
        });
      } else if (item.name === '4') {
        //余额变动
        console.log('点击会员详情', item.label)
        this.$nextTick(function () {
          console.log('.$refs.wooshopCouponInfo', this.$refs.userBill)
          this.$refs.userBill.query.uid = this.userId
          this.$refs.userBill.uid = this.userId
          // this.$refs.userBill.query.status = 1
          // this.$refs.userBill.query.sort = 'create_time,desc'
          this.$refs.userBill.query.category = 'yuepay'
          this.$refs.userBill.crud.toQuery()
        });
      } else if (item.name === '5') {
        //获取用户好友
        getUserFriends(this.userId).then(res => {
          console.log('获取用户好友', res)
          this.userFriendsList = res
        })
      } else if (item.name === '6') {
        //分销订单
        this.$nextTick(function () {
          console.log('.$refs.brokerageOrderRecords', this.$refs.brokerageOrderRecords)
          this.$refs.brokerageOrderRecords.query.uid = this.userId
          this.$refs.brokerageOrderRecords.uid = this.userId
          this.$refs.brokerageOrderRecords.crud.toQuery()
        });
      }
    },

    estimate_sex(row, column) {
      //判断性别
      console.log(row, column, '获取成功')
      if (row.sex === '0') {
        return '女'
      } else if (row.sex === '1') {
        return '男'
      } else {
        return '未知'
      }
    },
    changeRole(value) {
      userRoles = []
      value.forEach(function (data, index) {
        const role = {id: data}
        userRoles.push(role)
      })
    },
    changeJob(value) {
      userJobs = []
      value.forEach(function (data, index) {
        const job = {id: data}
        userJobs.push(job)
      })
    },
    deleteTag(value) {
      userRoles.forEach(function (data, index) {
        if (data.id === value) {
          userRoles.splice(index, value)
        }
      })
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.getRoles()
      if (form.id == null) {
        this.getDepts()
      } else {
        this.getSupDepts(form.dept.id)
      }
      this.getRoleLevel()
      this.getJobs()
      form.enabled = form.enabled.toString()
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd]() {
      this.jobDatas = []
      this.roleDatas = []
    },
    // 初始化编辑时候的角色与岗位
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.getJobs(this.form.dept.id)

      this.jobDatas = []
      this.roleDatas = []
      userRoles = []
      userJobs = []
      const _this = this
      form.roles.forEach(function (role, index) {
        _this.roleDatas.push(role.id)
        const rol = {id: role.id}
        userRoles.push(rol)
      })
      form.jobs.forEach(function (job, index) {
        _this.jobDatas.push(job.id)
        const data = {id: job.id}
        userJobs.push(data)
      })

      this.getGrade()//获取用户等级
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (!crud.form.dept.id) {
        this.$message({
          message: '部门不能为空',
          type: 'warning'
        })
        return false
      } else if (this.jobDatas.length === 0) {
        this.$message({
          message: '岗位不能为空',
          type: 'warning'
        })
        return false
      } else if (this.roleDatas.length === 0) {
        this.$message({
          message: '角色不能为空',
          type: 'warning'
        })
        return false
      }
      crud.form.roles = userRoles
      crud.form.jobs = userJobs
      return true
    },
    // 获取左侧部门数据
    getDeptDatas(node, resolve) {
      const sort = 'id,desc'
      const params = {sort: sort}
      if (typeof node !== 'object') {
        if (node) {
          params['name'] = node
        }
      } else if (node.level !== 0) {
        params['pid'] = node.data.id
      }
      setTimeout(() => {
        getDepts(params).then(res => {
          if (resolve) {
            resolve(res.content)
          } else {
            this.deptDatas = res.content
          }
        })
      }, 100)
    },
    getDepts() {
      getDepts({enabled: true}).then(res => {
        this.depts = res.content.map(function (obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    getSupDepts(deptId) {
      getDeptSuperior(deptId).then(res => {
        const date = res.content
        this.buildDepts(date)
        this.depts = date
      })
    },
    buildDepts(depts) {
      depts.forEach(data => {
        if (data.children) {
          this.buildDepts(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    // 获取弹窗内部门数据
    loadDepts({action, parentNode, callback}) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({enabled: true, pid: parentNode.id}).then(res => {
          parentNode.children = res.content.map(function (obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 切换部门
    handleNodeClick(data) {
      console.log('切换部门', data)
      if (data.pid === 0) {
        this.query.deptId = null
      } else {
        this.query.deptId = data.id
      }
      this.crud.toQuery()
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.user_status[val] + '" ' + data.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudUser.edit(data).then(res => {
          this.crud.notify(this.dict.label.user_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    // 获取弹窗内角色数据
    getRoles() {
      getAll().then(res => {
        this.roles = res
      }).catch(() => {
      })
    },
    // 获取弹窗内岗位数据
    getJobs() {
      getAllJob().then(res => {
        this.jobs = res.content
      }).catch(() => {
      })
    },
    //获取用户等级
    getGrade() {
      console.log('获取用户等级')
      queryGrade({isStart: 1, sort: 'sort,asc', page: 0, size: 1000}).then(res => {
        console.log('获取用户等级', res)
      })
    },
    // 获取权限级别
    getRoleLevel() {
      getLevel().then(res => {
        this.level = res.level
      }).catch(() => {
      })
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.avatar_list {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}

.avatar {
  width: 70px;
  height: 70px;
  //border-radius: 50%;
  overflow: hidden;
  margin-left: 18px;

  img {
    width: 100%;
    height: 100%;
  }
}

.dashboard-workplace {
  &-header {
    &-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin-right: 16px;
      font-weight: 600;
    }

    &-tip {
      width: 82%;
      display: inline-block;
      vertical-align: middle;
      margin-top: -12px;

      &-title {
        font-size: 13px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
        line-height: 18px;
        padding: 10px 0 10px;
      }

      &-desc {
        &-sp {
          width: 32%;
          color: #17233D;
          font-size: 13px;
          display: inline-block;
        }
      }
    }

    &-extra {
      .ivu-col {
        p {
          text-align: right;
        }

        p:first-child {
          span:first-child {
            margin-right: 4px;
          }

          span:last-child {
            color: #808695;
          }
        }

        p:last-child {
          font-size: 22px;
        }
      }
    }
  }
}

.pb-1 {
  padding-bottom: 10px;
}

.mr20 {
  margin: 0 20px;
}

.border_bottom {
  border-bottom: 1px solid #E7EAEC;
}

.pb-24 {
  padding-bottom: 24px;
}

.acea-row {
  display: -webkit-box;
  display: -moz-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-lines: multiple;
  -moz-box-lines: multiple;
  -o-box-lines: multiple;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  /* 辅助类 */
}

.acea-row.row-middle {
  -webkit-box-align: center;
  -moz-box-align: center;
  -o-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.dashboard-workplace-header-tip-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
}

/*.dashboard-workplace-header-tip-desc{
  display: block;
  span{
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    display: inline-block;
  }
}*/
.dashboard-workplace-header-tip {
  display: inline-block;
  vertical-align: middle;
}
</style>
