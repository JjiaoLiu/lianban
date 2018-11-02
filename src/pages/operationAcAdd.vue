<template>
  <!--编辑和添加-->
  <section>
    <BaseSecHeader :title="title"></BaseSecHeader>
    <el-form :rules="rules" :model="detail" ref="detail" label-width="105px" label-position="left" class="single-form" size="small">
      <el-row :gutter="200">
        <el-col :span="24">
          <el-form-item label="活动名称" prop="title">
            <el-input v-model.trim="detail.title"
                      placeholder="请输入活动名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="活动地址" prop="location">
            <el-input v-model.trim="detail.location"
                      placeholder="请输入活动地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主办方" prop="organizer">
            <el-input v-model.trim="detail.organizer" placeholder="请输入主办方"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="活动开始日期" prop="beginTime">
            <el-date-picker
              style="width: 100%"
              v-model="detail.beginTime"
              value-format="timestamp"
              type="datetime"
              :pickerOptions="pickerOptions1"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="活动结束日期" prop="overTime">
            <el-date-picker
              style="width: 100%"
              value-format="timestamp"
              v-model="detail.overTime"
              :pickerOptions="pickerOptions2"
              type="datetime"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报名开始日期" prop="applyBeginTime">
            <el-date-picker
              style="width: 100%"
              value-format="timestamp"
              v-model="detail.applyBeginTime"
              :pickerOptions="pickerOptions3"
              type="datetime"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报名结束日期" prop="applyOverTime">
            <el-date-picker
              value-format="timestamp"
              v-model="detail.applyOverTime"
              style="width: 100%"
              :pickerOptions="pickerOptions4"
              type="datetime"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="活动省市" class="is-required" prop="provinceCode">
            <BaseProvinceSelect :provinceCode.sync="detail.provinceCode" :districtCode.sync="detail.districtCode"
                                :cityCode.sync="detail.cityCode"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="detail.address" placeholder="请输入详细地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="活动状态" prop="status">
            <el-radio-group v-model="detail.status">
              <el-radio :label="1">报名中</el-radio>
              <el-radio :label="2">进行中</el-radio>
              <el-radio :label="3">已结束</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="活动简介" prop="detail">
            <el-input v-model.trim="detail.detail" type="textarea" maxlength="200"
                      placeholder="请输入活动简介，200字以内"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="库存数" prop="maxPerson">
            <el-input v-model.number="detail.maxPerson" type="number" min="0"
                      placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="detail.maxPerson">
          <el-form-item label="报名人数" style="position: relative">
            <div class="form-action">
              {{detail.peoples}}/{{detail.maxPerson}}
            </div>
            <div class="action-form">
              <span v-for="(item,index) in detail.userList" :key="index" class="headUrl">
                <img :src="detail.headUrl"/>{{item.userName}}
              </span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="轮播图片上传">
            <BaseUploadGroup2 fileType="image/jpg;image/bmp,image/png,image/jpeg" :imageList_sc.sync="detail.imageList"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align: center">
          <el-button size="medium" @click="solve('detail')" style="width: 160px" type="primary">保 存</el-button>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
  import BaseProvinceSelect from './../components/BaseProvinceSelect'
  import BaseSysUserSelect from './../components/BaseSysUserSelect'
  import BaseSecHeader from './../components/BaseSecHeader'
  import BaseUploadGroup2 from './../components/BaseUploadGroup2'

  export default {
    name:"operationAcAdd",components:{BaseProvinceSelect,BaseSecHeader,BaseSysUserSelect,BaseUploadGroup2},created(){
      if(this.$route.query.activityId_sc){
        this.getDetail()
      }
    },data(){
      var _this = this;
      return {
        title:'活动',detail:{
          status:1,imageList:[]
        },rules:{
          title:[{required:true,message:'请输入活动名称',trigger:'blur'},],
          location:[{required:true,message:'请输入活动地址',trigger:'blur'},],
          organizer:[{required:true,message:'请输入主办方',trigger:'change'},],
          address:[{required:true,message:'请输入详细地址',trigger:'blur'}],
          detail:[{required:true,message:'请输入活动简介',trigger:'blur'}]
        },pickerOptions1:{
          disabledDate(time){
            if(_this.detail.overTime){
              return time > (new Date(_this.detail.overTime)).getTime()
            }
            return false
          }
        },pickerOptions2:{
          disabledDate(time){
            if(_this.detail.beginTime && !_this.detail.beginTime){
              return true
            }
            return (new Date(_this.detail.beginTime)).getTime() > (time.getTime() + 60 * 60 * 24 * 1000)
          }
        },pickerOptions3:{
          disabledDate(time){
            if(_this.detail.applyOverTime){
              return time > (new Date(_this.detail.applyOverTime)).getTime()
            }
            return false
          }
        },pickerOptions4:{
          disabledDate(time){
            if(_this.detail.applyBeginTime && !_this.detail.applyBeginTime){
              return true
            }
            return (new Date(_this.detail.applyBeginTime)).getTime() > (time.getTime() + 60 * 60 * 24 * 1000)
          }
        }
      }
    },methods:{
      solve(formName){
        if(!this.detail.cityCode){
          this.$message('请选择城市');
          return false
        }
        if(!this.detail.districtCode){
          this.$message('请选择区县');
          return false
        }
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$confirm('确认保存？','提示',{
              confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
            }).then(() => {
              this.$axios.post(process.env.API_HOST[1] + '/activity/save',this.detail).then(res => {
                if(res.data.success === true){
                  this.$message('操作成功');
                  this.$router.back()
                }else{
                  this.$message.warning(res.data.msg)
                }
              });
            }).catch(() => {
              this.$message.info('已取消删除');
            });
          }else{
            return false;
          }
        });

      },getDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/activity/detail',{params:{activityId_sc:this.$route.query.activityId_sc}}).then(res => {
          if(res.data.success === true){
            this.detail = res.data;
            setTimeout(() => {
              this.$refs['detail'].clearValidate()
            },0)
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>
