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
          <el-form-item label="订单类型">房间/工位订单</el-form-item>
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
          <el-form-item label="租赁开始日期">{{detail.leaseStartDate}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="租赁结束日期">{{detail.leaseOverDate}}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="remark" label="订单备注" :rules="{required:true,trigger:'blur',message:'请输入备注'}">
            <el-input type="textarea" v-model="detail.remark" resize="none" v-if="detail.orderStatus === 2"></el-input>
            <span v-else>{{detail.remark}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="remark" label="房间/工位绑定">
            <el-button style="cursor: text" plain v-for="(item,index) in detail.bindingInfo" :key="index">{{item}}</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align: center;margin-top: 30px" v-if="detail.orderStatus === 2">
          <el-button size="medium" @click="solveSuccess('detail')" style="width: 160px" type="primary">支付成功</el-button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button size="medium" @click="solveCancel" style="width: 100px" plain>订单取消</el-button>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
  import BaseSecHeader from "./../components/BaseSecHeader";

  export default {
    name: "orderPartDeal", components: {BaseSecHeader}, data() {
      return {
        showBtn: true, title: "订单编号:", detail: {}, orderNo: this.$route.query.orderNo
      };
    }, created() {
      this.getDetail();
    }, methods: {
      getDetail() {
        // GET /roomsorder/detail
        this.$axios.get(process.env.API_HOST[1] + "/roomsorder/detail", {
          params: {orderNo: this.orderNo}
        }).then(res => {
          if (res.data.success === true) {
            this.detail = res.data;
          } else {
            this.$message.warning(res.data.msg)
          }
        });
      }, solveSuccess(formName) {
        this.$refs[formName].validate((value) => {
          if (value) {
            this.$axios.post(process.env.API_HOST[1] + "/roomsorder/pay", {
              orderNo: this.orderNo, remark: this.detail.remark
            }).then(res => {
              if (res.data.success === true) {
                this.$message.success("操作成功");
                this.showBtn = false;
                this.$router.back()
              } else {
                this.$message.warning(res.data.msg)
              }
            });
          } else {
            return false
          }
        })
      }, solveCancel() {
        this.$confirm(`确认取消?`, "提示", {
          confirmButtonText: "确定", cancelButtonText: "取消", type: "warning"
        }).then(() => {
          this.$axios.post(process.env.API_HOST[1] + "/roomsorder/cancel", {
            orderNo: this.orderNo, remark: this.detail.remark
          }).then(res => {
            if (res.data.success === true) {
              this.$message.success("操作成功");
              this.showBtn = false;
              this.$router.back()
            } else {
              this.$message.warning(res.data.msg)
            }
          });
        }).catch(() => {
          this.$message.info("已取消操作")
        });
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
