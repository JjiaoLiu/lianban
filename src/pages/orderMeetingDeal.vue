<template>
  <section>
    <BaseSecHeader :title="title+orderNo"></BaseSecHeader>
    <el-form :model="detail" label-width="100px" label-position="left" ref="detail" class="single-form">
      <el-row>
        <el-col :span="12">
          <el-form-item label="订单状态">{{detail.orderStatus |filterOrderStatus}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="签约空间">{{detail.spaceName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单类型">会议室订单</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="签约企业">{{detail.companyName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业联系人">{{detail.employeeName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业联系电话">{{detail.phoneNo}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="我方负责人">{{detail.dutyUserName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单总额">{{detail.orderAmount}}元</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="租赁日期">
            <span v-for="(item,index) in detail.leaseTimeList" :key="index">
              {{item}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="订单备注" prop="remark">
            <el-input v-if="detail.orderStatus === 2" maxlength="200" type="textarea"
                      v-model.trim="detail.remark"></el-input>
            <span v-else>{{detail.remark}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所需配件" prop="equipList">
            <el-button style="cursor: text" plain v-for="(item,index) in detail.equipList" :key="index">{{item}}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-col :span="24" style="text-align: center;margin-top: 30px" v-if="detail.orderStatus === 2">
        <el-button size="medium" @click="chargeBoxshow('detail')" style="width: 160px" type="primary">支付成功</el-button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button size="medium" @click="solveCancel" style="width: 100px" plain>订单取消</el-button>
      </el-col>
    </el-form>
    <el-dialog :visible.sync="showChargeBox" width="415px">
      <el-form :model="form" label-width="100px" label-position="left" ref="form" size="small">
        <el-form-item label="应付金额">{{detail.orderAmount}}元</el-form-item>
        <el-form-item prop="amount" label="实付金额" max="99999999" min="0"
                      :rules="{required:true,trigger:'blur',message:'请输入实付金额'}">
          <el-input v-model.number="form.amount" type="number">
            <span slot="append">元</span>
          </el-input>
        </el-form-item>
        <el-form-item prop="payType" label="支付方式" :rules="{required:true,trigger:'change',message:'请选择支付方式'}">
          <el-select v-model="form.payType" style="width: 100%">
            <el-option :value="1" label="支付宝扫码支付"></el-option>
            <el-option :value="2" label="微信扫码支付"></el-option>
            <el-option :value="3" label="银联刷卡支付"></el-option>
            <el-option :value="4" label="现金"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="orderSerial" label="支付流水号" :rules="{required:true,trigger:'blur',message:'请输入支付流水号'}">
          <el-input v-model.trim="form.orderSerial"></el-input>
        </el-form-item>
        <el-form-item label-width="0" style="text-align: center;margin-bottom: 0">
          <el-button style="width: 120px" type="primary" @click="solveSuccess('form')">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
  import BaseSecHeader from "./../components/BaseSecHeader";

  export default {
    name: "orderMeetingDeal", components: {BaseSecHeader}, data() {
      return {
        showBtn: true,
        title: "订单编号:",
        detail: {},
        showChargeBox: false,
        form: {payType: ''},
        orderNo: this.$route.query.orderNo
      };
    }, created() {
      this.getDetail();
    }, methods: {
      getDetail() {
        this.$axios.get(process.env.API_HOST[1] + "/mtroomorder/detail?orderNo=" + this.orderNo).then(res => {
          if (res.data.success === true) {
            this.detail = res.data;
          } else {
            this.$message.warning(res.data.msg)
          }
        });
      }, solveSuccess(formName) {
        this.$refs[formName].validate((value) => {
          if (value) {
            let params = Object.assign({}, {orderNo: this.orderNo, remark: this.detail.remark}, this.form);
            this.$axios.post(process.env.API_HOST[1] + "/mtroomorder/pay", params).then(res => {
              if (res.data.success === true) {
                this.detail = res.data;
                this.showChargeBox = false;
                this.getDetail()
              } else {
                this.$message.warning(res.data.msg)
              }
            });
          } else {
            return false;
          }
        })
      }, solveCancel() {
        this.$axios.post(process.env.API_HOST[1] + "/mtroomorder/cancel", {
          orderNo: this.orderNo,
          remark: this.detail.remark
        }).then(res => {
          if (res.data.success === true) {
            this.$message.success('取消成功');
            this.getDetail();
            this.showBtn = false;
          } else {
            this.$message.warning(res.data.msg)
          }
        });
      }, chargeBoxshow(formName) {
        this.$refs[formName].validate((value) => {
          if (value) {
            this.showChargeBox = true;
          } else {
            return false;
          }
        })
      }
    }, filters: {
      filterOrderStatus(v) {
        // 1-已支付，0-已取消，2-待支付 ,
        switch (v) {
          case 1:
            return "已支付";
            break;
          case 0:
            return "已取消";
            break;
          case 2:
            return "待支付";
            break;
          default:
            break;
        }
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
