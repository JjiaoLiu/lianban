<template>
  <section>
    <BaseSecHeader :title="title">
    </BaseSecHeader>
    <el-form label-width="105px" label-position="left" class="single-form">
      <el-row :gutter="200">
        <el-col :span="12">
          <el-form-item label="访客姓名">{{detail.guestName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话">{{detail.phoneNo}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号码">{{detail.idCard}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别">{{detail.gender === 1 ? '男' : detail.gender === 2 ? '女' : '未填写'}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目标空间">{{detail.spaceName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="被访人员">{{detail.guestForUser}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="访客类型">{{detail.guestType === 1 ? '预约参观' :'临时访客'}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="访客状态">{{detail.staus | filterStaus }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来访时间">{{detail.guestDate}}</el-form-item>
        </el-col>
        <el-col :span="24" style="text-align: center;margin-top: 30px">
          <el-button type="primary" size="medium" @click="allow" style="width: 100px" v-if="detail.staus === 3">允许参观</el-button>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
  import BaseSecHeader from './../components/BaseSecHeader'
  import BaseMessageBox from './../components/BaseMessageBox'

  export default {
    name:"operationVisitDetail",data(){
      return {
        showRe:true,title:'访客参观管理',detail:{}
      }
    },components:{BaseSecHeader,BaseMessageBox},created(){
      this.getDetail()
    },methods:{
      getDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/guest/detail',{params:{guestId_sc:this.$route.query.guestId_sc}}).then(res => {
          if(res.data.success === true){
            this.detail = res.data;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },allow(){
        this.$confirm(`你确认允许？`,'提示',{
          confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
        }).then(() => {
          this.$axios.get(process.env.API_HOST[1] + '/guest/allow',{params:{guestId_sc:this.$route.query.guestId_sc}}).then(res => {
            if(res.data.success === true){
              this.$message.success("操作成功");
              this.getDetail()
            }else{
              this.$message.warning(res.data.msg)
            }
          })
        }).catch(() => {
          this.$message.info('已取消操作')
        });
      }
    },filters:{
      filterStaus(V){
        // 0-拒绝，1-已确认，2-已到达，3-参观申请，4-未到达 ,
        switch(V){
          case 0:
            return '拒绝';
            break;
          case 1:
            return '已确认';
            break;
          case 2:
            return '已到达';
            break;
          case 3:
            return '参观申请';
            break;
          case 4:
            return '未到达';
            break;
          default:
            break;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
