<template>
  <section>
    <div class="header">
      合同管理
      <small>
        <small>自动账单配置（下一个结算日之后才能修改账单）</small>
      </small>
      <!--<el-button size="mini" plain v-if="!disabled" @click="disabled = false">修改</el-button>-->
      <el-button size="mini" plain @click="calculateBill('detail')" v-if="!newDisabled">生成</el-button>
    </div>
    <el-form :rules="rules" :model="detail" ref="detail" label-width="110px" label-position="left" size="small"
             class="single-form" :disabled="disabled">
      <el-row :gutter="200">
        <el-col :span="12">
          <el-form-item label="账单开始日期" prop="startDate">
            <el-date-picker style="width: 100%"
                            :disabled="newDisabled"
                            v-model="detail.startDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions1"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="账单结束日期" prop="overDate">
            <el-date-picker style="width: 100%"
                            v-model="detail.overDate"
                            value-format="yyyy-MM-dd"
                            :disabled="newDisabled"
                            :picker-options="pickerOptions2"
                            type="date"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="履约保证金" prop="bond">
            <el-input v-model.number="detail.bond" type="number" min="0" v-if="!newDisabled">
              <template slot="prepend">人民币</template>
              <template slot="append">元</template>
            </el-input>
            <span v-else>人民币{{detail.bond}}元</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="帐单总金额" prop="amount">
            <el-input v-model.number="detail.amount" type="number" min="0" maxlength="8" v-if="!newDisabled">
              <template slot="prepend">人民币</template>
              <template slot="append">元</template>
            </el-input>
            <span v-else>人民币{{detail.amount}}元</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="首付租金" prop="downPay">
            <el-input v-model.number="detail.downPay" type="number" min="0" v-if="!newDisabled">
              <template slot="prepend">人民币</template>
              <template slot="append">元</template>
            </el-input>
            <span v-else>人民币{{detail.downPay}}元</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款周期" prop="payCycle">
            <el-select v-model="detail.payCycle" style="width: 100%" :disabled="newDisabled">
              <el-option :value="item.value" :label="item.label" v-for="(item,index) in payCycleOption" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="提醒周期" prop="advanceDay">
            <el-input v-model.number="detail.advanceDay" type="number" min="1" v-if="!newDisabled">
              <template slot="prepend">提前</template>
              <template slot="append">个工作日自动生成订单</template>
            </el-input>
            <span v-else>提前{{detail.advanceDay}}个工作日自动生成订单</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业员工" prop="employeeId_sc">
            <fuzzySearchCompanyByName :employeeId_sc.sync="detail.employeeId_sc"
                                      :companyId_sc="companyId_sc"
                                      :disabled="disabled"
                                      :employeeName="detail.employeeName"
                                      style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="房间/工位绑定" style="position: relative" class="is-required">
            <FindFloorRoomStation :companyId_sc="companyId_sc" :startTime="detail.startDate" :overTime="detail.overDate"
                                  :stationIds_sc.sync="detail.stationIds_sc" :roomIds_sc.sync="detail.roomIds_sc"
                                  :contractBillId_sc="detail.contractBillId_sc"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <pre>{{detail.htmlBillRecord}}</pre>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="合同上传" prop="attachmentList_sc">
            <UploadForm :companyId_sc="companyId_sc" :list_sc="detail.attachmentList_sc" size="small"
                        emitType="onContract"
                        onType="emitContract"
                        :disabled="newDisabled"
                        fileType="'image/jpg;image/bmp,image/png,application/pdf'" download="download"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24" style="text-align: center;margin-top: 30px">
        <el-button size="medium" @click="solve()" style="width: 160px" type="primary" v-if="!disabled">保 存</el-button>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  import fuzzySearchCompanyByName from './../../components/fuzzySearchCompanyByName'
  import BaseMessageBox from './../../components/BaseMessageBox'
  import FindFloorRoomStation from './../../components/FindFloorRoomStation'
  import UploadForm from './../../components/UploadForm'
  import {Bus} from "../../bus";

  export default {
    name:"contract",components:{fuzzySearchCompanyByName,UploadForm,BaseMessageBox,FindFloorRoomStation},created(){
      this.getDetail();
      Bus.$on('onContract',(content) => {
        this.saveCompanyContract(content)
      });
    },computed:{
      newDisabled(){
        if(this.disabled){
          return this.disabled
        }
        if(this.detail.contractBillId_sc){
          return true
        }
        return false
      }
    },props:['disabled'],data(){
      var _this = this;
      var checkAmount = function(rule,value,callback){
        if(value < +_this.detail.downPay){
          return callback("总金额应大于首付金额")
        }
        callback()
      };
      var checkDownPay = function(rule,value,callback){
        if(value > +_this.detail.amount){
          return callback("首付金额应小于总金额")
        }
        callback()
      };
      return {
        payCycleOption:[{label:'月付',value:1},{label:'季付',value:2},{label:'半年付',value:3},{label:'年付',value:4}],
        detail:{},
        companyId_sc:this.$route.query.companyId_sc || localStorage.getItem('companyId_sc'),
        result:'',
        employeeId_sc_fuben:'',
        rules:{
          startDate:[{required:true,message:'请选择账单开始日期',trigger:'blur'}],
          overDate:[{required:true,message:'请选择账单结束日期',trigger:'blur'}],
          amount:[{type:'number',message:'请输入数字',trigger:'blur'},{required:true,message:'请输入账单总金额',trigger:'blur'},{
            validator:checkAmount,trigger:"blur"
          }],
          bond:[{type:'number',message:'请输入数字',trigger:'blur'},{required:true,message:'请输入保证金',trigger:'blur'}],
          downPay:[{type:'number',message:'请输入数字',trigger:'blur'},{required:true,message:'请输入首付',trigger:'change'},{
            validator:checkDownPay,trigger:"blur"
          }],
          payCycle:[{required:true,message:'请选择付款周期',trigger:'change'}],
          advanceDay:[{type:'number',message:'请输入数字',trigger:'blur'},{required:true,message:'请输入提前周期',trigger:'blur'}],
          attachmentList_sc:[{required:true,message:'请上传合同',trigger:'blur'}],
        },
        pickerOptions1:{
          disabledDate(time){
            if(_this.detail.overDate){
              return time > (new Date(_this.detail.overDate)).getTime()
            }
            return false
          }
        },
        pickerOptions2:{
          disabledDate(time){
            if(_this.detail.startDate){
              return time < (new Date(_this.detail.startDate)).getTime()
            }
            return false
          }
        },
      }
    },methods:{
      solve(){
        if(!this.detail.stationIds_sc.length && !this.detail.roomIds_sc.length){
          this.$message('请选择房间/工位');
          return false
        }
        Bus.$emit('emitContract');
      },saveCompanyContract(content){
        this.$refs['detail'].validate((valid) => {
          if(valid){
            this.$confirm('确认保存？','提示',{
              confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
            }).then(() => {
              this.detail.attachmentList_sc = content;
              this.$axios.post(process.env.API_HOST[1] + '/companyContract/saveCompanyContract?companyId_sc=' + this.companyId_sc,this.detail).then(res => {
                if(res.data.success === true){
                  this.$emit('canuseIndex',['canuseIndex6','employee']);
                }else{
                  this.$message.warning(res.data.msg)
                }
              });
            }).catch(() => {
              this.$message.info('已取消操作');
            });
          }else{
            return false;
          }
        });
      },calculateBill(formName){
        if(!this.detail.stationIds_sc.length && !this.detail.roomIds_sc.length){
          this.$message.warning('请选择房间/工位');
          return false
        }
        if(!this.detail.employeeId_sc){
          this.$message.warning('请选择选择企业员工，可先保存账单信息在‘用户管理’栏目添加员工');
          return false
        }
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$axios.post(process.env.API_HOST[1] + '/companyContract/calculateBill',{
              advanceDay:this.detail.advanceDay,
              amount:this.detail.amount,
              bond:this.detail.bond,
              downPay:this.detail.downPay,
              overTime:this.detail.overDate,
              payCycle:this.detail.payCycle,
              startTime:this.detail.startDate
            }).then(res => {
              if(res.data.success === true){
                this.$confirm(res.data.billResult,'提示',{
                  confirmButtonText:'确定生成账单',cancelButtonText:'不了，重新填写信息',type:'warning'
                }).then(() => {
                  this.$axios.post(process.env.API_HOST[1] + '/companyContract/generateBill?companyId_sc=' + this.companyId_sc,this.detail).then(res => {
                    if(res.data.success === true){
                      this.detail.htmlBillRecord = res.data.result.htmlBillRecord;
                      this.detail.contractBillId_sc = res.data.result.newContractBillId;
                      this.$message({type:'success',message:'生成账单成功'});
                    }else{
                      this.$message.warning(res.data.msg)
                    }
                  });
                }).catch(() => {
                  this.$message.info('已取消操作')
                });
              }else{
                this.$alert(res.data.msg,'提示',{
                  confirmButtonText:'确定'
                });
              }
            });
          }else{
            return false;
          }
        });
      },getDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/companyContract/detail',{params:{companyId_sc:this.companyId_sc}}).then(res => {
          if(res.data.success === true){
            if(res.data.contractId_sc){
              this.detail = res.data;
              this.contractInfo();
            }else{
              this.$set(this.detail,'stationIds_sc',[]);
              this.$set(this.detail,'roomIds_sc',[]);
              this.$set(this.detail,'attachmentList_sc',[])
            }
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },contractInfo(){
        this.$axios.get(process.env.API_HOST[1] + '/companyAttachment/contractInfo',{params:{companyId_sc:this.companyId_sc}}).then(res => {
          if(res.data.success === true){
            if(res.data.list_sc && res.data.list_sc.length){
              this.$set(this.detail,'attachmentList_sc',res.data.list_sc);
              setTimeout(() => {
                this.$refs['detail'].clearValidate()
              },0)
            }else{
              this.$set(this.detail,'attachmentList_sc',[])
            }
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      }
    },beforeDestroy(){
      Bus.$off('onContract');
      Bus.$off('emitContract')
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    background: #f0f4fa;
    padding: 17px 40px;
    line-height: 36px;
    height: 70px;
    font-size: 24px;
  }
</style>
