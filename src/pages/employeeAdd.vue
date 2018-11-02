<template>
  <section>
    <BaseSecHeader :title="title"></BaseSecHeader>
    <el-form :rules="rules" :model="detail" ref="detail" label-width="105px" label-position="left" class="single-form" size="small">
      <el-row :gutter="200">
        <el-col :span="12">
          <el-form-item label="姓名" prop="employeeName">
            <el-input v-model.trim="detail.employeeName"
                      placeholder="请输入用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phoneNo">
            <el-input v-model.trim="detail.phoneNo"
                      placeholder="请输入手机号或固机"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号码" prop="idCard">
            <el-input v-model.trim="detail.idCard" placeholder="请输入身份证号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="detail.gender">
              <el-radio name="gender" :label="1">男</el-radio>
              <el-radio name="gender" :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属空间">
            {{detail.spaceName}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属企业">
            {{detail.companyFullName}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="房间绑定" style="position: relative">
            <div v-if="detail.status">
              <FindFloorRoomStation :companyId_sc="companyId_sc" employee="employee"
                                    :stationIds_sc.sync="detail.stationIds_sc" :roomIds_sc.sync="detail.roomIds_sc"
                                    :employeeId_sc="employeeId_sc"/>
            </div>
            <span v-else>无</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户状态">
            <el-radio-group v-model="detail.status">
              <el-radio name="status" :label="1">在职</el-radio>
              <el-radio name="status" :label="0">离职</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24" style="text-align: center;margin-top: 30px">
        <el-button size="medium" @click="solve('detail')" style="width: 160px" type="primary">保 存</el-button>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  import BaseSecHeader from '../components/BaseSecHeader'
  import BaseMessageBox from '../components/BaseMessageBox'
  import FindFloorRoomStation from '../components/FindFloorRoomStation'
  import {checkPhone1,checkIdcard} from './../validator'

  export default {
    name:"employeeAdd",components:{BaseSecHeader,BaseMessageBox,FindFloorRoomStation},data(){
      return {title:'企业用户',detail:{
          status:1,gender:1
        },employeeId_sc:this.$route.query.employeeId_sc,companyId_sc:this.$route.query.companyId_sc || localStorage.getItem('companyId_sc'),rules:{
          employeeName:[{required:true,message:'请输入姓名',trigger:'blur'},],
          phoneNo:[{required:true,message:'请输入手机号',trigger:'blur'},{validator:checkPhone1,trigger:'blur'}],
          idCard:[{required:true,message:'请输入身份证号',trigger:'blur'},{validator:checkIdcard,trigger:'blur'}],
          gender:[{required:true,message:'请选择性别',trigger:'change'}],
        },
      }
    },created(){
      if(this.employeeId_sc){
        this.getDetail()
      }
      if(!this.employeeId_sc){
        this.getCompanyDetail()
      }
    },methods:{
      getDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/companyEmployee/detail',{params:{employeeId_sc:this.employeeId_sc}}).then(res => {
          if(res.data.success === true){
            this.detail = res.data;
            this.companyId_sc = res.data.companyId_sc
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },solve(formName){
        if(formName){
          this.$refs[formName].validate(value => {
            if(value){
              this.$confirm(`确认保存?`,'提示',{
                confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
              }).then(() => {
                if(!this.detail.status){
                  this.detail.stationIds_sc = [];
                  this.detail.roomIds_sc = []
                }
                this.$axios.post(process.env.API_HOST[1] + '/companyEmployee/saveCompanyEmployee',this.detail).then(res => {
                  if(res.data.success === true){
                    this.$message('操作成功');
                    this.$message({
                      type:'success',message:'操作成功'
                    });
                    this.$router.back()
                  }else{
                    this.$message.warning(res.data.msg)
                  }
                })
              }).catch(() => {
                this.$message.info('已取消操作');
              });
            }else{
              return false
            }
          })
        }
      },getCompanyDetail(){
        // GET /company/detail
        this.$axios.get(process.env.API_HOST[1] + '/company/detail',{
          params:{companyId_sc:this.companyId_sc}
        }).then(res => {
          if(res.data.success === true){
            this.$set(this.detail,'companyFullName',res.data.companyFullName);
            this.$set(this.detail,'companyId_sc',res.data.companyId_sc);
            this.$set(this.detail,'spaceName',res.data.spaceName);
            this.$set(this.detail,'spaceId_sc',res.data.spaceId_sc);
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
