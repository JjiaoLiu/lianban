<template>
  <el-select
    :value="bankId_sc"
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
      :label="item.bankName"
      :value="item.bankId_sc">
    </el-option>
  </el-select>
</template>

<script>

  export default {
    name: "SearchBankByName", props: ['bankId_sc'], data() {
      return {
        option: [], loading: false
      }
    }, created() {
      this.remoteMethod("")
    }, methods: {
      remoteMethod(query) {
        this.loading = true;
        this.getList(query)
      }, change(val) {
        this.$emit('update:bankId_sc', val);
      }, getList(query) {
        this.$axios.get(process.env.API_HOST[1] + '/company/fuzzySearchBankByName?bankName=' + query).then(res => {
          if (res.status === 200 && res.data.success === true) {
            if (res.data.fuzzySearchBankList_sc) {
              this.option = res.data.fuzzySearchBankList_sc;
            } else {
              this.option = [];
            }
            this.loading = false
          }else {
            this.$message.warning(res.data.msg)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
