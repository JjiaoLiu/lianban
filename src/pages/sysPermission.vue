<template>
  <section>
    <BaseHeader :title="baseTitle" @emitHeaderButton="onHeaderButton">
      <el-input size="small" :placeholder="'请输入'+baseTitle+'关键字'" v-model="pageName">
        <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="getPermissionList" @keyup.enter="getPermissionList"></i>
      </el-input>
    </BaseHeader>
    <TablePermission :enable="1" :pageName="pageName"></TablePermission>
    <div style="padding-right: 40px;margin-top: 45px;text-align: right">
      <el-button plain size="small" style="font-size: 16px" @click="showDeleteBox = true">
        <i class="el-icon el-icon-delete"></i>&nbsp;&nbsp;回收站
      </el-button>
    </div>
    <BaseMessageBox title="回收站" :show.sync="showDeleteBox">
      <TablePermission :enable="0"></TablePermission>
    </BaseMessageBox>
  </section>
</template>

<script>
  import {Bus} from "../bus";
  import BaseHeader from './../components/BaseHeader'
  import BaseMessageBox from './../components/BaseMessageBox'
  import TablePermission from './../components/TablePermission'

  export default {
    name:"sysAccount",data(){
      return {
        pageName:'',title:'添加',baseTitle:'权限',showDeleteBox:false,
      }
    },components:{
      BaseHeader,BaseMessageBox,TablePermission
    },created(){},methods:{
      onHeaderButton(){Bus.$emit('addPermission')},getPermissionList(){Bus.$emit('getPermissionList')},destroyed(){
      Bus.$off('addPermission');
      Bus.$off('getPermissionList');
    }
    },
  }
</script>

<style scoped>

</style>
