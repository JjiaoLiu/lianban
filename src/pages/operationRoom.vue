<template>
  <section>
    <BaseHeader :title="baseTitle" @emitHeaderButton="onHeaderButton"></BaseHeader>
    <el-form :inline="true" :model="formInline" class="filter-form" size="mini">
      <el-form-item label="所在城市">
        <BaseCitySelect :cityCode.sync="formInline.cityCode" all="all"/>
      </el-form-item>
      <el-form-item label="空间名称">
        <el-input v-model.trim="formInline.spaceName" placeholder="请输入空间名称"></el-input>
      </el-form-item>
      <el-form-item label="空间状态">
        <el-select v-model="formInline.enable">
          <el-option label="全部" value=""></el-option>
          <el-option label="有效" :value="1"></el-option>
          <el-option label="无效" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0">
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
        label="创建时间"
        width="155">
      </el-table-column>
      <el-table-column
        prop="spaceCode"
        label="空间编号"
        width="230">
      </el-table-column>
      <el-table-column
        prop="spaceName"
        label="空间名称"
        width="200">
      </el-table-column>
      <el-table-column
        label="所在城市"
        width="140">
        <template slot-scope="scope">
          {{scope.row.cityCode | codeFilter}}
        </template>
      </el-table-column>
      <el-table-column
        label="所在区县"
        width="120">
        <template slot-scope="scope">
          {{scope.row.districtCode | codeFilter}}
        </template>
      </el-table-column>
      <el-table-column
        prop="dutyUserName"
        label="负责人"
        width="100">
      </el-table-column>
      <el-table-column
        label="状态"
        width="100">
        <template slot-scope="scope">
          {{scope.row.enable === 1 ?'有效':'无效'}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">
            <img src="../assets/img/icon_edit.png" height="16" width="14"/>
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
  </section>
</template>

<script>
  import BaseHeader from './../components/BaseHeader'
  import BaseCitySelect from './../components/BaseCitySelect'
  import {filterStr} from "../validator";

  export default {
    name:"operationRoom",data(){
      return {
        formInline:{
          spaceName:'',enable:'',page:1,pageSize:15,cityCode:''
        },title:'添加',baseTitle:'空间',table:{},tableCellClassName:'tableCellClassName',tableHeaderClassName:'tableHeaderClassName',
      }
    },components:{
      BaseHeader,BaseCitySelect
    },created(){
      this.getDataList();
    },methods:{
      edit(item){
        this.$router.push('/home/operationRoom/add?spaceId_sc=' + item.spaceId_sc)
      },// 点击查询
      onSubmit(){
        this.formInline.page = 1;
        this.getDataList()
      },// 点击 顶部添加
      onHeaderButton(){
        this.$router.push('/home/operationRoom/add')
      },// 点击某一页
      handleCurrentChange(){
        this.getDataList();
      },// 获取列表
      getDataList(){
        this.formInline.spaceName = filterStr(this.formInline.spaceName);
        this.$axios.post(process.env.API_HOST[1] + '/space/list',this.formInline).then(res => {
          if(res.data.success === true){
            this.table = res.data;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">

</style>
