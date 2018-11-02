<template>
  <section>
    <BaseHeader :title="baseTitle" @emitHeaderButton="onHeaderButton"></BaseHeader>
    <el-form :inline="true" :model="formInline" class="filter-form" size="mini">
      <el-form-item label="所在城市">
        <BaseCitySelect :cityCode.sync="formInline.cityCode" all="all"></BaseCitySelect>
      </el-form-item>
      <el-form-item label="活动名称">
        <el-input v-model.trim="formInline.title" placeholder="请输入活动名称" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="活动时间">
        <BaseDatePickerGroup @onChangeDate="handleChangeDate"></BaseDatePickerGroup>
      </el-form-item>
      <el-form-item label="活动状态">
        <!--1-报名中，2-进行中，3-已结束 ,-->
        <el-select v-model="formInline.status">
          <el-option label="全部" value=""></el-option>
          <el-option label="报名中" :value="1"></el-option>
          <el-option label="进行中" :value="2"></el-option>
          <el-option label="已结束" :value="3"></el-option>
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
        prop="title"
        label="活动名称"
        width="300">
      </el-table-column>
      <el-table-column
        label="所在城市"
        width="160">
        <template slot-scope="scope">
          {{scope.row.cityCode | codeFilter}}
        </template>
      </el-table-column>
      <el-table-column
        prop="applyOverTime"
        label="报名截止日期"
        width="220">
      </el-table-column>
      <el-table-column
        prop="stock"
        label="库存数"
        width="120">
      </el-table-column>
      <el-table-column
        label="状态"
        :formatter="formatterStatus"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="edit(scope.row)">
              <img src="../assets/img/icon_edit.png" height="16" width="14"/>
            </el-button>
          </div>
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
  import BaseDatePickerGroup from './../components/BaseDatePickerGroup'
  import BaseCitySelect from './../components/BaseCitySelect'

  export default {
    name:"operationAc",components:{
      BaseDatePickerGroup,BaseHeader,BaseCitySelect
    },data(){
      return {
        formInline:{
          cityCode:'',overTime:"",startTime:"",status:'',title:"",pageSize:15,page:1
        },title:'添加',   //角色修改
        baseTitle:'活动',table:{},tableCellClassName:'tableCellClassName',tableHeaderClassName:'tableHeaderClassName',
      }
    },created(){
      // 请求列表数据
      this.getDataList();
    },methods:{
      formatterStatus(v){
        // 报名中，2-进行中，3-已结束
        switch(v.status){
          case 1:
            return '报名中';
            break;
          case 2:
            return '进行中';
            break;
          case 3:
            return '已结束';
            break;
          default:
            break;
        }
      },handleChangeDate(val){
        this.formInline[val[0]] = val[1];
      },edit(item){
        this.$router.push('/home/operationAc/add?activityId_sc=' + item.activityId_sc)
      },// 点击查询
      onSubmit(){
        this.formInline.page = 1;
        this.getDataList()
      },// 点击 顶部添加
      onHeaderButton(){
        this.$router.push('/home/operationAc/add')
      },// 点击某一页
      handleCurrentChange(){
        this.getDataList();
      },// 获取列表
      getDataList(){
        this.$axios.post(process.env.API_HOST[1] + '/activity/list',this.formInline).then(res => {
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
