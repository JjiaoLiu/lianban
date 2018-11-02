<template>
  <div class="section">
    <div class="total-box">
      <span>{{baseTitle}}总数：<b>{{table.total}}</b></span>
    </div>
    <el-table
      stripe
      :data="table.list_sc"
      :cell-class-name="tableCellClassName"
      :header-cell-class-name="tableHeaderClassName"
      @cell-click="handleMouseEnter"
      style="width: 100%">
      <el-table-column
        prop="positionName"
        label="名称"
        width="155">
      </el-table-column>
      <el-table-column
        prop="adLink"
        label="对应URL"
        width="500">
      </el-table-column>
      <el-table-column
        prop="imageUrl"
        label="图片地址"
        width="500">
        <template slot-scope="scope">
          <span style="cursor: pointer">{{scope.row.imageUrl}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="80">
        <template slot-scope="scope">
          {{scope.row.enable === 1 ?'有效':'无效'}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type='text' @click="edit(scope.row)" v-if="enable">
            <img src="../assets/img/icon_edit.png" height="16" width="14"/>
          </el-button>
          <el-button type='text' @click="toenable(scope.row,0)" v-if="enable">
            <img src="../assets/img/icon_delete.png" height="16" width="16"/>
          </el-button>
          <el-button type='text' @click="toenable(scope.row,1)" v-if="!enable">
            <img src="../assets/img/icon_delete_back.png" height="20" width="22"/>
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
    <el-dialog
      :visible.sync="centerDialogVisible"
      style="text-align: center">
      <img :src="src">
    </el-dialog>
  </div>
</template>

<script>
  import {Bus} from "../bus";

  export default {
    name:"TableAdv",props:['enable','keyWord'],data(){
      return {
        baseTitle:'广告位',tableCellClassName:'tableCellClassName',tableHeaderClassName:'tableHeaderClassName',formInline:{
          page:1,pageSize:15,enable:this.enable,keyWord:''
        },centerDialogVisible:false,src:'',table:{}
      }
    },created(){
      if(this.enable){
        Bus.$on('getAdvList',() => {
          this.getDataList()
        });
      }
      this.getDataList()
    },methods:{
      handleCurrentChange(val){
        this.formInline.page = 1;
        this.getDataList()
      },handleMouseEnter(row,column,cell,event){
        if(column.property === 'imageUrl'){
          this.src = row.imageUrl;
          this.centerDialogVisible = true;
        }
      },// 删除 恢复 角色  1-恢复，0-删除
      toenable(row,enable){
        let type = enable === 0 ? '删除' : '还原';
        let string = enable === 0 ? `您确认要将此${this.baseTitle}删除并放入回收站吗` : `您确认要将此${this.baseTitle}还原吗`;
        this.$confirm(string,'提示',{
          confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
        }).then(() => {
          this.$axios.post(process.env.API_HOST[1] + '/ad/enable?adId_sc=' + row.adId_sc + '&enable=' + enable).then(res => {
            if(res.data.success === true){
              this.getDataList();
              this.$message({
                type:'success',message:`${type}成功!`
              });
            }else{
              this.$message.warning(res.data.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type:'info',message:'已取消操作'
          });
        });
      },getDataList(){
        this.$axios.post(process.env.API_HOST[1] + '/ad/list',this.formInline).then(res => {
          if(res.data.success === true){
            this.table = res.data;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },edit(item){
        this.$router.push('/home/operationAdv/add?adId_sc=' + item.adId_sc)
      },
    },watch:{
      keyWord(O,N){
        this.formInline.keyWord = O
      }
    }
  }
</script>

<style scoped>

</style>
