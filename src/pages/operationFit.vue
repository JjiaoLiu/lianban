<template>
  <section>
    <BaseHeader :title="baseTitle" showbtn="showbtn"></BaseHeader>
    <el-form :inline="true" :model="formInline" class="filter-form" size="mini">
      <el-form-item label="所属空间">
        <BaseSpaceRoomSelect :spaceId_sc.sync="formInline.spaceId_sc" all="all"/>
      </el-form-item>
      <el-form-item label="报修时间">
        <BaseDatePickerGroup @onChangeDate="handleChangeDate"></BaseDatePickerGroup>
      </el-form-item>
      <el-form-item label="报修状态">
        <el-select v-model="formInline.status" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="待处理" value="1"></el-option>
          <el-option label="处理中" value="3"></el-option>
          <el-option label="已处理" value="2"></el-option>
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
        prop="feedBackDate"
        label="报修时间"
        width="160">
      </el-table-column>
      <el-table-column
        prop="roomStation"
        label="房间号/工位号"
        width="260">
      </el-table-column>
      <el-table-column
        prop="content"
        label="报修内容"
        width="500">
      </el-table-column>
      <el-table-column
        :formatter="formatterStatus"
        label="状态"
        width="120">
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
  </section>
</template>

<script>
  import BaseHeader from './../components/BaseHeader'
  import BaseDatePickerGroup from './../components/BaseDatePickerGroup'
  import BaseSpaceRoomSelect from './../components/BaseSpaceRoomSelect'

  export default {
    name:"operationFit",data(){
      return {
        formInline:{
          startDate:'',overDate:'',spaceId_sc:'',status:'',pageSize:15,page:1
        },title:'添加',   //角色修改
        baseTitle:'报修',table:{},tableCellClassName:'tableCellClassName',tableHeaderClassName:'tableHeaderClassName',
      }
    },components:{
      BaseHeader,BaseDatePickerGroup,BaseSpaceRoomSelect
    },created(){
      // 请求列表数据
      this.getDataList();
    },methods:{
      handleChangeDate(val){
        this.formInline[val[0]] = val[1];
      },edit(item){
        this.$router.push('/home/operationFit/deal?feedBackId_sc=' + item.feedBackId_sc)
      }, // 点击查询
      onSubmit(){
        this.formInline.page = 1;
        this.getDataList()
      }, // 点击 顶部添加
      onHeaderButton(){
      }, // 点击某一页
      handleCurrentChange(){
        this.getDataList();
      }, // 获取列表
      getDataList(){
        this.$axios.post(process.env.API_HOST[1] + '/feedback/list',this.formInline).then(res => {
          if(res.data.success === true){
            this.table = res.data;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },formatterStatus(row){
        // 1-等待处理，2-已处理，3-已取消，4-处理中
        switch(row.status){
          case 1:
            return '待处理';
            break;
          case 2:
            return '已处理';
            break;
          case 3:
            return '已取消';
            break;
          case 4:
            return '处理中';
            break;
          default:
            break;

        }
      }
    },
  }
</script>

<style scoped lang="scss">

</style>
