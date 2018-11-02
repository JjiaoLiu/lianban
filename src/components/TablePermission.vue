<template>
  <div class="section">
    <el-table
      stripe
      :data="table.list_sc"
      :cell-class-name="tableCellClassName"
      :header-cell-class-name="tableHeaderClassName"
      style="width: 100%">
      <el-table-column
        prop="pageName"
        label="权限名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="pageUrl"
        label="权限路径"
        width="400">
      </el-table-column>
      <el-table-column
        prop="pageDescribe"
        width="450"
        label="权限描述">
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
        @current-change="handleCurrentChange" :current-page.sync="formInline.pageIndex" :page-size="formInline.pageSize"
        layout="prev, pager, next" :total="table.total">
      </el-pagination>
    </div>
    <BaseMessageBox :title="'权限'+title" :show.sync="showEditBox" @before-close="handleClose('addForm')">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="80px" label-position="left" size="small">
        <el-form-item label="权限名称" prop="pageName">
          <el-input v-model.trim="addForm.pageName" placeholder="请输入权限名称" style="width: 100%" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="权限URL" prop="pageUrl">
          <el-input v-model.trim="addForm.pageUrl" placeholder="请输入权限URL"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限分组" prop="groupId_sc">
          <el-select v-model="addForm.groupId_sc" placeholder="请选择权限分组" style="width: 100%">
            <el-option
              v-for="item in group_list"
              :key="item.groupId_sc"
              :label="item.groupName"
              :value="item.groupId_sc">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限描述" prop="pageDescribe">
          <el-input type="textarea" v-model.trim="addForm.pageDescribe" placeholder="请输入权限描述信息，限制字数长度200字" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="权限分配">
          <div class="qx">
            <div @click="addQx" class="qx-add">
              <img src="../assets/img/icon_add_blue.png" height="20" width="20"/></div>
            <div class="qx-select">
              <div class="qx-edit" v-for="(perms_sc,index) in addForm.perms_sc" :key="index" v-if="!perms_sc.delFlag">
                {{perms_sc.permName}}&nbsp;&nbsp;
                <img @click="editQx(perms_sc,index)" src="../assets/img/icon_edit.png"/>&nbsp;&nbsp;&nbsp;
                <img @click="deleteQx(perms_sc)" src="../assets/img/icon_circle_delete.png"/>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item align="center" style="margin-top: 300px">
          <el-button type="primary" style="font-size: 20px;width: 140px" @click="submitForm('addForm')">{{title}}</el-button>
        </el-form-item>
      </el-form>
      <div class="inner-mask" slot="inner-message" v-if="show_single_perms_sc">
        <div class="inner-message">
          <div class="title">
            <img src="../assets/img/icon_close.png" height="18" style="cursor: pointer" width="18"
                 @click="show_single_perms_sc = false"/>
          </div>
          <div class="sec-main">
            <el-form label-width="80px" label-position="left" ref="single_perms_sc" :model="single_perms_sc" size="small">
              <el-form-item label="权限名称" prop="permName" :rules="{required: true, message: '×权限名称不能为空', trigger: 'blur'}">
                <el-input v-model.trim="single_perms_sc.permName" placeholder="请输入权限名称" style="width: 360px"></el-input>
              </el-form-item>
              <el-form-item label="权限编号" prop="permKey" :rules="{required: true, message: '×权限编号不能为空', trigger: 'blur'}">
                <el-input readonly="readonly" v-model.trim="single_perms_sc.permKey" placeholder="请输入权限编号" style="width: 100%">
                  <span style="cursor: pointer" slot="append" @click="getPerDesc">生成编号</span>
                </el-input>
              </el-form-item>
              <el-form-item label="权限描述" prop="permDesc" :rules="{required: true, message: '×权限描述不能为空', trigger: 'blur'}">
                <el-input type="textarea" v-model.trim="single_perms_sc.permDesc" placeholder="请输入权限描述信息，限制字数长度200字" style="width: 360px"></el-input>
              </el-form-item>
              <el-form-item align="center" style="margin-top: 300px">
                <el-button type="primary" style="font-size: 20px;width: 140px" @click="submitFormSingle_perms_sc('single_perms_sc')">{{innerTitle}}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </BaseMessageBox>
  </div>
</template>

<script>
  import {Bus} from "../bus";
  import BaseMessageBox from './../components/BaseMessageBox'

  export default {
    name:"TablePermission",props:['enable','pageName'],components:{BaseMessageBox},data(){
      return {
        tableCellClassName:'tableCellClassName',
        tableHeaderClassName:'tableHeaderClassName',
        formInline:{pageSize:15,pageIndex:1,pageName:'',enable:this.enable},
        title:'添加',
        table:{},
        baseTitle:'权限',
        innerTitle:'添加',
        showEditBox:false,
        addForm:{perms_sc:[]},
        rules:{
          pageName:[{required:true,message:'×请输入权限名称',trigger:'blur'},],
          pageUrl:[{required:true,message:'×请输入权限URL',trigger:'blur'},],
          pageDescribe:[{required:true,message:'×请输入权限描述',trigger:'blur'},],
          groupId_sc:[{required:true,message:'×请选择权限分组',trigger:'change'},],
        },
        group_list:[],
        index:'',
        show_single_perms_sc:false,
        single_perms_sc:{},
      }
    },created(){
      this.getDataList();
      this.getGroupList();
      if(this.enable){
        Bus.$on('addPermission',() => {
          this.title = '添加';
          this.addForm = {perms_sc:[]};
          this.showEditBox = true;
        });
        Bus.$on('getPermissionList',() => {
          this.formInline.page = 1;
          this.getDataList();
        })
      }
    },methods:{
      handleTabClick(tab,event){
        this.formInline.page = 1;
        this.getDataList()
      },handleCurrentChange(){
        this.getDataList()
      },getDataList(){
        this.$axios.get(process.env.API_HOST[0] + '/page/pagelist',{
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
        let string = enable === 0 ? `您的确认要将${this.baseTitle}${row.pageName}删除并放入回收站吗` : `您的确认要将${this.baseTitle}${row.pageName}还原吗`;
        this.$confirm(string,'提示',{
          confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
        }).then(() => {
          this.$axios.get(process.env.API_HOST[0] + '/page/enablepage',{
            params:{pageId_sc:row.pageId_sc,enable:enable}
          }).then(res => {
            if(res.data.success === true){
              this.getDataList();
              this.$message.success(`${type}成功!`);
            }else{
              this.$message.warning(res.data.msg)
            }
          })
        }).catch(() => {
          this.$message.info('已取消操作');
        });
      },getGroupList(){// 部门
        this.$axios.get(process.env.API_HOST[0] + '/group/list').then(res => {
          if(res.data.success === true){
            this.group_list = res.data.list_sc;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },getPerDesc(){
        var str = "",range = 21,
          arr = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        for(var i = 0; i < range; i++){
          var pos = Math.round(Math.random() * (arr.length - 1));
          str += arr[pos];
        }
        this.$set(this.single_perms_sc,'permKey',str);
      },edit(row){
        this.title = '修改';
        this.getDataDetail(row.pageId_sc)
      },getDataDetail(pageId_sc){
        this.$axios.get(process.env.API_HOST[0] + '/page/detail',{
          params:{pageId_sc:pageId_sc}
        }).then(res => {
          if(res.data.success === true){
            this.addForm = res.data;
            this.showEditBox = true;
            setTimeout(() => {
              this.$refs['addForm'].clearValidate();
            },0)
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },editQx(item,index){
        this.single_perms_sc = Object.assign({},item);
        this.index = index;
        this.innerTitle = '修改';
        this.show_single_perms_sc = true;
      },submitFormSingle_perms_sc(formName){ // 添加权限
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$confirm(`你确认${this.innerTitle}此${this.baseTitle}吗`,'提示',{
              confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
            }).then(() => {
              if(this.innerTitle === '添加'){
                this.addForm.perms_sc.push(this.single_perms_sc)
              }else if(this.innerTitle === '修改'){
                this.addForm.perms_sc.splice(this.index,1,this.single_perms_sc);
              }
              this.show_single_perms_sc = false;
            }).catch(() => {
              this.$message.info('已取消操作');
              this.show_single_perms_sc = false;
            });
          }else{
            return false;
          }
        });
      },submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$confirm(`你确认${this.title}此${this.baseTitle}吗`,'提示',{
              confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
            }).then(() => {
              if(this.title === '添加'){
                this.$axios.post(process.env.API_HOST[0] + '/page/addpage',this.addForm).then(res => {
                  if(res.data.success === true){
                    this.$refs[formName].clearValidate();
                    setTimeout(()=>{
                      this.showEditBox = false;
                      this.$message.success(`${this.title}成功`);
                      this.getDataList();
                    },0);
                  }else{
                    this.$message.warning(res.data.msg)
                  }
                });
              }else{
                this.$axios.post(process.env.API_HOST[0] + '/page/editpage',this.addForm).then(res => {
                  if(res.data.success === true){
                    this.showEditBox = false;
                    this.$message.success(`${this.title}成功`);
                    this.getDataList();
                  }else{
                    this.$message.warning(res.data.msg)
                  }
                });
              }
            }).catch(() => {
              this.$message.info('已取消操作');
            });
          }else{
            return false
          }
        })
      },addQx(){
        this.single_perms_sc = {};
        this.innerTitle = '添加';
        this.show_single_perms_sc = true;
      },deleteQx(perms_sc){
        this.$confirm('你确认删除吗?','提示',{
          confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
        }).then(() => {
          this.$set(perms_sc,'delFlag',1);
          this.$message.success('删除成功');
        }).catch(() => {
          this.$message.info('已取消操作');
        });
      },handleClose(formName){
        this.$refs[formName].clearValidate();
      }
    },watch:{
      pageName(N,O){
        this.formInline.pageName = N;
      }
    },destroyed(){
      Bus.$off('addPermission');
      Bus.$off('getPermissionList');
    }
  }
</script>

<style scoped lang="scss">
  @import "./../assets/mixin/all";

  .qx {
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    text-align: center;
    line-height: 34px;
    min-height: 54px;
    padding: 10px;
    width: 100%;
    img {
      vertical-align: middle;
      margin-top: -2px;
      cursor: pointer;
    }
    &-add {
      width: 70px;
      border-radius: 4px;
      height: 34px;
      border: 1px solid #e6e6e6;
      float: left;
      cursor: pointer;
    }
    &-select {
      width: 560px;
      text-align: left;
    }
    &-edit {
      height: 34px;
      border-radius: 4px;
      border: 1px solid #e6e6e6;
      display: inline-block;
      padding: 0 7px;
      margin-left: 10px;
      margin-bottom: 10px;
    }
  }

  .inner-mask {
    @include inner-mask(490px)
  }
</style>
