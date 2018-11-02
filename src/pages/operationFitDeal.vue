<template>
  <section>
    <BaseSecHeader :title="title"></BaseSecHeader>
    <el-form label-width="105px" label-position="left" class="single-form">
      <el-row :gutter="200">
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item label="报修位置">{{detail.position}}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="联系电话">{{detail.phoneNo}}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="报修人姓名">{{detail.feedBackUser}}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="报修类型">{{detail.feedBackType}}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所在城市">{{detail.provinceCode | codeFilter}}{{detail.cityCode | codeFilter}}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所在空间">{{detail.spaceName}}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="报修内容">{{detail.content}}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="报修截图">
                <span v-for="src in detail.images" style="margin-right: 8px;cursor: pointer"><img width="60px" height="60px" :src="src" preview="0" preview-text="src"></span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-form-item label="处理结果">
            <el-input type="textarea" v-model="detail.reply"></el-input>
            <br>
            <el-radio-group v-model="detail.status">
              <!--1-等待处理，2-已处理，3-已取消，4-处理中-->
              <el-radio name="status" :disabled="detail.status === 3" :label="1" v-model="detail.status">待处理</el-radio>
              <el-radio name="status" :disabled="detail.status === 3" :label="4" v-model="detail.status">处理中</el-radio>
              <el-radio name="status" :disabled="detail.status === 3 || detail.status === 1" :label="2" v-model="detail.status">已处理</el-radio>
            </el-radio-group>
            <div style="float:right">
              <el-checkbox :readonly="true" v-model="detail.status === 3">用户已取消</el-checkbox>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align: center;margin-top: 30px">
          <el-button size="medium" @click="solve" style="width: 160px" type="primary">保 存</el-button>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
  import BaseSecHeader from './../components/BaseSecHeader'
  import {codeFilter} from './../filter'

  export default {
    name:"operationFitDeal",components:{BaseSecHeader},data(){
      return {
        title:'报修',detail:{},imglist:[],imgArr:[]
      }
    },created(){
      this.getDetail();
    },methods:{
      getDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/feedback/detail',{params:{feedBackId_sc:this.$route.query.feedBackId_sc}}).then(res => {
          if(res.data.success === true){
            this.detail = res.data;
            setTimeout(() => {this.$previewRefresh()},100)
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },solve(){
        this.$confirm(`确认修改?`,'提示',{
          confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
        }).then(() => {
          this.$axios.post(process.env.API_HOST[1] + '/feedback/solve',{
            feedBackId_sc:this.$route.query.feedBackId_sc,status:this.detail.status,reply:this.detail.reply
          }).then(res => {
            if(res.data.success === true){
              this.$message.success('操作成功');
              this.$router.back()
            }else{
              this.$message.warning(res.data.msg)
            }
          })
        }).catch(() => {
          this.$message.info('已取消操作')
        });
      }
    },filters:{
      codeFilter:codeFilter
    }
  }
</script>

<style lang="scss">
  .preview img {
    width: 60px;
    height: 60px;
  }
</style>
