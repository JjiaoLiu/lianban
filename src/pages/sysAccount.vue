<template>
  <section>
    <BaseHeader :title="baseTitle" @emitHeaderButton="onHeaderButton">
      <el-input
        :placeholder="'请输入'+baseTitle+'关键字'"
        v-model="userName">
        <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="getAccountList"></i>
      </el-input>
    </BaseHeader>
    <TableAccount :enable="1" :userName="userName"></TableAccount>
    <div style="text-align: right;padding-right: 40px;margin-top: -45px">
      <el-button plain size="small" style="font-size: 16px" @click="showDeleteBox = true">
        <i class="el-icon el-icon-delete"></i>&nbsp;&nbsp;回收站
      </el-button>
    </div>
    <BaseMessageBox title="回收站" :show.sync="showDeleteBox">
      <TableAccount :enable="0"></TableAccount>
    </BaseMessageBox>
  </section>
</template>

<script>
  import BaseHeader from './../components/BaseHeader'
  import BaseMessageBox from './../components/BaseMessageBox'
  import TableAccount from './../components/TableAccount'
  import {Bus} from "../bus";

  export default {
    name:"sysAccount",data(){
      return {
        userName:"",baseTitle:'账号',showDeleteBox:false,
      }
    },components:{
      BaseHeader,BaseMessageBox,TableAccount
    },created(){
    },methods:{
      onHeaderButton(){ // 显示增加角色
        Bus.$emit('addAccount')
      },getAccountList(){
        Bus.$emit('getAccountList')
      },destroyed(){
        Bus.$off('addAccount');
        Bus.$off('getAccountList');
      }
    },
  }
</script>

<style scoped>

</style>
