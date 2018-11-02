<template>
  <section>
    <BaseHeader :title="baseTitle" showbtn="false"></BaseHeader>
    <el-form :inline="true" :model="formInline" class="filter-form" size="mini">
      <el-form-item label="所属空间" prop="spaceId_sc">
        <BaseSpaceRoomSelect :spaceId_sc.sync="formInline.spaceId_sc" all="all"></BaseSpaceRoomSelect>
      </el-form-item>
      <el-form-item label="访客姓名" prop="guestName">
        <el-input v-model.trim="formInline.guestName" placeholder="请输入访客姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNo">
        <el-input v-model.trim="formInline.phoneNo" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="预约时间">
        <BaseDatePickerGroup @onChangeDate="handleChangeDate"></BaseDatePickerGroup>
      </el-form-item>
      <el-form-item label="访客类型" prop="guestType">
        <el-select v-model="formInline.guestType">
          <el-option label="全部" value=""></el-option>
          <el-option label="临时参观" :value="2"></el-option>
          <el-option label="预约参观" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0">
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
        prop="applyDate"
        label="申请时间"
        width="155">
      </el-table-column>
      <el-table-column
        prop="guestName"
        label="访客姓名"
        width="155">
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        width="100">
      </el-table-column>
      <el-table-column
        prop="phoneNo"
        label="联系电话"
        width="160">
      </el-table-column>
      <el-table-column
        prop="guestDate"
        label="来访时间"
        width="300">
      </el-table-column>
      <el-table-column
        prop="guestForUser"
        label="被访者姓名"
        width="120">
      </el-table-column>
      <el-table-column
        label="访客状态"
        width="120">
        <template slot-scope="scope">
          {{scope.row.status | filterStatus}}
        </template>
      </el-table-column>
      <el-table-column
        label="访客类型"
        width="120">
        <template slot-scope="scope">
          <!--1-预约参观，2-临时访客 ,-->
          {{scope.row.guestType === 1 ?'预约参观':'临时参观'}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">
            <img src="../assets/img/icon_chakan.png"/>
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
  </section>
</template>

<script>
  import BaseHeader from './../components/BaseHeader'
  import BaseSpaceRoomSelect from './../components/BaseSpaceRoomSelect'
  import BaseDatePickerGroup from './../components/BaseDatePickerGroup'
  import qs from 'query-string'

  export default {
    name:"operationVisit",data(){
      return {
        formInline:{
          guestName:'',   // 空间名称
          guestType:'',//1-预约参观，2-临时访客 ,
          overDate:'',startDate:'',phoneNo:'',spaceId_sc:'',pageSize:15,page:1
        },title:'添加',   //角色修改
        baseTitle:'访客参观',table:{},tableCellClassName:'tableCellClassName',tableHeaderClassName:'tableHeaderClassName',
      }
    },components:{
      BaseHeader,BaseSpaceRoomSelect,BaseDatePickerGroup
    },created(){
      // 请求列表数据
      this.getDataList();
    },methods:{
      handleChangeDate(val){
        this.formInline[val[0]] = val[1];
      },edit(item){
        this.$router.push('/home/operationVisit/detail?guestId_sc=' + item.guestId_sc)
      }, // 点击查询
      onSubmit(){
        this.formInline.page = 1;
        this.getDataList()
      }, // 点击某一页
      handleCurrentChange(){
        this.getDataList();
      }, // 获取列表
      getDataList(){
        this.$axios.post(process.env.API_HOST[1] + '/guest/list',this.formInline).then(res => {
          if(res.data.success === true){
            this.table = res.data;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },
    },filters:{
      filterStatus(val){
        // 0-拒绝，1-已确认，2-已到达，3-参观申请，4-未到达
        switch(val){
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
        }
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
