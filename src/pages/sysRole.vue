<template>
  <section>
    <BaseHeader :title="baseTitle" @emitHeaderButton="onHeaderButton">
      <el-input size="small" :placeholder="'请输入'+baseTitle+'关键字'" v-model="roleName">
        <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="getRoleList"></i>
      </el-input>
    </BaseHeader>
    <TableRole :enable="1" :roleName="roleName"></TableRole>
    <div style="padding-right: 40px;margin-top: -45px;text-align: right">
      <el-button plain size="small" style="font-size: 16px" @click="showDeleteBox = true">
        <i class="el-icon el-icon-delete"></i>&nbsp;&nbsp;回收站
      </el-button>
    </div>
    <BaseMessageBox title="回收站" :show.sync="showDeleteBox" style="width: 990px;">
      <TableRole :enable="0"></TableRole>
    </BaseMessageBox>
  </section>
</template>

<script>
  import {Bus} from "../bus";
  import BaseHeader from './../components/BaseHeader'
  import BaseMessageBox from './../components/BaseMessageBox'
  import TableRole from './../components/TableRole'

  export default {
    name:"sysRole",data(){
      return {
        roleName:'',title:'添加',   //角色修改
        baseTitle:'角色',    // 显示编辑模态框
        showDeleteBox:false,  // 显示回收站模态框
      }
    },components:{
      BaseHeader,BaseMessageBox,TableRole
    },created(){},methods:{
      onHeaderButton(){Bus.$emit('addRole')},getRoleList(){Bus.$emit('getRoleList')}
    },destroyed(){
      Bus.$off('addRole');
      Bus.$off('getRoleList');
    }
  }
</script>

<style scoped>

</style>
