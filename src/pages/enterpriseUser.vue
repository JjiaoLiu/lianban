<template>
  <section>
    <BaseHeader :title="baseTitle" @emitHeaderButton="onHeaderButton"></BaseHeader>
    <el-form :inline="true" :model="formInline" class="filter-form" size="mini">
      <el-form-item label="所属空间">
        <BaseSpaceRoomSelect :spaceId_sc.sync="formInline.spaceId_sc" all="all"/>
      </el-form-item>
      <el-form-item label="企业名称">
        <el-input v-model.trim="formInline.companyFullName" placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model.trim="formInline.realName" placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model.trim="formInline.cellphone" placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户状态">
        <el-select v-model="formInline.enable" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="有效" :value="1"></el-option>
          <el-option label="失效" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
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
        prop="createTime"
        label="注册时间"
        :formatter="formatterTime"
        width="200">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="姓名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        width="150">
        <template slot-scope="scope">
          {{scope.row.gender == 1 ? '男' : scope.row.gender == 0 ? '女': ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="cellphone"
        label="手机号"
        width="200">
      </el-table-column>
      <el-table-column
        prop="companyFullName"
        label="企业名称"
        width="340">
      </el-table-column>
      <el-table-column
        label="状态"
        width="120">
        <template slot-scope="scope">
          {{scope.row.enable === 1 ? '有效' : '无效'}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row,'')"><img src="../assets/img/icon_chakan.png"/></el-button>
          <el-button type="text" @click="edit(scope.row,'editable')"><img src="../assets/img/icon_edit.png" height="16" width="14"/></el-button>
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
    name:"enterpriseUser",data(){
      return {
        formInline:{
          companyFullName:'',realName:'',spaceId_sc:'',cellphone:'',enable:'',page:1,pageSize:15
        },title:'添加',   //角色修改
        table:{},baseTitle:'用户',tableCellClassName:'tableCellClassName',tableHeaderClassName:'tableHeaderClassName',
      }
    },components:{
      BaseHeader,BaseDatePickerGroup,BaseSpaceRoomSelect
    },created(){
      // 请求列表数据
      this.getDataList();
    },methods:{
      handleChangeDate(val){
        this.formInline[val[0]] = val[1];
      },edit(item,editable){
        this.$router.push({
          name:'enterpriseUserDetail',query:{
            userId_sc:item.userId_sc,companyId_sc:item.companyId_sc,editable:editable
          }
        })
      }, // 点击查询
      onSubmit(){
        this.formInline.page = 1;
        this.getDataList()
      }, // 点击 顶部添加
      onHeaderButton(){
        this.$router.push({
          name:'enterpriseUserDetail',query:{
            editable:'editable'
          }
        })
      }, // 点击某一页
      handleCurrentChange(){
        this.getDataList();
      }, // 获取列表
      getDataList(){
        this.$axios.get(process.env.API_HOST[1] + '/companyUser/list',{
          params:this.formInline
        }).then(res => {
          if(res.data.success === true){
            this.table = res.data;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },formatterTime(v){
        var date = new Date(v.createTime);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        return Y + M + D;
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
