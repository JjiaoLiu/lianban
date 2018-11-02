<template>
  <section>
    <BaseSecHeader :title="title"></BaseSecHeader>
    <el-form :rules="rules" :model="detail" ref="detail" label-width="105px" label-position="left" class="single-form" size="small">
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item label="配件名称" prop="equipName">
                <el-input v-model.trim="detail.equipName" laceholder="请输入配件名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="配件数量" prop="stockNum">
                <el-input v-model.number="detail.stockNum" type="number" min="0" laceholder="配件数量" step="1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所属空间" prop="spaceId_sc">
                <BaseSpaceRoomSelect :spaceId_sc.sync="detail.spaceId_sc" style="width: 100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="配件单价" prop="price">
                <el-input v-model.number="detail.price" min="0" type="number" step="1">
                  <template slot="prepend">人民币</template>
                  <template slot="append">元/半小时</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="配件状态" prop="enable">
                <el-radio v-model="detail.enable" :label="1">有效</el-radio>
                <el-radio v-model="detail.enable" :label="0">无效</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="text-align: center">
              <el-button size="medium" @click="solve('detail')" style="width: 160px" type="primary">保存</el-button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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

  export default {
    name:"roomFitAdd",components:{BaseSecHeader,BaseSpaceRoomSelect},created(){
      if(this.$route.query.equipId_sc){
        this.getDetail();
      }

    },data(){
      return {
        dialogEquip:false,title:'配件',detail:{
          enable:1
        },equipList:[],     // 列表
        equipList_id:[],  // id
        rules:{
          equipName:[{required:true,message:'请输入配件名称',trigger:'blur'},],
          stockNum:[{type:'number',message:'请输入数字',trigger:'blur'},{required:true,message:'请输入配件数量',trigger:'blur'},],
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
              this.$axios.post(process.env.API_HOST[1] + '/mtequip/save',this.detail).then(res => {
                if(res.data.success === true){
                  this.$message.success('操作成功');
                  this.$router.back()
                }else{
                  this.$message.warning(res.data.msg)
                }
              });
            }).catch(() => {
              this.$message.info('已取消操作')
            });
          }else{
            return false;
          }
        });
      },getDetail(){
        // GET /mtequip/detail
        this.$axios.get(process.env.API_HOST[1] + '/mtequip/detail',{params:{equipId_sc:this.$route.query.equipId_sc}}).then(res => {
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
