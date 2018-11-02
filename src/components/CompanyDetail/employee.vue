<template>
  <div>
    <div class="header">
      <div>
        企业用户&nbsp;&nbsp;&nbsp;&nbsp;<small>
        <small>员工总数{{table.total}}</small>
      </small>&nbsp;&nbsp;&nbsp;&nbsp;
        <button @click="onHeaderButton" type="button" v-if="!disabled" class="topButton">
          <img src="./../../assets/img/icon_add.png" height="20" width="20"/>&nbsp;&nbsp;添加
        </button>
      </div>
      <el-form :inline="true" :model="formInline" size="mini" style="vertical-align: bottom">
        <el-form-item label="员工状态" prop="status">
          <el-select v-model="formInline.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="在职" :value="1"></el-option>
            <el-option label="离职" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <label for="file">
            <span
              style="font-size: 14px;display: inline-block;border: 1px solid #d6d6d6;background: #ffffff;border-radius: 4px;padding: 4px 8px;line-height: 1;vertical-align: middle;cursor: pointer">
              <img src="../../assets/img/icon_import.png" height="16" width="17" style="vertical-align: middle"/>&nbsp;&nbsp;导入
            </span>
        </label>
        <input :disabled="!table.allowAddEmp" @change="importEmployeeExcel($event)" type="file" id="file"
               accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" style="display: none"/>
        <el-button type="primary" size="mini" style="vertical-align: middle;margin-left: 16px" @click="getexportEmployeeTemplate">
          下载模板<i class="el-icon-download el-icon--right"></i>
        </el-button>
      </el-form>
    </div>
    <br>
    <div style="padding: 20px 40px" v-if="!table.allowAddEmp">
      <small>提示：{{table.allowAddEmpInfo}}</small>
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
        width="160">
      </el-table-column>
      <el-table-column
        prop="employeeName"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        label="性别"
        width="160">
        <template slot-scope="scope">
          {{scope.row.gender == 1 ? '男' : scope.row.gender == 0 ? '女' : ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="phoneNo"
        label="手机号"
        width="160">
      </el-table-column>
      <el-table-column
        prop="idCard"
        label="身份证号"
        width="200">
      </el-table-column>
      <el-table-column
        label="状态"
        width="120">
        <template slot-scope="scope">
          {{scope.row.status === 1 ? '在职' : '离职'}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">
            <img src="../../assets/img/icon_edit.png">
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
  </div>
</template>

<script>
  export default {
    name:"employee",props:['disabled'],data(){
      return {
        formInline:{page:1,pageSize:15},
        table:{},
        tableCellClassName:'tableCellClassName',
        tableHeaderClassName:'tableHeaderClassName',
        companyId_sc:this.$route.query.companyId_sc || localStorage.getItem('companyId_sc')
      }
    },created(){
      this.getDataList();
    },methods:{
      edit(item){
        this.$router.push({
          'name':'employeeAdd',query:{
            employeeId_sc:item.employeeId_sc,companyId_sc:item.companyId_sc,
          }
        })
      }, // 点击查询
      onSubmit(){
        this.formInline.page = 1;
        this.getDataList()
      }, // 点击 顶部添加
      onHeaderButton(){
        if(this.table.allowAddEmp){
          this.$router.push('/home/employee/add?companyId_sc=' + this.companyId_sc)
        }else{
          this.$alert(this.table.allowAddEmpInfo,'提示',{
            confirmButtonText:'确定',callback:action => {
              return false
            }
          });
        }
      },// 点击某一页
      handleCurrentChange(){
        this.getDataList();
      }, // 获取列表
      getDataList(){
        this.$axios.get(process.env.API_HOST[1] + '/companyEmployee/list?companyId_sc=' + this.companyId_sc,{
          params:this.formInline
        }).then(res => {
          if(res.data.success === true){
            this.table = res.data;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },importEmployeeExcel($event){
        let formData = new FormData();
        formData.append('file',$event.srcElement.files[0]);
        this.$axios.post(process.env.API_HOST[1] + '/companyEmployee/importEmployeeExcel?companyId_sc=' + this.companyId_sc,formData).then(res => {
          if(res.data.success === true){
            this.formInline.page = 1;
            this.getDataList();
            if(res.data.result.errorMsg){
              const h = this.$createElement;
              this.$msgbox({
                title:'提示',message:h('p',res.data.result.importMsg + res.data.result.errorMsg),confirmButtonText:'确定'
              })
            }
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },getexportEmployeeTemplate(){
        var newTab = window.open('about:blank');
        this.$axios.get(process.env.API_HOST[1] + '/companyEmployee/exportEmployeeTemplate',{responseType:'arraybuffer'}).then(res => {
          let url = new Uint8Array(res.data).reduce((data,byte) => data + String.fromCharCode(byte),'');
          newTab.location.href = '//' + url;
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .header {
    background: #f0f4fa;
    padding: 17px 40px;
    line-height: 36px;
    height: 70px;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .topButton {
    font-size: 20px;
    height: 36px;
    line-height: 36px;
    padding: 0 15px;
    text-align: center;
    background: #ff9000;
    color: #ffffff;
    border-radius: 4px;
    img {
      vertical-align: middle;
      margin-top: -3px;
    }
  }

  .header .el-form-item--mini.el-form-item {
    margin-bottom: 0;
  }

</style>
