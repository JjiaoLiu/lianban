<template>
  <div>
    <div class="form-action">
      <el-button plain size="mini" @click="floorShow = true" v-if="spaceId_sc || (startTime && overTime && !contractBillId_sc) || employee">管理</el-button>
    </div>
    <div class="action-form">
         <span class="button" v-for="(item,index) in roomCheckOption" :key="'roomCheckOption'+index">
         <span class="floorName" v-if="item.floorName">{{item.floorName}}</span>{{item.roomName}}</span>
      <span class="button" v-for="(item,index) in stationCheckOption" :key="'stationCheckOption'+index">
          <span class="floorName" v-if="item.floorName">{{item.floorName}}</span>{{item.stationName}}</span>
    </div>
    <BaseMessageBox title="房间绑定" :show.sync="floorShow">
      <div style="width: 400px">
        <el-select v-model="floorId_sc" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in floorOption" :key="item.floorId_sc" :label="item.floorName" :value="item.floorId_sc">
          </el-option>
        </el-select>
        <div style="width: 400px">
          <div style="height: 60px;line-height: 60px;background: #f0f4fa;margin: 15px -25px 15px -30px;padding:0 25px 0 30px">可选房间</div>
          <el-checkbox-group v-model="roomIds_sc_Fuben">
            <el-checkbox v-for="(item,index) in roomOption" :key="index" :label="item.roomId_sc" name="room">
              {{item.roomName}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div style="width: 400px">
          <div style="height: 60px;line-height: 60px;background: #f0f4fa;margin: 15px -25px 15px -30px;padding:0 25px 0 30px">可选工位</div>
          <el-checkbox-group v-model="stationIds_sc_Fuben">
            <el-checkbox v-for="(item,index) in stationOption" :key="index" :label="item.stationId_sc">
              {{item.stationName}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div style="text-align: center;margin-top: 30px">
        <el-button type="primary" @click="addStationListToDetail">保 存</el-button>
      </div>
    </BaseMessageBox>
  </div>
</template>

<script>
  //  userBoundRoomStationDetail  getStationByspaceId  用户
  //  contractBoundRoomStationDetail  getStationByCompanyId   合同
  //  employeeBoundRoomStationDetail  findEnableFloorRoomStationOfCompany  员工
  import BaseMessageBox from './../components/BaseMessageBox'

  export default {
    name:"FindFloorRoomStation",
    components:{BaseMessageBox},
    props:['roomIds_sc','stationIds_sc','spaceId_sc','startTime','overTime','companyId_sc','employee','employeeId_sc','userId_sc','contractBillId_sc'],
    data(){
      return {
        floorOption:[],
        stationListOption:[],
        roomListOption:[],
        floorId_sc:'',
        roomCheckOption:[],
        stationCheckOption:[],
        floorShow:false,
        roomIds_sc_Fuben:[],
        stationIds_sc_Fuben:[]
      }
    },
    created(){
      // if(!this.roomIds_sc){
      //   this.roomIds_sc_Fuben = []
      // }else{
      //   this.roomIds_sc_Fuben = Object.assign([],this.roomIds_sc);
      // }
      // if(!this.stationIds_sc){
      //   this.stationIds_sc_Fuben = []
      // }else{
      //   this.stationIds_sc_Fuben = Object.assign([],this.stationIds_sc)
      // }
      // 获取 用户 绑定
      if(this.userId_sc){
        this.userBoundRoomStationDetail()
      }
      // 获取 合同 绑定
      if(this.companyId_sc && !this.employee){
        this.contractBoundRoomStationDetail()
      }
      // 获取 公司 绑定
      if(this.employee && this.companyId_sc){
        this.findEnableFloorRoomStationOfCompany()
      }
      // 获取 员工 绑定
      if(this.employeeId_sc){
        this.employeeBoundRoomStationDetail()
      }
    },
    computed:{
      roomOption(){
        var ro = this.roomListOption.filter((f,i,fx) => {
          return this.floorId_sc === f.floorId_sc
        });
        if(ro){
          return ro
        }
        return []
      },stationOption(){
        var ro = this.stationListOption.filter((f,i,fx) => {
          return this.floorId_sc === f.floorId
        });
        if(ro){
          return ro
        }
        return []
      }
    },
    methods:{
      getStationByspaceId(){
        // 根据空间Id查找所在空间的所有楼层及可用房间工位数据
        this.$axios.get(process.env.API_HOST[1] + '/company/findFloorRoomStationBySpaceId',{
          params:{spaceId_sc:this.spaceId_sc,employeeId_sc:this.employeeId_sc,userId_sc:this.userId_sc}
        }).then(res => {
          if(res.data.success === true){
            this.floorOption = res.data.floorList_sc;
            this.stationListOption = res.data.stationList_sc ? res.data.stationList_sc : [];
            this.roomListOption = res.data.roomList_sc ? res.data.roomList_sc : [];
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },
      getStationByCompanyId(){
        // 根据合同账单开始结束日期和企业Id查找所属空间下所有楼层可用房间工位
        this.$axios.get(process.env.API_HOST[1] + '/companyContract/findFloorRoomStationOnContractManage',{
          params:{
            companyId_sc:this.companyId_sc,overTime:this.overTime,startTime:this.startTime
          }
        }).then(res => {
          if(res.data.success === true){
            this.floorOption = res.data.floorList_sc ? res.data.floorList_sc : [];
            this.stationListOption = res.data.stationList_sc ? res.data.stationList_sc : [];
            this.roomListOption = res.data.roomList_sc ? res.data.roomList_sc : [];
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },
      addStationListToDetail(){
        this.roomCheckOption = this.roomListOption.filter((f,i,fx) => {
          return this.roomIds_sc_Fuben.includes(f.roomId_sc)
        });
        this.stationCheckOption = this.stationListOption.filter((f,i,fx) => {
          return this.stationIds_sc_Fuben.includes(f.stationId_sc)
        });
        this.$emit('update:roomIds_sc',this.roomIds_sc_Fuben);
        this.$emit('update:stationIds_sc',this.stationIds_sc_Fuben);
        this.floorShow = false;
      },
      userBoundRoomStationDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/companyUser/userBoundRoomStationDetail',{
          params:{userId_sc:this.$route.query.userId_sc}
        }).then(res => {
          if(res.data.success === true){
            this.roomCheckOption = res.data.boundRoomList_sc ? res.data.boundRoomList_sc : [];
            this.stationCheckOption = res.data.boundStationList_sc ? res.data.boundStationList_sc : [];
            this.roomCheckOption.forEach((f,i,fx) => {
              this.roomIds_sc_Fuben.push(f.roomId_sc)
            });
            this.stationCheckOption.forEach((f,i,fx) => {
              this.stationIds_sc_Fuben.push(f.stationId_sc)
            });
            setTimeout(() => {
              this.$emit('update:roomIds_sc',this.roomIds_sc_Fuben);
              this.$emit('update:stationIds_sc',this.stationIds_sc_Fuben);
            },1000);
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },
      contractBoundRoomStationDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/companyContract/contractBoundRoomStationDetail',{
          params:{
            companyId_sc:this.companyId_sc
          }
        }).then(res => {
          if(res.data.success === true){
            // 合同
            this.roomCheckOption = res.data.boundRoomList_sc ? res.data.boundRoomList_sc : [];
            this.stationCheckOption = res.data.boundStationList_sc ? res.data.boundStationList_sc : [];
            this.roomCheckOption.forEach((f,i,fx) => {
              this.roomIds_sc_Fuben.push(f.roomId_sc)
            });
            this.stationCheckOption.forEach((f,i,fx) => {
              this.stationIds_sc_Fuben.push(f.stationId_sc)
            });
            setTimeout(() => {
              this.$emit('update:roomIds_sc',this.roomIds_sc_Fuben);
              this.$emit('update:stationIds_sc',this.stationIds_sc_Fuben);
            },0)
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },
      findEnableFloorRoomStationOfCompany(){
        this.$axios.get(process.env.API_HOST[1] + '/company/findEnableFloorRoomStationOfCompany',{
          params:{
            companyId_sc:this.companyId_sc,userId_sc:this.userId_sc,employeeId_sc:this.employeeId_sc
          }
        }).then(res => {
          if(res.data.success === true){
            this.floorOption = res.data.floorList_sc ? res.data.floorList_sc : [];
            this.stationListOption = res.data.stationList_sc ? res.data.stationList_sc : [];
            this.roomListOption = res.data.roomList_sc ? res.data.roomList_sc : [];
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },
      employeeBoundRoomStationDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/companyEmployee/employeeBoundRoomStationDetail',{
          params:{
            employeeId_sc:this.employeeId_sc
          }
        }).then(res => {
          if(res.data.success === true){
            // 合同
            this.roomCheckOption = res.data.boundRoomList_sc ? res.data.boundRoomList_sc : [];
            this.stationCheckOption = res.data.boundStationList_sc ? res.data.boundStationList_sc : [];
            this.roomCheckOption.forEach((f,i,fx) => {
              this.roomIds_sc_Fuben.push(f.roomId_sc)
            });
            this.stationCheckOption.forEach((f,i,fx) => {
              this.stationIds_sc_Fuben.push(f.stationId_sc)
            });
            setTimeout(() => {
              this.$emit('update:roomIds_sc',this.roomIds_sc_Fuben);
              this.$emit('update:stationIds_sc',this.stationIds_sc_Fuben);
            },0)
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      }
    },
    watch:{
      spaceId_sc:{
        handler(N,O){
          if(N){
            this.getStationByspaceId()
          }
        },immediate:true
      },startTime:{
        handler(N,O){
          if(N && this.overTime){
            this.getStationByCompanyId()
          }
        },immediate:true
      },overTime:{
        handler(N,O){
          if(N && this.startTime){
            this.getStationByCompanyId()
          }
        },immediate:true
      }
    }
  }
</script>

<style scoped lang="scss">
  .floorName {
    color: #ffffff;
    background: #88a3b9;
    display: inline-block;
    margin-left: -8px;
    padding: 0 5px;
    border-bottom-left-radius: 2px;
    border-top-left-radius: 2px;
    margin-right: 2px;
    height: 32px;
  }
</style>
