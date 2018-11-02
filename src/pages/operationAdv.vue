<template>
  <section>
    <BaseHeader :title="baseTitle" @emitHeaderButton="onHeaderButton">
      <el-input size="small" :placeholder="'请输入'+baseTitle+'关键字'" v-model="keyWord">
        <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="getAdvList"></i>
      </el-input>
    </BaseHeader>
    <TableAdv :keyWord="keyWord" :enable="1"></TableAdv>
    <div style="text-align: right;padding-right: 40px;margin-top: -45px">
      <el-button plain size="small" style="font-size: 16px" @click="showDeleteBox = true">
        <i class="el-icon el-icon-delete"></i>&nbsp;&nbsp;回收站
      </el-button>
    </div>
    <BaseMessageBox title="回收站" :show.sync="showDeleteBox">
      <TableAdv :enable="0"></TableAdv>
    </BaseMessageBox>
  </section>
</template>
<script>
  import {Bus} from "../bus";
  import BaseHeader from './../components/BaseHeader'
  import BaseUpload from './../components/BaseUpload'
  import BaseMessageBox from './../components/BaseMessageBox'
  import BaseSpaceRoomSelect from './../components/BaseSpaceRoomSelect'
  import TableAdv from './../components/TableAdv'

  export default {
    name:"operationAdv",data(){
      return {
        title:'添加',baseTitle:'广告位',keyWord:"", //  搜索框
        showDeleteBox:false,  // 显示回收站模态框
      }
    },components:{
      BaseHeader,BaseMessageBox,BaseUpload,TableAdv,BaseSpaceRoomSelect
    },methods:{
      onHeaderButton(){
        this.$router.push('/home/operationAdv/add')
      },getAdvList(){
        Bus.$emit('getAdvList')
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "./../assets/mixin/all";

  .inner-mask {
    width: 695px;
    right: 0;
    bottom: 0;
    top: 0;
    position: fixed;
    background: rgba(0, 0, 0, .5);
    z-index: 667;
    .inner-message {
      width: 490px;
      position: fixed;
      right: 0;
      bottom: 0;
      top: 0;
      padding: 15px 0;
      background: #ffffff;
      .title {
        text-align: right;
        padding-right: 20px;
      }
      .sec-title {
        font-size: 20px;
        padding: 20px;
      }
      .sec-main {
        border-bottom: 1px solid #beccd7;
        padding: 10px 20px 0 20px;
      }
    }
  }
</style>
