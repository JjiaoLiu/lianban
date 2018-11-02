<template>
  <el-select
    :value="bankId_sc"
    filterable
    size="small"
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    @change="change"
    :loading="loading">
    <el-option
      v-for="item in bankList"
      :key="item.bankId_sc"
      :label="item.bankName"
      :value="item.bankId_sc">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    name:"BaseBankSelect",props:['bankId_sc','bankName'],data(){
      return {
        loading:false,bankList:[]
      }
    },created(){
      this.remoteMethod(this.bankName);
    },methods:{
      remoteMethod(query){
        // GET /company/fuzzySearchBankByName
        if(query !== ''){
          this.loading = true;
          this.$axios.get(process.env.API_HOST[1] + '/company/fuzzySearchBankByName',{
            params:{name:query}
          }).then(res => {
            if(res.data.success === true){
              this.loading = false;
              this.bankList = res.data.fuzzySearchBankList_sc;
            }else{
              this.$message.warning(res.data.msg)
            }
          });
        }
      },change(val){
        this.$emit('update:bankId_sc',val);
        this.$emit('update:bankName',val);
      }
    },
  }
</script>

<style scoped>

</style>
