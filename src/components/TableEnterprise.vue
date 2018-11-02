<template>
  <div>
    <el-form :inline="true" :model="formInline" class="filter-form" size="mini">
      <el-form-item label="所属空间">
        <BaseSpaceRoomSelect :spaceId_sc.sync="formInline.spaceId_sc" all="all"/>
      </el-form-item>
      <el-form-item label="企业名称">
        <el-input v-model.trim="formInline.companyFullName" placeholder="请输入企业名称"></el-input>
      </el-form-item>
      <el-form-item label="注册时间">
        <BaseDatePickerGroup @onChangeDate="handleChangeDate" startFirst="startFirst" typeStart="createTimeStart"
                             typeEnd="createTimeEnd"></BaseDatePickerGroup>
      </el-form-item>
      <el-form-item label="企业状态">
        <el-select v-model="formInline.status">
          <el-option label="全部" value=""></el-option>
          <el-option label="未入住" :value="2"></el-option>
          <el-option label="已入住" :value="1"></el-option>
          <el-option label="退出" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="enable">
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="total-box">
      <span>{{baseTitle}}总数：<b>{{table.total}}</b></span>
    </div>
    <el-table
      stripe
      :data="table.list_sc"
      :cell-class-name="tableCellClassName"
      :header-cell-class-name="tableHeaderClassName"
      style="width: 100%">
      <el-table-column
        prop="createTime"
        label="注册时间"
        width="160">
      </el-table-column>
      <el-table-column
        prop="companyFullName"
        label="企业名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="contactsName"
        label="联系人"
        width="120">
      </el-table-column>
      <el-table-column
        prop="contactsTel"
        label="联系人电话"
        width="160">
      </el-table-column>
      <el-table-column
        prop="professionName"
        label="所属行业"
        width="160">
      </el-table-column>
      <el-table-column
        label="状态"
        :formatter="formatterStatus"
        width="100">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <slot :scope="scope"></slot>
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
  </div>
</template>

<script>
  import BaseDatePickerGroup from './../components/BaseDatePickerGroup'
  import BaseSpaceRoomSelect from './../components/BaseSpaceRoomSelect'

  export default {
    name:"TableEnterprise",components:{
      BaseDatePickerGroup,BaseSpaceRoomSelect
    },created(){
      this.getDataList();
    },data(){
      return {
        formInline:{
          status:'',page:1,pageSize:15,spaceId_sc:''
        },baseTitle:'企业',tableCellClassName:'tableCellClassName',tableHeaderClassName:'tableHeaderClassName',table:{}
      }
    },methods:{
      // 点击查询
      onSubmit(){
        this.formInline.page = 1;
        this.getDataList()
      },// 点击某一页
      handleCurrentChange(){
        this.getDataList();
      },handleChangeDate(val){
        this.formInline[val[0]] = val[1];
      },// 获取列表
      getDataList(){
        this.$axios.get(process.env.API_HOST[1] + '/company/list',{
          params:this.formInline
        }).then(res => {
          if(res.data.success === true){
            this.table = res.data;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },formatterStatus(v){
        // 0退出,1-已入住，2-未入住
        switch(v.status){
          case 0:
            return '退出';
            break;
          case 1:
            return '已入住';
            break;
          case 2:
            return '未入住';
            break;
          default:
            break
        }
      }
    }
  }
</script>

<style scoped>

</style>
