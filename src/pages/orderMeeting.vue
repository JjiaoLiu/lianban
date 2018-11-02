<template>
  <section>
    <BaseHeader :title="baseTitle" showbtn="showbtn"></BaseHeader>
    <el-form :inline="true" :model="formInline" class="filter-form" size="mini">
      <el-form-item label="所属空间" prop="spaceId_cs">
        <BaseSpaceRoomSelect :spaceId_sc.sync="formInline.spaceId_sc" all="all"/>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNo">
        <el-input v-model.trim="formInline.orderNo" placeholder="请输入订单编号"></el-input>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select v-model="formInline.orderStatus">
          <el-option label="全部" value=""></el-option>
          <el-option label="待支付" :value="2"></el-option>
          <el-option label="已支付" :value="1"></el-option>
          <el-option label="已取消" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0">
        <el-select v-model="formInline.timeType" style="width: 100px">
          <el-option label="下单时间" :value="1"></el-option>
          <el-option label="支付时间" :value="2"></el-option>
        </el-select>
        <BaseDatePickerGroup @onChangeDate="handleChangeDate"></BaseDatePickerGroup>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="total-box">
      <span>订单总数：<b>{{table.total}}</b>&nbsp;&nbsp;&nbsp;&nbsp;合计总数：{{table.orderAmount}}元</span>
    </div>
    <el-table
      stripe
      :data="table.list"
      :cell-class-name="tableCellClassName"
      :header-cell-class-name="tableHeaderClassName"
      style="width: 100%">
      <el-table-column
        prop="orderNo"
        label="订单编号"
        width="230">
      </el-table-column>
      <el-table-column
        prop="orderDate"
        label="下单日期"
        width="160">
      </el-table-column>
      <el-table-column
        prop="spaceName"
        label="签约空间"
        width="160">
      </el-table-column>
      <el-table-column
        label="企业联系人"
        prop="employeeName"
        width="140">
      </el-table-column>
      <el-table-column
        label="联系电话"
        prop="phoneNo"
        width="140">
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="签约企业"
        width="200">
      </el-table-column>
      <el-table-column
        label="订单状态"
        width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatus === 0" class="cancel">已取消</span>
          <span v-if="scope.row.orderStatus === 1" class="success">已支付</span>
          <span v-if="scope.row.orderStatus === 2" class="waiting">待支付</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)"><img src="./../assets/img/icon_edit.png"></el-button>
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
  import BaseSpaceRoomSelect from './../components/BaseSpaceRoomSelect'
  import BaseCitySelect from './../components/BaseCitySelect'
  import BaseDatePickerGroup from './../components/BaseDatePickerGroup'
  import {filterStr} from './../validator'

  export default {
    name:"orderMeeting",data(){
      return {
        orderAmount:"",formInline:{
          orderStatus:'',pageSize:15,page:1,timeType:1,spaceId_sc:''
        },title:'添加',   //角色修改
        baseTitle:'会议室订单',table:{},tableCellClassName:'tableCellClassName',tableHeaderClassName:'tableHeaderClassName',
      }
    },components:{
      BaseHeader,BaseCitySelect,BaseSpaceRoomSelect,BaseDatePickerGroup
    },created(){
      // 请求列表数据
      this.getDataList();
    },methods:{
      handleChangeDate(val){
        this.formInline[val[0]] = val[1];
      },edit(item){
        this.$router.push('/home/orderMeeting/deal?orderNo=' + item.orderNo)
      }, // 点击查询
      onSubmit(){
        this.formInline.page = 1;
        this.formInline.orderNo = filterStr(this.formInline.orderNo);
        this.getDataList()
      }, // 点击某一页
      handleCurrentChange(){
        this.getDataList();
      }, // 获取列表
      getDataList(){
        this.$axios.post(process.env.API_HOST[1] + '/mtroomorder/list',this.formInline).then(res => {
          if(res.data.success === true){
            this.table = res.data;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      }
    },
  }
</script>

<style scoped lang="scss">
  .success {
    color: #65a347;
  }

  .cancel {
    color: #88a3b9;
  }

  .waiting {
    color: #ff9000;
  }
</style>
