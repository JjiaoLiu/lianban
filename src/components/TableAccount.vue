<template>
  <div class="section">
    <el-table
      stripe
      :data="table.list"
      :cell-class-name="tableCellClassName"
      :header-cell-class-name="tableHeaderClassName"
      style="width: 100%">
      <el-table-column
        prop="userName"
        label="账号"
        width="160">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="姓名"
        width="160">
      </el-table-column>
      <el-table-column
        prop="deptName"
        width="160"
        label="部门">
      </el-table-column>
      <el-table-column
        prop="roleNames"
        width="260"
        label="空间权限">
      </el-table-column>
      <el-table-column
        prop="roleNames"
        width="330"
        label="角色">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)" v-if="enable">
            <img src="../assets/img/icon_edit.png" height="16" width="14"/>
          </el-button>
          <el-button type="text" @click="toenable(scope.row,0)" v-if="enable">
            <img src="../assets/img/icon_delete.png" height="16" width="16"/>
          </el-button>
          <el-button type="text" @click="toenable(scope.row,1)" v-if="!enable">
            <img src="../assets/img/icon_delete_back.png" height="20" width="22"/>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="formInline.page"
        :page-size="formInline.pageSize"
        layout="prev, pager, next"
        :total="table.total">
      </el-pagination>
    </div>
    <BaseMessageBox :title="title" :show.sync="showEditBox" @before-close="handleClose('addForm')">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="80px" label-position="left" size="small">
        <el-form-item label="账号" prop="userName">
          <el-input v-model.trim="addForm.userName" placeholder="请输入账号" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model.trim="addForm.realName" placeholder="请输入姓名" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :class='{"is-required":isRequired}'>
          <el-input v-model.trim="addForm.password" type="password" placeholder="请输入密码" style="width: 100%"
                    auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rpassword" :class='{"is-required":isRequired}'>
          <el-input v-model.trim="addForm.rpassword" type="password" placeholder="请重新输入密码" style="width: 100%"
                    auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="addForm.email" placeholder="请输入邮箱" style="width: 50%"></el-input>&nbsp;&nbsp;@tongyangstock.com
        </el-form-item>
        <el-form-item label="手机号" prop="cellphone">
          <el-input v-model.trim="addForm.cellphone" placeholder="请输入手机号" style="width: 50%"
          ></el-input>
        </el-form-item>
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio v-model="addForm.gender" :label="1">男</el-radio>
              <el-radio v-model="addForm.gender" :label="0">女</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker
                v-model="addForm.birthday"
                style="width: 100%"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="12">
            <el-form-item label="部门" prop="departmentId_sc">
              <BaseDepartmentSelect :departmentId_sc.sync="addForm.departmentId_sc"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位" prop="postId_sc">
              <el-select v-model="addForm.postId_sc" placeholder="请选择岗位" style="width: 100%">
                <el-option
                  v-for="(post,index) in post_list"
                  :key="index"
                  v-if="post.departmentId_sc === addForm.departmentId_sc"
                  :label="post.postName"
                  :value="post.postId_sc">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="空间" prop="cityCode" style="display: inline-block">
              <BaseCitySelect :cityCode.sync="addForm.cityCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="spaceIds_sc" style="display: inline-block;width: 100%" label-width="0">
              <BaseSpaceRoomSelect :spaceId_sc.sync="addForm.spaceIds_sc" :cityCode="addForm.cityCode" multiple="multiple"
                                   style="width: 100%"></BaseSpaceRoomSelect>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="权限角色">
          <BaseDepartmentTab :list_sc.sync="list_sc"></BaseDepartmentTab>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="primary" style="font-size: 20px;width: 140px;margin-top: 30px"
                     @click="submitForm('addForm')">{{title}}
          </el-button>
        </el-form-item>
      </el-form>
    </BaseMessageBox>
  </div>
</template>

<script>
  import qs from 'query-string'
  import {Bus} from "../bus";
  import {checkPhone1} from './../validator'
  import BaseDepartmentSelect from './../components/BaseDepartmentSelect'
  import BaseSpaceRoomSelect from './../components/BaseSpaceRoomSelect'
  import BaseCitySelect from './../components/BaseCitySelect'
  import BaseDepartmentTab from './../components/BaseDepartmentTab'
  import BaseMessageBox from './../components/BaseMessageBox'

  export default {
    name:"sysAccount",
    props:['enable','userName'],
    components:{BaseDepartmentSelect,BaseCitySelect,BaseDepartmentTab,BaseSpaceRoomSelect,BaseMessageBox},
    data(){
      let validatePass = (rule,value,callback) => {
        if(this.isRequired){
          if(!value){
            callback("请输入密码");
          }
          if(this.addForm.rpassword !== ''){
            this.$refs['addForm'].validateField('rpassword');
          }
        }
        callback();
      };
      let validatePass2 = (rule,value,callback) => {
        if(this.isRequired){
          if(!value){
            callback("请重新输入密码");
          }
          if(value !== this.addForm.password){
            callback(new Error('×两次输入密码不一致!'));
          }
        }
        callback();
      };
      return {
        tableCellClassName:'tableCellClassName',tableHeaderClassName:'tableHeaderClassName',formInline:{
          pageSize:15,page:1,enable:this.enable,userName:''
        },table:{},addForm:{spaceIds_sc:[],gender:1,roleList_sc:[]},// validatePhone:checkPhone2,
        rules:{
          userName:[{required:true,message:'×请输入账号',trigger:'blur'},],
          realName:[{required:true,message:'×请输入姓名',trigger:'blur'},],
          password:[{validator:validatePass,trigger:'blur'}],
          rpassword:[{validator:validatePass2,trigger:'blur'}],
          email:[{required:true,message:'×请输入邮箱地址',trigger:'blur'}],
          cellphone:[{required:true,message:'×请输入手机号',trigger:'blur'},{validator:checkPhone1,trigger:'blur'}],
        },post_list:[],list_sc:[],  // 剥离出当前可用岗位
        showEditBox:false,title:'添加',baseTitle:'账号',isRequired:true
      }
    },
    created(){
      this.getDataList();
      this.getPostlist();
      if(this.enable){
        Bus.$on('addAccount',() => {
          this.list_sc = [];
          this.addForm = {spaceIds_sc:[],gender:1,roleList_sc:[]};
          this.title = '添加';
          this.isRequired = true;
          this.showEditBox = true
        });
        Bus.$on('getAccountList',() => {
          this.formInline.page = 1;
          this.getDataList()
        })
      }
    },
    methods:{
      handleCurrentChange(){
        this.getDataList()
      },getDataList(){
        this.$axios.post(process.env.API_HOST[0] + '/user/list?' + qs.stringify(this.formInline)).then(res => {
          if(res.data.success === true){
            this.table = res.data;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },toenable(row,enable){
        let type = enable === 0 ? '删除' : '还原';
        let string = enable === 0 ? `您的确认要将${this.baseTitle}${row.userName}删除并放入回收站吗` : `您的确认要将${this.baseTitle}${row.userName}还原吗`;
        this.$confirm(string,'提示',{
          confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
        }).then(() => {
          this.$axios.get(process.env.API_HOST[0] + '/user/enable',{
            params:{userId_sc:row.userId_sc,enable:enable}
          }).then(res => {
            if(res.data.success === true){
              this.getDataList();
              this.$message.success(`${type}成功!`)
            }else{
              this.$message.warning(res.data.msg)
            }
          })
        }).catch(() => {
          this.$message.info("已取消操作")
        });
      },getPostlist(){
        this.$axios.get(process.env.API_HOST[0] + '/dept/postList').then(res => {
          if(res.data.success === true){
            this.post_list = res.data.list;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },submitForm(formName){ // 添加  修改  角色
        this.$set(this.addForm,"roleList_sc",this.list_sc);
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$confirm(`你确认${this.title}此${this.baseTitle}吗`,'提示',{
              confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
            }).then(() => {
              this.$axios.post(process.env.API_HOST[0] + '/user/save',this.addForm).then(res => {
                if(res.data.success === true){
                  this.$refs[formName].clearValidate();
                  setTimeout(() => {
                    this.$message.success(this.title + "成功");
                    this.showEditBox = false;
                    this.getDataList();
                  },0)
                }else{
                  this.$message.warning(res.data.msg)
                }
              })
            }).catch(() => {
              this.$message.info('已取消操作');
            });
          }else{
            return false
          }
        });
      },edit(row){
        this.title = '修改';
        this.isRequired = false;
        this.$axios.get(process.env.API_HOST[0] + '/user/detail',{
          params:{userId_sc:row.userId_sc}
        }).then(res => {
          if(res.data.success === true){
            this.addForm = res.data;
            this.showEditBox = true;
            // 剥离出所有权限id
            this.addForm.roleList_sc.forEach((f,i,fs) => {
              f.roleList_sc.forEach((fx,ix,fsx) => {
                if(fx.checked) this.list_sc.push(fx.roleId_sc)
              })
            });
            setTimeout(() => {
              this.$refs['addForm'].clearValidate()
            },0)
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },handleClose(formName){
        this.$refs[formName].clearValidate()
      }
    },
    watch:{
      userName(N,O){
        this.formInline.userName = N
      }
    },
    destroyed(){
      Bus.$off('addAccount');
      Bus.$off('getAccountList');
    }
  }
</script>

<style scoped>

</style>
