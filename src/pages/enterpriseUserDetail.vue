<template>
  <section>
    <BaseSecHeader :title="title"></BaseSecHeader>
    <el-form :rules="rules" :model="detail" ref="detail" label-width="105px" label-position="left" class="single-form"
             :disabled="!editable" size="small">
      <el-row :gutter="200">
        <el-col :span="12">
          <el-form-item label="姓名" prop="realName">
            <el-input v-model.trim="detail.realName"
                      placeholder="请输入用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="cellphone">
            <el-input v-model.trim="detail.cellphone"
                      placeholder="请输入手机号或固机"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号码" prop="idCard">
            <el-input v-model.trim="detail.idCard" placeholder="请输入身份证号码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="detail.gender" v-if="editable">
              <el-radio name="gender" :label="1">男</el-radio>
              <el-radio name="gender" :label="0">女</el-radio>
            </el-radio-group>
            <span v-else>{{detail.gender == 1 ? "男" : detail.gender == 0 ?"女" : '&nbsp'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属空间" prop="spaceId_sc">
            <BaseSpaceRoomSelect :disabled="detail.enable === 0" :spaceId_sc.sync="detail.spaceId_sc" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属企业" prop="companyFullName">
            <BaseCompanySelect v-if="detail.enable" :companyFullName.sync="detail.companyFullName" :companyId_sc.sync="detail.companyId_sc"
                               style="width: 100%"/>
            <span v-else>{{detail.companyFullName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="detail.result && detail.result.IsCompanyEmp">
          <el-form-item label="房间绑定" style="position: relative">
            <div v-if="detail.enable">
              <FindFloorRoomStation :stationIds_sc.sync="detail.stationIds_sc" :roomIds_sc.sync="detail.roomIds_sc"
                                    :spaceId_sc="detail.spaceId_sc" :userId_sc="userId_sc"/>
            </div>
            <span v-else>无</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户类型">
            <el-radio-group v-model="detail.stationType" v-if="editable">
              <el-radio name="stationType" :label="1">固定工位用户</el-radio>
              <el-radio name="stationType" :label="2">移动工位用户</el-radio>
            </el-radio-group>
            <span v-else>{{detail.gender === 1 ? "固定工位用户" : detail.gender === 1 ? "移动工位用户" : ''}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="detail.enable" v-if="editable">
              <el-radio name="enable" :label="1">有效</el-radio>
              <el-radio name="enable" :label="0">无效</el-radio>
            </el-radio-group>
            <span v-else>{{detail.enable === 1 ? "有效" : detail.enable === 1 ?"无效" : ''}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24" style="text-align: center;margin-top: 30px">
        <el-button size="medium" @click="solve('detail')" style="width: 160px" type="primary" v-if="editable">保 存</el-button>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  import BaseSecHeader from './../components/BaseSecHeader'
  import BaseSpaceRoomSelect from './../components/BaseSpaceRoomSelect'
  import BaseCompanySelect from './../components/BaseCompanySelect'
  import BaseMessageBox from './../components/BaseMessageBox'
  import FindFloorRoomStation from '../components/FindFloorRoomStation'
  import {checkIdcard,checkPhone1} from './../validator'

  export default {
    name:"enterpriseUserDetail",components:{BaseSecHeader,BaseSpaceRoomSelect,BaseCompanySelect,BaseMessageBox,FindFloorRoomStation},data(){
      return {
        title:'用户',detail:{
          stationType:1,enable:1,gender:1
        },userId_sc:this.$route.query.userId_sc,editable:this.$route.query.editable,companyId_sc:this.$route.query.companyId_sc,rules:{
          realName:[{required:true,message:'请输入姓名',trigger:'blur'},],
          cellphone:[{required:true,message:'请输入手机号',trigger:'blur'},{validator:checkPhone1,trigger:'blur'}],
          idCard:[{required:true,message:'请输入身份证号',trigger:'blur'},{validator:checkIdcard,trigger:'blur'}],
          gender:[{required:true,message:'请选择性别',trigger:'change'}],
          companyFullName:[{required:true,message:'请输入所属企业',trigger:'change'}],
          spaceId_sc:[{required:true,message:'请选择所属空间',trigger:'change'}]
        },
      }
    },created(){
      if(this.userId_sc){
        this.getDetail()
      }
    },methods:{
      getDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/companyUser/detail',{params:{userId_sc:this.userId_sc}}).then(res => {
          if(res.data.success === true){
            this.detail = res.data;
            setTimeout(() => {
              this.$refs['detail'].clearValidate()
            },0)
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
                if(!this.detail.enable){
                  this.detail.stationIds_sc = [];
                  this.detail.roomIds_sc = [];
                }
                this.$axios.post(process.env.API_HOST[1] + '/companyUser/saveCompanyUser',this.detail).then(res => {
                  if(res.data.success === true){
                    this.$message.success('操作成功');
                    this.$router.back()
                  }else{
                    this.$message(res.data.msg)
                  }
                })
              }).catch(() => {
                this.$message.warning('已取消操作');
              });
            }else{
              return false
            }
          })
        }
      },
    }
  }
</script>

<style scoped lang="scss">

</style>
