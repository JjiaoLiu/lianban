<template>
  <section>
    <div class="step">
      <span class="back" @click="$router.back(-1)" style="cursor: pointer">
        <img src="../assets/img/icon_back.png" height="33" width="18"/></span>
      <div class="step-main">
        <div class="button" :class="{'activeClass':activeClass ===1}" @click="changeCC('baseDetail',1)">基本信息</div>
        <img class="step-icon" src="../assets/img/icon_step_arr.png" height="17" width="17"/>
        <div class="button" :class="{'activeClass':activeClass === 2,'disabledClass':!canuseIndex2}" @click="changeCC('contactsInfo',2)">联系人信息</div>
        <img class="step-icon" src="../assets/img/icon_step_arr.png" height="17" width="17"/>
        <div class="button" :class="{'activeClass':activeClass === 3,'disabledClass':!canuseIndex3}" @click="changeCC('caiwu',3)">财务信息</div>
        <img class="step-icon" src="../assets/img/icon_step_arr.png" height="17" width="17"/>
        <div class="button" :class="{'activeClass':activeClass === 4,'disabledClass':!canuseIndex4}" @click="changeCC('zhengjian',4)">证件信息</div>
        <img class="step-icon" src="../assets/img/icon_step_arr.png" height="17" width="17"/>
        <div class="button" :class="{'activeClass':activeClass === 5,'disabledClass':!canuseIndex5}" @click="changeCC('contract',5)">合同管理</div>
        <img class="step-icon" src="../assets/img/icon_step_arr.png" height="17" width="17" v-if="!disabled"/>
        <div class="button" v-if="!disabled" :class="{'activeClass':activeClass === 6,'disabledClass':!canuseIndex6}" @click="changeCC('employee',6)">
          用户管理
        </div>
      </div>
    </div>
    <component v-bind:is="currentTabComponent" :disabled="disabled" @canuseIndex="canuseIndex"></component>
  </section>
</template>

<script>
  import baseDetail from '../components/CompanyDetail/baseDetail'
  import contactsInfo from '../components/CompanyDetail/contactsInfo'
  import caiwu from '../components/CompanyDetail/caiwu'
  import zhengjian2 from '../components/CompanyDetail/zhengjian2'
  import contract from '../components/CompanyDetail/contract'
  import employee from '../components/CompanyDetail/employee'

  export default {
    name:"enterpriseMngEdit",components:{baseDetail,contactsInfo,caiwu,zhengjian2,contract,employee},created(){
      // 如果是 查看页面  disabled
      // 如果是 编辑  companyId_sc
      if(this.companyId_sc){
        this.getDetail().then(() => {
          if(this.ifEmployeePage){
            this.changeCC('employee')
          }
        }).catch((err) => {
          console.log(err)
        });
      }
    },data(){
      return {
        currentTabComponent:baseDetail,
        disabled:true,
        activeClass:1,
        companyId_sc:this.$route.query.companyId_sc,
        canuseIndex1:true,
        canuseIndex2:false,
        canuseIndex3:false,
        canuseIndex4:false,
        canuseIndex5:false,
        canuseIndex6:false,
        ifEmployeePage:false
      }
    },methods:{
      baseInfo(){
        return new Promise((resolve,reject) => {
          this.$axios.get(process.env.API_HOST[1] + '/company/detail',{params:{companyId_sc:this.companyId_sc}}).then(res => {
            if(res.data.success === true && res.data.companyId_sc){
              return resolve(1)
            }else{
              return reject(res.data.msg);
            }
          });
        })
      },contactsInfo(){
        return new Promise((resolve,reject) => {
          this.$axios.get(process.env.API_HOST[1] + '/companyContacts/contactsInfo',{params:{companyId_sc:this.companyId_sc}}).then(res => {
            if(res.data.success === true && res.data.list_sc.length){
              this.canuseIndex2 = true;
              return resolve(2)
            }else{
              return reject(res.data.msg);
            }
          });
        })
      },profile(){
        return new Promise((resolve,reject) => {
          this.$axios.get(process.env.API_HOST[1] + '/company/profile',{params:{companyId_sc:this.companyId_sc}}).then(res => {
            if(res.data.success === true && res.data.profileId_sc){
              this.canuseIndex3 = true;
              return resolve(3)
            }else{
              return reject(res.data.msg);
            }
          });
        })
      },companyCertificate(){
        return new Promise((resolve,reject) => {
          this.$axios.get(process.env.API_HOST[1] + '/companyAttachment/certificateInfo',{params:{companyId_sc:this.companyId_sc}}).then(res => {
            if(res.data.success === true && res.data.list_sc && res.data.list_sc.length){
              this.canuseIndex4 = true;
              return resolve(4)
            }else{
              return reject(res.data.msg);
            }
          });
        })
      },companyContract(){
        return new Promise((resolve,reject) => {
          this.$axios.get(process.env.API_HOST[1] + '/companyContract/detail',{params:{companyId_sc:this.companyId_sc}}).then(res => {
            if(res.data.success === true && res.data.contractId_sc){
              this.canuseIndex5 = true;
              return resolve(5)
            }else{
              return reject(res.data.msg);
            }
          });
        })
      },companyEmployee(){
        return new Promise((resolve,reject) => {
          this.$axios.get(process.env.API_HOST[1] + '/companyEmployee/list',{
            params:{pageSize:1,page:1,companyId_sc:this.companyId_sc,status:'',}
          }).then(res => {
            if(res.data.success === true){
              this.canuseIndex6 = true;
              return resolve(6)
            }else{
              return reject(res.data.msg);
            }
          })
        })
      },async getDetail(){
        let a = await this.baseInfo();
        let b = await this.contactsInfo();
        let c = await this.profile();
        let d = await this.companyCertificate();
        let e = await this.companyContract();
        let f = await this.companyEmployee();
      },changeCC(n){
        switch(n){
          case 'baseDetail':
            this.currentTabComponent = baseDetail;
            this.activeClass = 1;
            break;
          case 'contactsInfo':
            if(this.canuseIndex2){
              this.currentTabComponent = contactsInfo;
              this.activeClass = 2;
            }
            break;
          case 'caiwu':
            if(this.canuseIndex3){
              this.currentTabComponent = caiwu;
              this.activeClass = 3;
            }
            break;
          case 'zhengjian':
            if(this.canuseIndex4){
              this.currentTabComponent = zhengjian2;
              this.activeClass = 4;
            }
            break;
          case 'contract':
            if(this.canuseIndex5){
              this.currentTabComponent = contract;
              this.activeClass = 5;
            }
            break;
          case 'employee':
            if(this.canuseIndex6){
              this.currentTabComponent = employee;
              this.activeClass = 6;
            }
            break;
          default:
            break;
        }
      },canuseIndex(val){
        this[val[0]] = true;
        this.changeCC(val[1])
      }
    },watch:{
      $route:{
        handler(N,O){
          if(N.name === 'enterpriseFilterDetail'){
            this.disabled = true
          }
          if(N.name === 'enterpriseMngEdit'){
            this.disabled = false
          }
        },immediate:true,deep:true
      }
    },beforeRouteEnter(to,from,next){
      if(from.name === 'employeeAdd'){
        next(vm => {
          vm.ifEmployeePage = true;
        })
      }else{
        next(vm => {
          vm.ifEmployeePage = false
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "./../assets/mixin/all";

  .step {
    height: 80px;
    .back {
      padding: 0 10px;
      margin-left: 30px;
      margin-right: 20px;
    }
    @include use-flex(center, flex-start);
    .step-main {
      @include use-flex(center, flex-start);
      .step-icon {
        margin: 0 30px;
      }
      .button {
        width: 120px;
        height: 50px;
        line-height: 50px;
        border: 1px solid #e6e6e6;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        &.active {
          background: #ff9000;
          color: #ffffff;
        }
      }
    }
  }

  .activeClass {
    background: #ff9000;
    color: #ffffff;
  }

  .disabledClass {
    background: #d3d4d6;
    color: #468;
  }
</style>
