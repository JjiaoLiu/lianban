<template>
  <section>
    <BaseHeader :title="baseTitle" showbtn="showbtn"></BaseHeader>
    <el-form :inline="true" :model="formInline" class="filter-form" size="mini">
      <el-form-item label="所属空间">
        <BaseSpaceRoomSelect :spaceId_sc.sync="formInline.spaceId_sc" all="all"/>
      </el-form-item>
      <el-form-item label="订单编号">
        <el-input v-model.trim="formInline.orderNo" placeholder="请输入设备编号"></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <el-select v-model="formInline.timeType" style="width: 100px">
          <el-option label="下单时间" :value="1"></el-option>
          <el-option label="支付时间" :value="2"></el-option>
        </el-select>
        <BaseDatePickerGroup @onChangeDate="handleChangeDate"></BaseDatePickerGroup>
      </el-form-item>
      <el-form-item label="支付来源">
        <el-select v-model="formInline.payType">
          <el-option label="全部来源" value=""></el-option>
          <el-option label="支付宝支付" :value="1"></el-option>
          <el-option label="微信支付" :value="2"></el-option>
          <el-option label="银行卡" :value="3"></el-option>
          <el-option label="信用卡" :value="4"></el-option>
          <el-option label="线下支付" :value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="total-box">
      <span>{{baseTitle}}总数：<b>{{table.total}}</b></span>
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
        width="240">
      </el-table-column>
      <el-table-column
        prop="payDate"
        label="支付日期"
        width="200">
      </el-table-column>
      <el-table-column
        label="订单类型"
        prop="orderType"
        :formatter="formatterOrderType"
        width="160">
      </el-table-column>
      <el-table-column
        prop="orderAmount"
        label="订单金额(元)"
        width="160">
      </el-table-column>
      <el-table-column
        prop="payAmount"
        label="实付金额(元)"
        width="160">
      </el-table-column>
      <el-table-column
        label="支付方式"
        prop="payType"
        :formatter="formatterpayType"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">
            <img src="./../assets/img/icon_chakan.png">
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
  import BaseSpaceRoomSelect from './../components/BaseSpaceRoomSelect'
  import BaseDatePickerGroup from './../components/BaseDatePickerGroup'

  export default {
    name:"dataBill",data(){
      return {
        baseTitle:'支付对账表',table:{},tableCellClassName:'tableCellClassName',tableHeaderClassName:'tableHeaderClassName',formInline:{
          "orderNo":"","overDate":"","payType":'',"spaceId_sc":'',"startDate":"","timeType":1,pageSize:15,page:1
        }
      }
    },components:{
      BaseHeader,BaseSpaceRoomSelect,BaseDatePickerGroup
    },created(){
      // 请求列表数据
      this.getDataList();
    },methods:{
      onSubmit(){
        this.getDataList();
      },handleChangeDate(val){
        this.formInline[val[0]] = val[1];
      },handleCurrentChange(){
        this.getDataList();
      },edit(row){
        if(row.orderType === 1){
          this.$router.push({
            name:'orderMeetingDeal',query:{orderNo:row.orderNo}
          })
        }else if(row.orderType === 2){
          this.$router.push({
            name:'orderPartDeal',query:{orderNo:row.orderNo}
          })
        }
      },getDataList(){
        this.$axios.post(process.env.API_HOST[1] + '/payrpt/list',this.formInline).then(res => {
          if(res.data.success === true){
            this.table = res.data;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },formatterpayType(v){
        switch(v.payType){
          case 1:
            return '支付宝';
            break;
          case 2:
            return '微信';
            break;
          case 3:
            return '银行卡';
            break;
          case 4:
            return '信用卡';
            break;
          case 5:
            return '线下支付';
            break;
          default:
            break
        }
      },formatterOrderType(v){
        //1-会议室租赁，2-房间-工位租赁,3-公共空间 ,
        switch(v.orderType){
          case 1:
            return '会议室租赁';
            break;
          case 2:
            return '房间-工位租赁';
            break;
          case 3:
            return '公共空间';
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
