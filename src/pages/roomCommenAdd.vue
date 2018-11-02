<template>
  <section>
    <BaseSecHeader :title="title"></BaseSecHeader>
    <el-form :rules="rules" :model="detail" ref="detail" label-width="105px" label-position="left" class="single-form" size="small">
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item label="公共区名称" prop="areaName">
                <el-input v-model.trim="detail.areaName"
                          placeholder="请输入公共区名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所属空间" prop="spaceId_sc">
                <BaseSpaceRoomSelect :spaceId_sc.sync="detail.spaceId_sc" style="width: 100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所在楼层" prop="floorId_sc">
                <BaseFloorSelect :floorId_sc.sync="detail.floorId_sc" :spaceId_sc="detail.spaceId_sc" style="width: 100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="公共区单价" prop="price">
                <el-input placeholder="请输入公共区单价" v-model.number="detail.price" min="0" step="1" type="number">
                  <template slot="prepend">人民币</template>
                  <template slot="append">元/半小时</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="面积大小" prop="acreage">
                <el-input v-model.number="detail.acreage" type="number"  min="0" step="1" placeholder="请输入面积大小">
                  <template slot="append">平米</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="人数限制" prop="peopleNum">
                <el-input v-model.number="detail.peopleNum" min="0" type="number" step="1" placeholder="请输入人数限制"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="公共区状态" prop="enable">
                <el-radio v-model="detail.enable" :label="1">有效</el-radio>
                <el-radio v-model="detail.enable" :label="0">无效</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="租赁状态" v-if="detail.leaseList">
                <div class="box-form-item">
                  <div v-for="(item,index) in detail.leaseList" :key="index" class="line">
                    <p>租赁者账号:{{item.userName}}</p>
                    <p>租赁者企业:{{item.companyName}}</p>
                    <p>租赁期限:{{item.deadline}}</p>
                    <!--"leaseStatus": 0,1-租赁中，0-闲置中 ,-->
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="text-align: center">
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
  import BaseEquipCheck from './../components/BaseEquipCheck'

  export default {
    name:"roomCommenAdd",components:{BaseSecHeader,BaseSpaceRoomSelect,BaseFloorSelect,BaseEquipCheck},created(){
      if(this.$route.query.areaId_sc){
        this.getDetail();
        setTimeout(() => {
          this.$refs['detail'].clearValidate()
        },100)
      }

    },data(){
      return {
        dialogEquip:false,title:'公共区',detail:{
          enable:1
        },rules:{
          areaName:[{required:true,message:'请输入公共区名称',trigger:'blur'},],
          acreage:[{type:'number',message:'请输入数字',trigger:'blur'},{required:true,message:'请输入面积',trigger:'blur'},],
          floorId_sc:[{required:true,message:'请选择楼层',trigger:'change'},],
          peopleNum:[{type:'number',message:'请输入数字',trigger:'blur'},{required:true,message:'请输入限制人数',trigger:'blur'},],
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
              this.$axios.post(process.env.API_HOST[1] + '/area/save',this.detail).then(res => {
                if(res.data.success === true){
                  this.$message.success("操作成功");
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
      },addEquipToDetail(){
        this.detail.equipList_sc = this.equipList_id;
        this.dialogEquip = false;
      },getDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/area/detail',{params:{areaId_sc:this.$route.query.areaId_sc}}).then(res => {
          if(res.data.success === true){
            this.detail = res.data;
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
