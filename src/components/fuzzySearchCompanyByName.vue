<template>
  <el-select
    :value="employeeId_sc"
    filterable
    size="small"
    remote
    reserve-keyword
    placeholder="请输入"
    :remote-method="remoteMethod"
    @change="change"
    :loading="loading">
    <el-option
      v-for="(item,index) in option"
      :key="index"
      :label="item.employeeName"
      :value="item.employeeId_sc">
    </el-option>
  </el-select>
</template>

<script>

  export default {
    name:"fuzzySearchCompanyByName",props:['employeeId_sc','companyId_sc','employeeName'],data(){
      return {
        option:[],loading:false
      }
    },created(){
      setTimeout(() => {
        this.getList(this.employeeName);
      },100)
    },methods:{
      remoteMethod(query){
        if(query !== ''){
          this.loading = true;
          this.getList(query)
        }
      },change(val){
        this.$emit('update:employeeId_sc',val);
      },getList(query){
        this.$axios.get(process.env.API_HOST[1] + '/companyEmployee/fuzzySearchEmployeeByName?companyId_sc=' + this.companyId_sc + '&employeeName=' + query).then(res => {
          if(res.data.success === true){
            if(res.data.fuzzySearchEmployeeList_sc){
              this.option = res.data.fuzzySearchEmployeeList_sc;
            }else{
              this.option = [];
            }
            this.loading = false
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
