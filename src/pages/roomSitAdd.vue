<template>
  <section>
    <BaseSecHeader :title="title"></BaseSecHeader>
    <el-form :rules="rules" :model="detail" ref="detail" label-width="105px" label-position="left" class="single-form">
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item label="工位名称" prop="stationName">
                <el-input v-model.trim="detail.stationName" placeholder="请输入工位名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所属空间" prop="spaceId_sc">
                <BaseSpaceRoomSelect :spaceId_sc.sync="detail.spaceId_sc" style="width: 100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所在楼层" prop="floorId_sc">
                <BaseFloorSelect :floorId_sc.sync="detail.floorId_sc" :spaceId_sc="detail.spaceId_sc"
                                 style="width: 100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="工位单价" prop="price">
                <el-input v-model.number="detail.price" min="0" type="number" step="1">
                  <template slot="prepend">人民币</template>
                  <template slot="append">元/月</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="工位状态" prop="enable">
                <el-radio v-model="detail.enable" :label="1">有效</el-radio>
                <el-radio v-model="detail.enable" :label="0">无效</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="租赁状态" v-if="detail.leaseList">
                <div class="box-form-item">
                  <div v-for="(item,index) in detail.leaseList" :key="index" class="line">
                    <p>租赁状态:{{item.leaseStatus === 1 ? '租赁中' : '闲置中'}}</p>
                    <p>租赁者账号:{{item.userName}}</p>
                    <p>租赁者企业:{{item.companyName}}</p>
                    <p>租赁期限:{{item.deadline}}</p>
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="text-align: center;margin-top: 120px;">
              <el-button size="medium" @click="solve('detail')" style="width: 160px" type="primary">保存</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
  import BaseSecHeader from './../components/BaseSecHeader'
  import BaseSpaceRoomSelect from './../components/BaseSpaceRoomSelect'
  import BaseFloorSelect from './../components/BaseFloorSelect'

  export default {
    name:"roomSitAdd",components:{BaseSecHeader,BaseSpaceRoomSelect,BaseFloorSelect},created(){
      if(this.$route.query.stationId_sc){
        this.getDetail();
      }
    },data(){
      return {
        dialogEquip:false,title:'工位',detail:{
          enable:1
        },rules:{
          stationName:[{required:true,message:'请输入工位名称',trigger:'blur'},],
          floorId_sc:[{required:true,message:'请选择楼层',trigger:'change'},],
          price:[{type:'number',message:'请输入数字',trigger:'blur'},{required:true,message:'请输入价格',trigger:'blur'}],
          spaceId_sc:[{required:true,message:'请选择空间',trigger:'change'}],
        }
      }
    },methods:{
      solve(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$confirm('确认保存？','提示',{
              confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
            }).then(() => {
              this.$axios.post(process.env.API_HOST[1] + '/station/save',this.detail).then(res => {
                if(res.data.success === true){
                  this.$message.success('保存成功!');
                  this.$router.back()
                }else{
                  this.$message.warning(res.data.msg)
                }
              });
            }).catch(() => {
              this.$message.info("已取消操作")
            });
          }else{
            return false;
          }
        });
      },getDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/station/detail',{params:{stationId_sc:this.$route.query.stationId_sc}}).then(res => {
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
    },
  }
</script>

<style lang="scss" scoped>

</style>
