<template>
  <section>
    <BaseHeader :title="baseTitle" @emitHeaderButton="onHeaderButton"></BaseHeader>
    <el-form :inline="true" :model="formInline" class="filter-form" size="mini">
      <el-form-item label="所属空间">
        <BaseSpaceRoomSelect :spaceId_sc.sync="formInline.spaceId_sc" all="all"/>
      </el-form-item>
      <el-form-item label="设备编号">
        <el-input v-model.trim="formInline.equipCode" placeholder="请输入设备编号"></el-input>
      </el-form-item>
      <el-form-item label="设备类型">
        <!--1-门禁开关，2-电源开关，3-电灯开关，4-空调开关 ,-->
        <el-select v-model="formInline.equipType">
          <el-option label="全部" value=""></el-option>
          <el-option label="门禁开关" :value="1"></el-option>
          <el-option label="电源开关" :value="2"></el-option>
          <el-option label="电灯开关" :value="3"></el-option>
          <el-option label="空调开关" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运行状态">
        <!--0-异常，1-正常，2-常开，3-常关-->
        <el-select v-model="formInline.status">
          <el-option label="全部" value=""></el-option>
          <el-option label="异常" :value="0"></el-option>
          <el-option label="正常" :value="1"></el-option>
          <el-option label="常开" :value="2"></el-option>
          <el-option label="常关" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备状态">
        <!--0-闲置中，1-占用中 ,-->
        <el-select v-model="formInline.roomStatus">
          <el-option label="全部" value=""></el-option>
          <el-option label="闲置中" :value="0"></el-option>
          <el-option label="占用中" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="total-box">
      <span>{{baseTitle}}总数：<b>{{table.total}}</b></span>
    </div>
    <el-table
      stripe
      :data="table.list_sc"
      :cell-class-name="tableCellClassName"
      :header-cell-class-name="tableHeaderClassName"
      style="width: 100%">
      <el-table-column
        prop="equipCode"
        label="设备唯一编号"
        width="260">
      </el-table-column>
      <el-table-column
        prop="title"
        label="设备类型"
        :formatter="formatterEquipType"
        width="160">
      </el-table-column>
      <el-table-column
        label="所属空间"
        prop="spaceName"
        width="160">
      </el-table-column>
      <el-table-column
        prop="floorName"
        label="所在楼层"
        width="160">
      </el-table-column>
      <el-table-column
        prop="status"
        :formatter="formatterStatus"
        label="运行状态"
        width="120">
      </el-table-column>
      <el-table-column
        label="状态"
        width="120">
        <template slot-scope="scope">
          {{scope.row.enable === 1 ? "有效" : "无效"}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">
            <img src="../assets/img/icon_edit.png" height="16" width="14"/>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="formInline.page"
        :page-size="formInline.pageSize"
        layout="prev, pager, next"
        :total="table.total">
      </el-pagination>
    </div>
    <BaseMessageBox :title="baseTitle+title" :show.sync="showEditBox">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px" label-position="left">
        <el-form-item label="设备唯一编号" prop="equipCode">
          <el-input v-model.trim="addForm.equipCode" size="small" style="width: 560px"
                    placeholder="请输入设备唯一编号"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="equipType">
          <!--1-门禁开关，2-电源开关，3-电灯开关，4-空调开关 ,-->
          <el-select v-model="addForm.equipType" placeholder="请选择设备类型" size="small" style="width: 560px">
            <el-option label="门禁开关" :value="1"></el-option>
            <el-option label="电源开关" :value="2"></el-option>
            <el-option label="电灯开关" :value="3"></el-option>
            <el-option label="空调开关" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属空间" prop="spaceId_sc">
          <BaseSpaceRoomSelect :spaceId_sc.sync="addForm.spaceId_sc" size="small" style="width: 560px"/>
        </el-form-item>
        <el-form-item label="所在楼层" prop="floorId_sc">
          <BaseFloorSelect :spaceId_sc="addForm.spaceId_sc" :floorId_sc.sync="addForm.floorId_sc" size="small"
                           style="width: 560px"/>
        </el-form-item>
        <el-form-item label="设备状态" prop="enable">
          <el-radio v-model="addForm.enable" :label="1">有效</el-radio>
          <el-radio v-model="addForm.enable" :label="0">无效</el-radio>
        </el-form-item>
        <el-form-item label="设备操作" v-if="addForm.status != undefined">
          当前状态:{{addForm.status | filterStatus}} &nbsp;&nbsp;&nbsp;&nbsp;
          <el-button @click="debugEq(1,)">常开</el-button>
          <el-button @click="debugEq(2)">常关</el-button>
          <el-button @click="debugEq(3)">初始化</el-button>
          <el-button @click="debugEq(4)">设备自检</el-button>
        </el-form-item>
        <el-form-item align="center" style="margin-top: 300px">
          <el-button type="primary" size="small" style="font-size: 20px;width: 140px" @click="submitForm('addForm')">
            {{title}}
          </el-button>
        </el-form-item>
      </el-form>
    </BaseMessageBox>
  </section>
</template>

<script>
  import BaseHeader from './../components/BaseHeader'
  import BaseMessageBox from './../components/BaseMessageBox'
  import BaseSpaceRoomSelect from './../components/BaseSpaceRoomSelect'
  import BaseFloorSelect from './../components/BaseFloorSelect'

  export default {
    name:"equipmentMng",data(){
      return {
        title:'添加',baseTitle:'设备',table:{},showEditBox:false,    // 显示编辑模态框
        tableCellClassName:'tableCellClassName',tableHeaderClassName:'tableHeaderClassName',addForm:{
          enable:0,spaceId_sc:'',floorId_sc:'',equipType:'',equipCode:''
        },formInline:{
          equipType:'',status:'',roomStatus:'',pageSize:15,page:1,spaceId_sc:""
        },rules:{
          equipCode:[{required:true,message:'×请输入设备编号',trigger:'blur'},],
          equipType:[{required:true,message:'×请选择设备类型',trigger:'change'},],
          spaceId_sc:[{required:true,message:'×请选择所属空间',trigger:'change'}],
          floorId_sc:[{required:true,message:'×请选择所属楼层',trigger:'change'},]
        }, //0-异常，1-正常，2-常开，3-常关 ,
        statusOption:[{name:'异常',value:0},{name:'正常',value:1},{name:'常开',value:2},{name:'常关',value:3}]
      }
    },components:{
      BaseHeader,BaseMessageBox,BaseSpaceRoomSelect,BaseFloorSelect
    },created(){
      // 请求列表数据
      this.getDataList();
    },methods:{
      onSubmit(){
        this.formInline.page = 1;
        this.getDataList()
      },handleCurrentChange(val){
        this.getDataList();
      },onHeaderButton(){ // 显示增加角色
        this.title = '添加';
        this.$refs['addForm'].resetFields();
        this.showEditBox = true
      }, // 添加 编辑
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$confirm(`你确认${this.title}此${this.baseTitle}吗`,'提示',{
              confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
            }).then(() => {
              this.save();
            }).catch(() => {
              this.$message.info('已取消操作');
              this.showEditBox = false;
            });
          }else{
            return false
          }
        });
      }, // 点击编辑，获取当前详情
      edit(row){
        this.title = '修改';
        this.$axios.get(process.env.API_HOST[1] + '/equip/detail',{
          params:{
            equipId_sc:row.equipId_sc
          }
        }).then(res => {
          if(res.data.success === true){
            this.addForm = res.data;
            this.showEditBox = true;
            setTimeout(() => {
              this.$refs['addForm'].clearValidate()
            },0)
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },getDataList(){
        this.$axios.post(process.env.API_HOST[1] + '/equip/list',this.formInline).then(res => {
          if(res.data.success === true){
            this.table = res.data;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },save(){
        this.$axios.post(process.env.API_HOST[1] + '/equip/save',this.addForm).then(res => {
          if(res.data.success === true){
            this.showEditBox = false;
            this.$refs['addForm'].resetFields();
            this.formInline.page = 1;
            this.getDataList();
            this.$message.success(this.title + "成功");
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },debugEq(t){
        this.$axios.get(process.env.API_HOST[1] + '/equip/debug',{
          params:{
            equipId_sc:this.addForm.equipId_sc,type:t
          }
        }).then(res => {
          if(res.data.success === true){
            this.addForm.status = res.data.status;
            if(t != 4){
              this.$message('设备已设置为' + this.statusOption[this.addForm.status].name)
            }else{
              this.$message('设备自检：' + this.statusOption[this.addForm.status].name)
            }
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },formatterStatus(row){
        switch(row.status){
          // 0-异常，1-正常，2-常开，3-常关
          case 0:
            return '异常';
            break;
          case 1:
            return '正常';
            break;
          case 2:
            return '常开';
            break;
          case 3:
            return '常关';
            break;
          default:
            break
        }
      },formatterEquipType(row){
        switch(row.equipType){
          // 1-门禁开关，2-电源开关，3-电灯开关，4-空调开关 ,
          case 1:
            return '门禁开关';
            break;
          case 2:
            return '电源开关';
            break;
          case 3:
            return '电灯开关';
            break;
          case 4:
            return '空调开关';
            break;
          default:
            break
        }
      },
    },filters:{
      filterStatus(v){
        switch(v){
          case 0:
            return '异常';
            break;
          case 1:
            return '正常';
            break;
          case 2:
            return '常开';
            break;
          case 3:
            return '常关';
            break;
          default:
            break
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "./../assets/mixin/all";

  .inner-mask {
    width: 695px;
    right: 0;
    bottom: 0;
    top: 0;
    position: fixed;
    background: rgba(0, 0, 0, .5);
    z-index: 667;
    .inner-message {
      width: 490px;
      position: fixed;
      right: 0;
      bottom: 0;
      top: 0;
      padding: 15px 0;
      background: #ffffff;
      .title {
        text-align: right;
        padding-right: 20px;
      }
      .sec-title {
        font-size: 20px;
        padding: 20px;
      }
      .sec-main {
        border-bottom: 1px solid #beccd7;
        padding: 10px 20px 0 20px;
      }
    }
  }
</style>
