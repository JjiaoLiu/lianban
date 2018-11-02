<template>
  <el-select
    :value="companyFullName"
    filterable
    size="small"
    remote
    reserve-keyword
    placeholder="请输入"
    :remote-method="remoteMethod"
    @change="change"
    :loading="loading">
    <el-option
      v-for="item in company"
      :key="item.companyId_sc"
      :label="item.companyFullName"
      :value="item.companyId_sc">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    name:"BaseCompanySelect",props:['companyFullName','companyId_sc'],data(){
      return {
        loading:false,company:[]
      }
    },methods:{
      remoteMethod(query){
        if(query !== ''){
          this.loading = true;
          this.$axios.get(process.env.API_HOST[1] + '/company/fuzzySearchCompanyByName',{
            params:{companyFullName:query,companyId_sc:this.companyId_sc}
          }).then(res => {
            if(res.data.success === true){
              this.loading = false;
              this.company = res.data.fuzzySearchCompanyList_sc;
            }else{
              this.$message.warning(res.data.msg)
            }
          });
        }
      },change(val){
        this.$emit('update:companyId_sc',val);
        this.$emit('update:companyFullName',val);
      }
    },watch:{
      user_name:{
        handler(newV,old){
          if(newV && !old){
            this.remoteMethod(newV)
          }
        },immediate:true
      }
    }
  }
</script>

<style scoped>

</style>
