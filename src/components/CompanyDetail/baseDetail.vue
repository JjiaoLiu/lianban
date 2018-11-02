<template>
  <div>
    <div class="header">
      企业基础信息
    </div>
    <el-form :rules="rules" :model="detail" ref="detail" label-width="105px" label-position="left" class="single-form" :disabled="disabled"
             size="small">
      <el-row :gutter="200">
        <el-col :span="12">
          <el-form-item label="企业名称" prop="companyFullName">
            <el-input v-model.trim="detail.companyFullName" placeholder="请输入企业名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业简称" prop="companyName">
            <el-input v-model.trim="detail.companyName" placeholder="请输入企业简称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在行业" prop="profession_sc">
            <el-select v-model="detail.profession_sc" placeholder="请选择" style="width: 100%">
              <el-option v-for="item in professionOption" :key="item.professionId_sc" :label="item.professionName" :value="item.professionId_sc">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业类型" prop="companyType_sc">
            <el-select v-model="detail.companyType_sc" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in companyTypeOption"
                :key="item.typeId_sc"
                :label="item.typeName"
                :value="item.typeId_sc">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业来源" prop="originId_sc">
            <el-select v-model="detail.originId_sc" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in originOption"
                :key="item.originId_sc"
                :label="item.originName"
                :value="item.originId_sc">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="社会信用代码" prop="creditCode">
            <el-input v-model.trim="detail.creditCode"
                      placeholder="请输入社会信用代码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证件编号" prop="permitCode">
            <el-input v-model.trim="detail.permitCode" placeholder="请输入证件编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注册资本" prop="registCapital">
            <el-input v-model.number="detail.registCapital" type="number" min="0" max="99999999" maxlength="8" v-if="!disabled">
              <template slot="prepend">人民币</template>
              <template slot="append">万元</template>
            </el-input>
            <span v-else>人民币{{detail.registCapital}}万元</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法定代表" prop="legalName">
            <el-input v-model.trim="detail.legalName" placeholder="请输入法定代表"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成立日期" prop="foundingDate">
            <el-date-picker style="width: 100%" v-model="detail.foundingDate" type="date" placeholder="选择日期"
                            :picker-options="pickerOptions1"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归属空间" prop="spaceId_sc">
            <BaseSpaceRoomSelect :spaceId_sc.sync="detail.spaceId_sc" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <span v-if="disabled">{{detail.status | filterStatus}}</span>
            <el-radio-group v-model="detail.status" v-else>>
              <el-radio :label="0">退出</el-radio>
              <el-radio :label="1">已入住</el-radio>
              <el-radio :label="2">未入住</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="企业简介" prop="describe">
            <el-input v-model.trim="detail.describe" type="textarea" maxlength="400"
                      placeholder="请输入企业简介，400字以内" style="width: 100%"></el-input>
            <el-checkbox v-model="detail.isAbroad" label="是否留学人员创办企业"></el-checkbox>
            <el-checkbox v-model="detail.isCollege" label="是否大学生创办企业"></el-checkbox>
            <el-checkbox v-model="detail.isThousand" label="是否千人计划"></el-checkbox>
            <el-checkbox v-model="detail.isTechnology" label="是否高新技术认定"></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="经营范围" prop="business">
            <el-input v-model.trim="detail.business" type="textarea" maxlength="200"
                      placeholder="请输入经营范围，200字以内"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-col :span="24" style="text-align: center;margin-top: 30px">
      <el-button size="medium" @click="solve('detail')" style="width: 160px" type="primary" v-if="!disabled">保存并下一步</el-button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </el-col>
  </div>
</template>

<script>
  import BaseSpaceRoomSelect from './../../components/BaseSpaceRoomSelect'
  import {checkStr} from './../../validator'

  export default {
    name:"baseDetail",components:{BaseSpaceRoomSelect},props:['disabled'],created(){
      this.axioslist().catch((err) => {console.log(err)})
    },data(){
      var _this = this;
      return {
        pickerOptions1:{
          disabledDate(time){
            return time > (new Date()).getTime();
          }
        },
        professionOption:[],
        companyTypeOption:[],
        originOption:[],
        title:'企业',
        detail:{status:0,isAbroad:false,isCollege:false,isThousand:false,isTechnology:false},
        rules:{
          companyFullName:[{required:true,message:'请输入企业名称',trigger:'blur'}],
          profession_sc:[{required:true,message:'请选择所在行业',trigger:'change'}],
          companyType_sc:[{required:true,message:'请选择行业类型',trigger:'change'}],
          originId_sc:[{required:true,message:'请选择企业来源',trigger:'change'}],
          creditCode:[{required:true,message:'请输入社会信用代码',trigger:'blur'},{validator:checkStr,trigger:'blur'}],
          permitCode:[{required:true,message:'请输入证件编号',trigger:'blur'},{validator:checkStr,trigger:'blur'}],
          registCapital:[{type:'number',message:'请输入数字',trigger:'blur'},{required:true,message:'请输入注册资本',trigger:'blur'}],
          legalName:[{required:true,message:'请输入法定代表',trigger:'blur'}],
          describe:[{required:true,message:'请输入企业简介',trigger:'blur'}],
          business:[{required:true,message:'请输入经营范围',trigger:'blur'}],
          spaceId_sc:[{required:true,message:'请选择归属空间',trigger:'change'}],
        }
      }
    },methods:{
      async axioslist(){
        let a = await this.getProfessionOption();
        let b = await this.getCompanyTypeOption();
        let c = await this.getOriginOptionOption();
        if(this.$route.query.companyId_sc){
          let d = this.getDetail()
        }
        return true
      },getDetail(){
        return new Promise((resolve,reject) => {
          this.$axios.get(process.env.API_HOST[1] + '/company/detail',{params:{companyId_sc:this.$route.query.companyId_sc}}).then(res => {
            if(res.data.success === true){
              this.detail = res.data;
              this.detail.isAbroad === 1 ? this.detail.isAbroad = true : this.detail.isAbroad = false;
              this.detail.isCollege === 1 ? this.detail.isCollege = true : this.detail.isCollege = false;
              this.detail.isTechnology === 1 ? this.detail.isTechnology = true : this.detail.isTechnology = false;
              this.detail.isThousand === 1 ? this.detail.isThousand = true : this.detail.isThousand = false;
              setTimeout(() => {
                this.$refs['detail'].clearValidate()
              },0);
              resolve(true)
            }else{
              this.$message.warning(res.data.msg);
              reject('getDetail')
            }
          })
        })
      },getProfessionOption(){
        return new Promise((resolve,reject) => {
          this.$axios.get(process.env.API_HOST[1] + '/company/findAllProfession').then(res => {
            if(res.data.success === true){
              this.professionOption = res.data.professionList_sc;
              resolve(true)
            }else{
              this.$message.warning(res.data.msg);
              reject('getProfessionOption')
            }
          })
        });
      },getCompanyTypeOption(){
        return new Promise((resolve,reject) => {
          this.$axios.get(process.env.API_HOST[1] + '/company/findAllCompanyType').then(res => {
            if(res.data.success === true){
              this.companyTypeOption = res.data.typeList_sc;
              resolve(true)
            }else{
              this.$message.warning(res.data.msg);
              reject('getCompanyTypeOption')
            }
          })
        });
      },getOriginOptionOption(){
        return new Promise((resolve,reject) => {
          this.$axios.get(process.env.API_HOST[1] + '/company/findAllCompanyOrigin').then(res => {
            if(res.data.success === true){
              this.originOption = res.data.originList_sc;
              resolve(true)
            }else{
              this.$message.warning(res.data.msg);
              reject('getOriginOptionOption')
            }
          })
        });
      },solve(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$confirm('确认保存？','提示',{
              confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
            }).then(() => {
              let params = Object.assign(this.detail,{
                "isAbroad":+this.detail.isAbroad,
                "isCollege":+this.detail.isCollege,
                "isTechnology":+this.detail.isTechnology,
                "isThousand":+this.detail.isThousand,
              });
              this.$axios.post(process.env.API_HOST[1] + '/company/saveBasicInfo',params).then(res => {
                if(res.data.success === true){
                  this.$refs[formName].clearValidate();
                  if(!this.$route.query.companyId_sc){
                    localStorage.setItem('companyId_sc',res.data.result.NewCompanyId)
                  }
                  this.$emit('canuseIndex',['canuseIndex2','contactsInfo']);
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
      }
    },filters:{
      filterStatus(v){
        switch(v){
          case 0:
            return '退出';
            break;
          case 1:
            return '已入住';
            break;
          case 2:
            return '未入住';
            break;
          default:
            break;
        }
      }
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
