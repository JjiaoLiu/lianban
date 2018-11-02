<template>
  <div class="section">
    <el-tabs v-model="deptId" class="tab">
      <el-tab-pane label="全部" name=""></el-tab-pane>
      <el-tab-pane v-for="(item,index) in tabHeader" :label="item.departmentValue" :name="''+item.id_sc" :key="index"></el-tab-pane>
    </el-tabs>
    <el-table
      stripe :data="table.list_sc" :cell-class-name="tableCellClassName" :header-cell-class-name="tableHeaderClassName"
      style="width: 100%">
      <el-table-column prop="roleName" label="角色名称" width="155"></el-table-column>
      <el-table-column prop="roleKey" label="角色编号" width="230"></el-table-column>
      <el-table-column prop="roleDescribe" label="角色描述" width="500"></el-table-column>
      <el-table-column align="center" label="操作">
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
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="formInline.page" :page-size="formInline.pageSize"
                     layout="prev, pager, next" :total="table.total">
      </el-pagination>
    </div>
    <BaseMessageBox :title="baseTitle+title" :show.sync="showEditBox" @before-close="handleClose('addForm')">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="80px" label-position="left" size="small" style="width: 560px">
        <el-form-item label="名称" prop="roleName">
          <el-input v-model.trim="addForm.roleName" placeholder="请输入角色的名称，例如：产品经理" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="缩写" prop="roleKey">
          <el-input v-model.trim="addForm.roleKey" placeholder="请输入角色的编号，例如：PM" style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="departmentId_sc">
          <BaseDepartmentSelect :departmentId_sc.sync="addForm.departmentId_sc" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="描述" prop="roleDescribe">
          <el-input type="textarea" v-model.trim="addForm.roleDescribe" placeholder="请输入角色描述信息，限制字数长度200字"
                    style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="权限分配">
          <el-button plain v-for="(item,index) in addForm.list_sc" :key="index" @click="setSc(item)">
            {{item.groupName}}({{item.pages_sc.length}})
          </el-button>
        </el-form-item>
        <div align="" style="margin-top: 300px;text-align: center">
          <el-button type="primary" style="font-size: 20px;width: 140px" @click="submitForm('addForm')">{{title}}</el-button>
        </div>
      </el-form>
      <div class="inner-mask" slot="inner-message" v-if="list_sc_show">
        <div class="inner-message">
          <div class="title">
            <img src="../assets/img/icon_close.png" height="18" style="cursor: pointer" width="18" @click="list_sc_show = false"/>
          </div>
          <div v-for="(pages_sc,index) in list_sc.pages_sc" :key="index">
            <div class="sec-title">{{pages_sc.pageName}}</div>
            <div class="sec-main">
              <el-checkbox-group v-model="list_permId_sc" class="check-group">
                <el-checkbox v-for="perms_sc in pages_sc.perms_sc" border :key="perms_sc.permId_sc" :label="perms_sc.permId_sc"
                             name="permId_sc">
                  {{perms_sc.permName}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div style="text-align: center;padding-top: 17px;border-top: 1px solid #beccd7;">
            <el-button type="primary" style="font-size: 20px;width: 140px" @click="changelist_sc">{{title}}</el-button>
          </div>
        </div>
      </div>
    </BaseMessageBox>
  </div>
</template>

<script>
  import {Bus} from "../bus";
  import BaseMessageBox from './../components/BaseMessageBox'
  import BaseDepartmentSelect from './../components/BaseDepartmentSelect'

  export default {
    name:"TableRole",props:['enable','roleName'],components:{BaseMessageBox,BaseDepartmentSelect},data(){
      return {
        deptId:'',
        formInline:{pageSize:15,page:1,roleName:'',deptId_sc:'',enable:this.enable},
        tableCellClassName:'tableCellClassName',
        tableHeaderClassName:'tableHeaderClassName',
        tabHeader:[],
        table:{},
        title:'添加',   //角色修改
        baseTitle:'角色',
        showEditBox:false,
        list_sc_show:false, //  list_sc_show  显示权限选择 -----------模态框
        list_permId_sc:[],  // 剥离出所有checked=true的权限id
        list_sc:{},          // 当前选中 权限
        addForm:{list_sc:[]},
        rules:{
          roleName:[{required:true,message:'×请输入角色的名称',trigger:'blur'},],
          roleKey:[{required:true,message:'×请输入角色的编号',trigger:'blur'},],
          departmentId_sc:[{required:true,message:'×请选择角色的部门',trigger:'change'}],
          roleDescribe:[{required:true,message:'×请输入角色描述信息',trigger:'blur'},{min:1,max:200,message:'长度在 1 到 200 个字符',trigger:'blur'}]
        },
      }
    },created(){
      this.getDept();
      this.getDataList();
      if(this.enable){
        Bus.$on('addRole',() => {
          this.addForm = {list_sc:[]};
          this.title = '添加';
          this.showEditBox = true;
        });
        Bus.$on('getRoleList',() => {
          this.formInline.page = 1;
          this.getDataList();
        })
      }
    },methods:{
      handleCurrentChange(val){
        this.getDataList()
      },getDept(role){//获取所有有效的部门数据  // true  不分角色查询  false  分角色查询
        this.$axios.get(process.env.API_HOST[0] + '/dept/list',{
          params:{role:role}
        }).then(res => {
          if(res.data.success === true){
            this.tabHeader = res.data.list_sc;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },getDataList(){
        this.$axios.get(process.env.API_HOST[0] + '/role/list',{
          params:this.formInline
        }).then(res => {
          if(res.data.success === true){
            this.table = res.data;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },toenable(row,enable){
        let type = enable === 0 ? '删除' : '还原';
        let string = enable === 0 ? `您的确认要将${this.baseTitle}${row.roleName}删除并放入回收站吗` : `您的确认要将${this.baseTitle}${row.roleName}还原吗`;
        this.$confirm(string,'提示',{
          confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
        }).then(() => {
          this.$axios.get(process.env.API_HOST[0] + '/role/enable',{
            params:{
              roleId_sc:row.roleId_sc,enable:enable
            }
          }).then(res => {
            if(res.data.success === true){
              this.getDataList();
              this.$message.success(`${type}成功!`);
            }
          })
        }).catch(() => {
          this.$message.info('已取消操作');
        });
      },edit(row){
        this.title = '修改';
        this.$axios.get(process.env.API_HOST[0] + '/role/detail',{
          params:{roleId_sc:row.roleId_sc}
        }).then(res => {
          if(res.data.success === true){
            this.addForm = res.data;
            this.showEditBox = true;
            // 剥离出所有权限id
            this.addForm.list_sc.forEach((f,i,fs) => {
              f.pages_sc.forEach((fx,ix,fsx) => {
                fx.perms_sc.forEach((fxx,ixx,fsxx) => {
                  if(fxx.checked) this.list_permId_sc.push(fxx.permId_sc)
                })
              })
            });
            setTimeout(() => {
              this.$refs['addForm'].clearValidate()
            },0)
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      }, // 删除 恢复 角色  1-恢复，0-删除
      changelist_sc(){
        this.addForm.permIds_sc = this.list_permId_sc;
        this.list_sc_show = false;
      },setSc(item){  // 展示当前选中的  权限  选项
        this.list_sc = Object.assign({},item);
        this.list_sc_show = true;
      },handleTableChange(){
        this.getDataList();
      },submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$confirm(`你确认${this.title}此${this.baseTitle}吗`,'提示',{
              confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
            }).then(() => {
              this.$axios.post(process.env.API_HOST[0] + '/role/save',this.addForm).then(res => {
                if(res.data.success === true){
                  this.$refs[formName].clearValidate();
                  setTimeout(() => {
                    this.$message.success(this.title + "成功");
                    this.showEditBox = false;
                    this.getDataList();
                  },0)
                }else{
                  this.$message.warning(res.data.msg);
                }
              })
            }).catch(() => {
              this.$message.info('已取消操作');
            });
          }else{
            return false
          }
        });
      },handleClose(formName){
        this.$refs[formName].clearValidate();
      }
    },watch:{
      roleName(N,O){
        this.formInline.roleName = N;
      },deptId(N,O){
        N === '0' ? this.formInline.deptId_sc = '' : this.formInline.deptId_sc = N;
        this.formInline.page = 1;
        this.getDataList()
      }
    },destroyed(){
      Bus.$off('addRole');
      Bus.$off('getRoleList');
    }
  }
</script>

<style scoped lang="scss">
  @import "./../assets/mixin/all";

  .check-group {
    margin-bottom: 10px;
  }

  .inner-mask {
    @include inner-mask(490px)
  }
</style>
