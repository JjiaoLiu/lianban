<template>
  <div>
    <div class="header">
      财务信息
    </div>
    <el-form :rules="rules" :model="detail" ref="detail" label-width="120px" label-position="left" :disabled="disabled" size="small"
             class="single-form">
      <el-row :gutter="200">
        <el-col :span="12">
          <el-form-item label="财务联系人姓名" prop="financialName">
            <el-input v-model.trim="detail.financialName" placeholder="请输入财务联系人姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人电话" prop="financialPhone">
            <el-input v-model.trim="detail.financialPhone" placeholder="请输入联系人电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注册电话" prop="companyPhone">
            <el-input v-model.trim="detail.companyPhone" placeholder="请输入注册电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业抬头" prop="companyTitle">
            <el-input v-model.trim="detail.companyTitle" placeholder="请输入企业抬头"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业税号" prop="taxCode">
            <el-input v-model.trim="detail.taxCode" placeholder="请输入企业税号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户行" prop="bankId_sc">
            <SearchBankByName :bankId_sc.sync="detail.bankId_sc" :bankName="detail.bankName" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户支行" prop="subbranch">
            <el-input v-model.trim="detail.subbranch" placeholder="请输入开户支行"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行账号" prop="bankAccount">
            <el-input v-model="detail.bankAccount" placeholder="请输入银行账号" @change.native="bankAccountChange($event.target.value)"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-row>
            <el-col :span="10">
              <el-form-item label="注册地址" prop="districtCode">
                <BaseProvinceSelect :provinceCode.sync="detail.provinceCode" :cityCode.sync="detail.cityCode"
                                    :districtCode.sync="detail.districtCode"/>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item prop="registAddress" label-width="10px">
                <el-input v-model.trim="detail.registAddress" placeholder="请输入详细地址" maxLength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24" style="text-align: center;margin-top: 30px">
        <el-button size="medium" @click="solve('detail')" style="width: 160px" type="primary" v-if="!disabled">保存并下一步</el-button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {checkStr,checkPhone1,checkPhone2,checkBankCard} from './../../validator'
  import SearchBankByName from './../../components/SearchBankByName'
  import BaseProvinceSelect from './../../components/BaseProvinceSelect'

  export default {
    name:"caiwu",props:['disabled'],components:{SearchBankByName,BaseProvinceSelect},created(){
      this.detail.companyId_sc = this.companyId_sc;
      this.getDetail();
      setTimeout(() => {
        this.$refs['detail'].clearValidate()
      },100)
    },data(){
      return {
        title:'企业',
        companyId_sc:this.$route.query.companyId_sc || localStorage.getItem('companyId_sc'),
        detail:{bankAccount:''},
        rules:{
          financialName:[{required:true,message:'请输入财务联系人姓名',trigger:'blur'},],
          financialPhone:[{required:true,message:'请输入联系人电话',trigger:'blur'},{validator:checkPhone1,trigger:'blur'},],
          companyTitle:[{required:true,message:'请输入企业抬头',trigger:'blur'}],
          companyPhone:[{required:true,message:'请输入注册电话',trigger:'blur'},{validator:checkPhone2,trigger:'blur'}],
          creditCode:[{required:true,message:'请输入企业税号',trigger:'blur'},{validator:checkStr,trigger:'blur'}],
          bankId_sc:[{required:true,message:'请输入开户行',trigger:'blur'}],
          subbranch:[{required:true,message:'请输入开户支行',trigger:'blur'}],
          bankAccount:[{required:true,message:'请输入银行账号',trigger:'blur'},{validator:checkBankCard,trigger:'blur'}],
          cityCode:[{required:true,message:'请选择城市',trigger:'change'}],
          districtCode:[{required:true,message:'请选择区县',trigger:'change'}],
          registAddress:[{required:true,message:'请输入详细地址',trigger:'blur'}],
          taxCode:[{required:true,message:'请输入企业税号',trigger:'blur'}],
        }
      }
    },methods:{
      getDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/company/profile',{params:{companyId_sc:this.companyId_sc}}).then(res => {
          if(res.data.success === true){
            if(res.data.profileId_sc){
              this.detail = res.data;
            }
          }else{
            this.$message(res.data.msg)
          }
        })
      },bankAccountChange(val){
        let b;
        if(/\S{5}/.test(val)){
          b = val.replace(/\D/g,'').replace(/....(?!$)/g,'$& ')
        }else{
          b = val.replace(/\D/g,'')
        }
        this.detail.bankAccount = b;
      },solve(formName){
        let bankAccount = Object.assign(this.detail.bankAccount);
        bankAccount = bankAccount.replace(" ","");
        let params = Object.assign({},this.detail,{'bankAccount':bankAccount});
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$confirm('确认保存？','提示',{
              confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
            }).then(() => {
              this.$axios.post(process.env.API_HOST[1] + '/company/saveProfileInfo',this.detail).then(res => {
                if(res.data.success === true){
                  this.$emit('canuseIndex',['canuseIndex4','zhengjian']);
                }else{
                  this.$message.warning(res.data.msg)
                }
              })
            }).catch(() => {
              this.$message.info('已取消操作');
            });
          }else{
            return false;
          }
        })
      },
    }
  }
</script>

<style scoped>
  .header {
    background: #f0f4fa;
    padding: 17px 40px;
    line-height: 36px;
    height: 70px;
    font-size: 24px;
  }
</style>
