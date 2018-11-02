<template>
  <section>
    <BaseSecHeader :title="title"></BaseSecHeader>
    <el-form :rules="rules" :model="detail" ref="detail" label-width="105px" label-position="left" class="single-form" size="small">
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item label="房间名称" prop="roomName">
                <el-input v-model.trim="detail.roomName"
                          placeholder="请输入房间名称"></el-input>
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
              <el-form-item label="房间单价" prop="price">
                <el-input v-model.number="detail.price" min="0" type="number" step="1">
                  <template slot="prepend">人民币</template>
                  <template slot="append">元/月</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="面积大小" prop="acreage">
                <el-input v-model.number="detail.acreage" type="number" min="0" placeholder="请输入面积大小" step="1">
                  <template slot="append">平米</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="人数限制" prop="peopleNum">
                <el-input v-model.number="detail.peopleNum" min="0" type="number" step="1"
                          placeholder="请输入人数限制"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="房间状态" prop="enable">
                <el-radio v-model="detail.enable" :label="1">有效</el-radio>
                <el-radio v-model="detail.enable" :label="0">无效</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="门禁绑定" prop="equipCode">
                <BaseMenjinSelect :spaceId_sc="detail.spaceId_sc"
                                  :floorId_sc="detail.floorId_sc"
                                  :equipCode.sync="detail.equipCode" style="width: 100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="工位管理">
                <div class="form-action">
                  <el-button plain size="mini" @click="showStationList">管理</el-button>
                </div>
                <div class="action-form">
                  <span class="button" v-for="(item,index) in bindingSelectOption" :key="index">{{item.stationName}}</span>
                </div>
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
    <BaseMessageBox title="工位管理" :show.sync="stationListShow">
      <div style="width: 400px">
        <el-checkbox-group v-model="bandingList_sc">
          <el-checkbox v-for="(item,index) in bindingOption" :key="index"
                       :label="item.stationId_sc" name="stationList">
            {{item.stationName}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div style="text-align: center;margin-top: 30px">
        <el-button type="primary" @click="addStationListToDetail">保 存</el-button>
      </div>
    </BaseMessageBox>
  </section>
</template>

<script>
  import BaseSecHeader from './../components/BaseSecHeader'
  import BaseSpaceRoomSelect from './../components/BaseSpaceRoomSelect'
  import BaseFloorSelect from './../components/BaseFloorSelect'
  import BaseMenjinSelect from './../components/BaseMenjinSelect'
  import BaseMessageBox from './../components/BaseMessageBox'

  export default {
    name:"roomPartAdd",components:{BaseSecHeader,BaseSpaceRoomSelect,BaseFloorSelect,BaseMenjinSelect,BaseMessageBox},created(){
      if(this.$route.query.roomId_sc){
        this.getDetail();
      }
    },data(){
      return {
        stationListShow:false,title:'房间管理',detail:{
          enable:1,bandingList_sc:[]
        },rules:{
          roomName:[{required:true,message:'请输入房间名称',trigger:'blur'},],
          acreage:[{type:'number',message:'请输入数字',trigger:'blur'},{required:true,message:'请输入面积',trigger:'blur'},],
          floorId_sc:[{required:true,message:'请选择楼层',trigger:'change'},],
          peopleNum:[{type:'number',message:'请输入数字',trigger:'blur'},{required:true,message:'请输入限制人数',trigger:'blur'},],
          price:[{type:'number',message:'请输入数字',trigger:'blur'},{required:true,message:'请输入价格',trigger:'blur'}],
          spaceId_sc:[{required:true,message:'请选择空间',trigger:'change'}],
          equipCode:[{required:true,message:'请选择门禁',trigger:'blur'}],
        },bindingOption:[],bandingList_sc:[]
      }
    },computed:{
      floorId_sc(){
        if(this.detail){
          return this.detail.floorId_sc
        }
        return ''
      },bindingSelectOption(){
        if(this.detail.bandingList_sc){
          let o = this.bindingOption.filter((f,i,fx) => {
            return this.detail.bandingList_sc.includes(f.stationId_sc)
          });
          return o
        }
        return []
      }
    },methods:{
      solve(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$confirm('确认保存？','提示',{
              confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
            }).then(() => {
              this.$axios.post(process.env.API_HOST[1] + '/room/save',this.detail).then(res => {
                if(res.data.success === true){
                  this.$message.success('保存成功!');
                  this.$router.back()
                }
              });
            }).catch(() => {
              this.$message.info('已取消操作')
            });
          }else{
            return false;
          }
        });
      },showStationList(){
        this.bandingList_sc = Object.assign([],this.detail.bandingList_sc);
        this.stationListShow = true
      },addStationListToDetail(){
        this.detail.bandingList_sc = this.bandingList_sc;
        this.stationListShow = false;
      },getDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/room/detail',{params:{roomId_sc:this.$route.query.roomId_sc}}).then(res => {
          if(res.data.success === true){
            this.detail = res.data;
            this.bindingdetail();
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },bindingdetail(){
        this.$axios.get(process.env.API_HOST[1] + '/room/bindingdetail',{
          params:{floorId_sc:this.detail.floorId_sc,roomId_sc:this.$route.query.roomId_sc}
        }).then(res => {
          if(res.data.success === true){
            this.bindingOption = res.data.list;
            setTimeout(() => {
              this.$refs['detail'].clearValidate()
            },0)
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      }
    },watch:{
      floorId_sc:{
        handler(N,O){
          if(N){
            this.bindingdetail()
          }
        },immediate:true
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
