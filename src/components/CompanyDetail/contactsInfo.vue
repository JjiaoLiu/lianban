<template>
  <div>
    <div class="header">
      联系人信息&nbsp;&nbsp;&nbsp;&nbsp;
      <button class="button" @click="addDomain('detail')" type="button" v-if="!disabled">
        <img src="../../assets/img/icon_add.png" height="20" width="20"/>&nbsp;&nbsp;添加
      </button>
    </div>
    <el-form :inline="true" :model="detail" ref="detail" label-width="100px" :disabled="disabled" class="single-form">
      <el-row style="padding-left: 40px;font-weight: bold" class="el-row">
        <el-col :span="5">
          <el-form-item>
            联系人姓名
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            联系人电话
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item>
            联系人邮箱
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="!disabled">
          <el-form-item style="width: 100%;text-align: center">
            操作
          </el-form-item>
        </el-col>
      </el-row>
      <div id="contract" class="form edit-read">
        <div v-for="(contract, index) in detail.list_sc" :key="index">
          <el-row style="padding-left: 40px">
            <el-col :span="5">
              <el-form-item
                :prop="'list_sc.'+index+'.contactsName'"
                :rules="{required: true, message: '姓名不能为空', trigger: 'blur'}">
                <el-input v-model.trim="contract.contactsName" @focus="focus($event)"
                          :readonly="readonly" style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                :prop="'list_sc.'+index+'.contactsTel'"
                :rules="{ validator: checkPhone1, trigger: 'blur' }">
                <el-input v-model.trim="contract.contactsTel" @focus="focus($event)"
                          :readonly="readonly" style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item
                :prop="'list_sc.'+index+'.eamail'"
                :rules="{ validator: checkEmail, trigger: 'blur' }">
                <el-input v-model.trim="contract.eamail" @focus="focus($event)"
                          :readonly="readonly" style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5" v-if="!disabled">
              <el-form-item style="width: 100%;text-align: center">
                <el-button type="text" @click="validateField('detail',index)">保存</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
                <el-button type="text" @click.prevent="removeDomain(contract)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <el-row v-if="detail.list_sc.length">
      <el-col :span="24" style="text-align: center;margin-top: 30px">
        <el-button size="medium" @click="solve('detail')" style="width: 160px" type="primary" v-if="!disabled">保存并下一步</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  import {checkEmail,checkPhone1} from './../../validator'

  export default {
    name:"contactsInfo",components:{},props:['disabled'],created(){
      this.getDetail()
    },data(){
      return {
        readonly:true,
        checkPhone1:checkPhone1,
        checkEmail:checkEmail,
        detail:{list_sc:[]},
        companyId_sc:this.$route.query.companyId_sc || localStorage.getItem('companyId_sc')
      }
    },methods:{
      getDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/companyContacts/contactsInfo',{params:{companyId_sc:this.companyId_sc}}).then(res => {
          if(res.data.success === true){
            if(res.data.list_sc && res.data.list_sc.length){
              this.detail = res.data
            }
          }else{
            this.$message.warning(res.data.msg)
          }
        });
      },solve(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$confirm('确认保存？','提示',{
              confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
            }).then(() => {
              this.$axios.post(process.env.API_HOST[1] + '/companyContacts/saveCompanyContacts?companyId_sc=' + this.companyId_sc,{list_sc:this.detail.list_sc}).then(res => {
                if(res.data.success === true){
                  this.$refs[formName].clearValidate();
                  this.$emit('canuseIndex',['canuseIndex3','caiwu']);
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
        });
      },focus(e){
        e.target.readOnly = false
      },removeDomain(item){
        var index = this.detail.list_sc.indexOf(item);
        if(index !== -1){
          this.detail.list_sc.splice(index,1)
        }
      },addDomain(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.detail.list_sc.push({
              "contactsName":"","contactsTel":"","eamail":""
            });
            var l = this.detail.list_sc.length - 1;
            this.$nextTick(() => {
              var a = ((document.getElementById('contract').getElementsByClassName('el-row'))[l]).getElementsByTagName('input');
              Array.from(a).forEach((f,i,fx) => {
                f.removeAttribute('readOnly');
              })
            })
          }else{
            return false
          }
        });
      },validateField(formName,i){
        this.$refs[formName].validateField('list_sc.' + i + '.eamail',(valid) => {
          if(!valid){
            this.$nextTick(() => {
              (((document.getElementById('contract').getElementsByClassName('el-row'))[i]).getElementsByTagName('input'))[2].setAttribute('readOnly','readOnly')
            })
          }else{
            return false
          }
        });
        this.$refs[formName].validateField('list_sc.' + i + '.contactsName',(valid) => {
          if(!valid){
            this.$nextTick(() => {
              (((document.getElementById('contract').getElementsByClassName('el-row'))[i]).getElementsByTagName('input'))[0].setAttribute('readOnly','readOnly')
            })
          }else{
            return false
          }
        });
        this.$refs[formName].validateField('list_sc.' + i + '.contactsTel',(valid) => {
          if(!valid){
            this.$nextTick(() => {
              (((document.getElementById('contract').getElementsByClassName('el-row'))[i]).getElementsByTagName('input'))[1].setAttribute('readOnly','readOnly')
            })
          }else{
            return false
          }
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  .header {
    background: #f0f4fa;
    padding: 17px 40px;
    line-height: 36px;
    height: 70px;
    font-size: 24px;
  }

  .button {
    font-size: 20px;
    height: 36px;
    line-height: 36px;
    padding: 0 15px;
    text-align: center;
    background: #ff9000;
    color: #ffffff;
    border-radius: 4px;
    img {
      vertical-align: middle;
      margin-top: -3px;
    }
  }

  .form > div {
    height: 58px;
    padding: 12px 0;
  }

  .form > div:nth-child(2n-1) {
    background: #f9fbff;
  }
</style>
