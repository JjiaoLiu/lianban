<template>
  <section>
    <BaseHeader :title="baseTitle" @emitHeaderButton="onHeaderButton"></BaseHeader>
    <el-form :inline="true" :model="formInline" class="filter-form" size="mini">
      <el-form-item label="所属空间">
        <BaseSpaceRoomSelect :spaceId_sc.sync="formInline.spaceId_sc" all="all"></BaseSpaceRoomSelect>
      </el-form-item>
      <el-form-item label="公共区名称">
        <el-input v-model.trim="formInline.areaName" placeholder="请输入公共区名称"></el-input>
      </el-form-item>
      <el-form-item label="公共区状态">
        <el-select v-model="formInline.enable">
          <el-option label="全部" value=""></el-option>
          <el-option label="有效" :value="1"></el-option>
          <el-option label="无效" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="价格范围">
        <div style="width: 300px">
          <el-input style="width: 140px" type="number" min="0" v-model.number="formInline.startPrice" placeholder="请输入价格"
          ></el-input>
          --
          <el-input style="width: 140px" type="number" min="0" v-model.number="formInline.overPrice" placeholder="请输入价格"
          ></el-input>
        </div>
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
        prop="areaCode"
        label="公共区编号"
        width="160">
      </el-table-column>
      <el-table-column
        prop="areaName"
        label="公共区名称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="spaceName"
        label="所属空间"
        width="200">
      </el-table-column>
      <el-table-column
        label="面积"
        prop="acreage"
        width="140">
        <template slot-scope="scope">
          {{scope.row.acreage}}平米
        </template>
      </el-table-column>
      <el-table-column
        label="限制人数"
        prop="peopleNum"
        width="120">
      </el-table-column>
      <el-table-column
        prop="price"
        label="单价"
        width="160">
        <template slot-scope="scope">
          {{scope.row.price}}元/半小时
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="100">
        <template slot-scope="scope">
          {{scope.row.enable === 1 ?'有效':'无效'}}
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
  </section>
</template>

<script>
  import BaseHeader from './../components/BaseHeader'
  import BaseSpaceRoomSelect from './../components/BaseSpaceRoomSelect'

  export default {
    name:"roomCommen",components:{
      BaseHeader,BaseSpaceRoomSelect
    },data(){
      return {
        formInline:{
          enable:'',spaceId_sc:'',pageSize:15,page:1
        },title:'添加',   //修改
        baseTitle:'公共区',table:{},tableCellClassName:'tableCellClassName',tableHeaderClassName:'tableHeaderClassName',
      }
    },created(){
      // 请求列表数据
      this.getDataList();
    },methods:{
      edit(item){
        this.$router.push('/home/roomCommen/add?areaId_sc=' + item.areaId_sc)
      }, // 点击查询
      onSubmit(){
        this.formInline.page = 1;
        this.getDataList()
      }, // 点击 顶部添加
      onHeaderButton(){
        this.$router.push('/home/roomCommen/add')
      }, // 点击某一页
      handleCurrentChange(){
        this.getDataList();
      }, // 获取列表
      getDataList(){
        this.$axios.post(process.env.API_HOST[1] + '/area/list',this.formInline).then(res => {
          if(res.data.success === true){
            this.table = res.data;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">

</style>
