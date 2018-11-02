<template>
  <section>
    <BaseHeader :title="baseTitle" @emitHeaderButton="onHeaderButton" otherTitle="根节点"></BaseHeader>
    <div class="menu">
      <div v-for="(list_sc,index) in menuList" :index="index">
        <ul>
          <li>
            <div class="parent-menu">
              <span><img :src="list_sc.pictureUrl" width="22" height="22" class="parent-img">{{list_sc.menuName}}</span>
              <p class="action">
                <img src="../assets/img/icon_edit.png" height="16" width="14" @click="edit(list_sc)"/>&nbsp;
                <img src="../assets/img/icon_circle_add.png" height="21" @click="addChild(list_sc)" width="20"/>&nbsp;
                <img src="../assets/img/icon_circle_delete.png" height="20" width="20" @click="deleteS(list_sc)"/>&nbsp;
              </p>
            </div>
            <div v-for="(childs_sc,index) in list_sc.childs_sc" :index="index" class="child-menu">
              {{childs_sc.menuName}}
              <p class="action">
                <img src="../assets/img/icon_edit.png" height="16" width="14" @click="edit(childs_sc)"/>&nbsp;
                <!--<img src="../assets/img/icon_circle_add.png" height="21" @click="addChild(list_sc)" width="20"/>&nbsp;-->
                <img src="../assets/img/icon_circle_delete.png" height="20" width="20" @click="deleteS(childs_sc)"/>&nbsp;
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <BaseMessageBox :title="baseTitle+title" :show.sync="showEditBox" :noMask="noMask" @before-close="handleClose('addForm')">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="80px" label-position="left" size="small">
        <el-form-item label="父级菜单" prop="parentCode" style="display: none">
          <el-input readonly v-model.trim="addForm.parentCode" style="width: 560px" placeholder="根目录"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单" prop="parentName">
          <el-input readonly v-model.trim="addForm.parentName" style="width: 560px" placeholder="根目录"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model.trim="addForm.menuName" placeholder="请输入菜单名称" style="width: 560px"></el-input>
        </el-form-item>
        <el-form-item label="菜单链接" prop="dataUrl">
          <el-input v-model.trim="addForm.dataUrl" placeholder="请输入菜单链接" style="width: 560px"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="pictureUrl">
          <BaseUpload :pictureUrl.sync="addForm.pictureUrl" fileType="image/jpg;image/bmp,image/png,image/jpeg"></BaseUpload>
        </el-form-item>
        <el-form-item label="打开方式" prop="openWay">
          <el-radio v-model="addForm.openWay" :label="1">新窗口</el-radio>
          <el-radio v-model="addForm.openWay" :label="0">本窗口</el-radio>
        </el-form-item>
        <el-form-item prop="list_sc" label="访问权限">
          <BaseDepartmentTab :list_sc.sync="list_sc"/>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="primary" style="font-size: 20px;width: 140px" @click="submitForm('addForm')">{{title}}</el-button>
        </el-form-item>
      </el-form>
    </BaseMessageBox>
  </section>
</template>

<script>
  import BaseHeader from './../components/BaseHeader'
  import BaseUpload from './../components/BaseUpload'
  import BaseMessageBox from './../components/BaseMessageBox'
  import BaseDepartmentTab from './../components/BaseDepartmentTab'

  export default {
    name:"sysNav",data(){
      return {
        activeTab:'全部',noMask:false,menuList:[],title:'添加',baseTitle:'导航',showEditBox:false,addForm:{openWay:0},rules:{
          menuName:[{required:true,message:'×请输入菜单名',trigger:'blur'},],dataUrl:[{required:true,message:'×请输入菜单链接',trigger:'blur'},]
        },dept_list_tab:[],  // 所有部门--角色选择
        list_sc:[], // 剥离出当前权限
        post_list:[],  //  岗位
      }
    },components:{
      BaseHeader,BaseMessageBox,BaseUpload,BaseDepartmentTab
    },created(){
      this.getMenuList();
    },methods:{
      edit(item){
        this.title = '修改';
        this.list_sc = [];
        this.$axios.get(process.env.API_HOST[0] + '/menu/detail',{
          params:{menuId_sc:item.menuId_sc}
        }).then(res => {
          if(res.data.success === true){
            this.addForm = res.data;
            this.showEditBox = true;
            // 剥离出所有权限id
            this.addForm.list_sc.forEach((f,i,fs) => {
              f.roleList_sc.forEach((fx,ix,fsx) => {
                if(fx.checked){
                  this.list_sc.push(fx.roleId_sc)
                }
              })
            });
            setTimeout(() => {
              this.$refs['addForm'].clearValidate()
            },0)
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },addChild(item){
        this.title = '添加';
        this.showEditBox = true;
        this.addForm = {
          parentCode:item.menuCode,parentName:item.menuName,openWay:0
        };
        this.list_sc = [];
      },deleteS(item){
        this.$confirm(`您的确认要将${this.baseTitle}${item.menuName}删除吗`,'提示',{
          confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
        }).then(() => {
          this.$axios.get(process.env.API_HOST[0] + '/menu/delMenu',{
            params:{menuId:item.menuId_sc,enable:0}
          }).then(res => {
            if(res.data.success === true){
              this.getMenuList();
              this.$message.success(`删除成功!`);
            }else{
              this.$message.warning(res.data.msg)
            }
          })
        }).catch(() => {
          this.$message.info('已取消操作')
        });
      },onHeaderButton(){ // 显示增加
        this.title = '添加';
        this.showEditBox = true;
        this.addForm = {
          openWay:0
        }
      },getMenuList(){
        this.$axios.get(process.env.API_HOST[0] + '/menu/list',{
          params:{enable:1}
        }).then((res => {
          if(res.data.success === true){
            this.menuList = res.data.list_sc
          }else{
            this.$message.warning(res.data.msg)
          }
        }))
      }, // 提交表单
      saveMenu(formName){
        this.$set(this.addForm,'roleIds_sc',this.list_sc);
        this.$axios.post(process.env.API_HOST[0] + '/menu/saveMenu',this.addForm).then(res => {
          if(res.data.success === true){
            this.$refs[formName].clearValidate();
            setTimeout(() => {
              this.$message.success(this.title + '成功');
              this.showEditBox = false;
              this.getMenuList();
            },0);
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },submitForm(formName){ // 添加权限
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$confirm(`你确认${this.title}此${this.baseTitle}吗`,'提示',{
              confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
            }).then(() => {
              this.saveMenu(formName);
            }).catch(() => {
              this.$message.info('已取消操作')
            });
          }else{
            return false
          }
        });
      }, //获取所有岗位
      getPostlist(){
        this.$axios.get(process.env.API_HOST[0] + '/dept/postList').then(res => {
          if(res.data.success === true){
            this.post_list = res.data.list;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },handleClose(formName){
        this.$refs[formName].clearValidate()
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "./../assets/mixin/all";

  .menu {
    font-size: 16px;
    width: 400px;
    overflow: hidden;
    line-height: 50px;
    margin: 30px 40px;
    border: 1px solid #beccd7;
    border-radius: 4px;
    .parent-menu {
      @include use-flex(center, space-between);
      width: 400px;
      height: 50px;
      background: #2d3d4e;
      color: #ffffff;
      padding: 0 15px;
      font-weight: bold;
      border-top: 1px solid #beccd7;
      .parent-img {
        vertical-align: middle;
        margin-top: -3px;
        margin-right: 20px;
      }
    }
    .child-menu {
      @include use-flex(center, space-between);
      border-top: 1px solid #beccd7;
      padding-left: 88px;
      padding-right: 15px;
      width: 400px;
      height: 50px;
    }
    .action img {
      cursor: pointer;
      vertical-align: middle;
    }
    div:first-child .parent-menu {
      border-top-width: 0;
    }
  }
</style>
