<template>
  <div>
    <div class="header">
      证件资料图片上传
      <small>
        <small>（上传文件类型为jpg;bmp,png,jpeg 限制大小为4MB）</small>
      </small>
    </div>
    <div style="padding: 40px">
      <UploadForm :companyId_sc="companyId_sc" :list_sc.sync="detail.list_sc" size="large" :disabled="disabled"
                  fileType="'image/jpg;image/bmp,image/png,image/jpeg'" slider="slider" emitType="onZhengjian"
                  onType="emitZhengjian"/>
    </div>
    <el-row v-if="detail.list_sc && detail.list_sc.length">
      <el-col :span="24" style="text-align: center;margin-top: 30px">
        <el-button size="medium" @click="solve()" style="width: 160px" type="primary" v-if="!disabled">保存并下一步</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import UploadForm from './../../components/UploadForm'
  import {Bus} from "../../bus";

  export default {
    name:"zhengjian2",components:{UploadForm},props:['disabled'],data(){
      return {
        detail:{},companyId_sc:this.$route.query.companyId_sc || localStorage.getItem('companyId_sc'),outerVisible:false
      }
    },created(){
      this.getDetail();
      Bus.$on('onZhengjian',(content) => {
        this.saveCompanyCertificate(content)
      })
    },methods:{
      getDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/companyAttachment/certificateInfo',{params:{companyId_sc:this.companyId_sc}}).then(res => {
          if(res.data.success === true){
            if(res.data.list_sc && res.data.list_sc.length){
              this.detail = res.data;
            }else{
              this.$set(this.detail,'list_sc',[]);
            }
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },solve(){
        Bus.$emit('emitZhengjian');
      },saveCompanyCertificate(content){
        this.$confirm('确认保存？','提示',{
          confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
        }).then(() => {
          this.detail.list_sc = content;
          this.$axios.post(process.env.API_HOST[1] + '/companyAttachment/saveCompanyCertificate?companyId_sc=' + this.companyId_sc,this.detail).then(res => {
            if(res.data.success === true){
              this.$emit('canuseIndex',['canuseIndex5','contract']);
            }else{
              this.$message.warning(res.data.msg)
            }
          })
        }).catch(() => {
          this.$message.info('已取消操作');
        });
      }
    },beforeDestroy(){
      Bus.$off('onZhengjian');
      Bus.$off('emitZhengjian')
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/mixin/all";

  .header {
    background: #f0f4fa;
    padding: 17px 40px;
    line-height: 36px;
    height: 70px;
    font-size: 24px;
  }

  .el-form {
    @include use-flex(flex-start, flex-start);
    flex-wrap: wrap;
  }

</style>
