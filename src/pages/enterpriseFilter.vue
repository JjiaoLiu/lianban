<template>
  <section>
    <BaseHeader :title="baseTitle" showbtn="showbtn"></BaseHeader>
    <TableEnterprise>
      <template slot-scope="slotProps">
        <el-button type="text" @click="toDetail(slotProps.scope.row)">
          <img src="../assets/img/icon_chakan.png"/>
        </el-button>
      </template>
    </TableEnterprise>
  </section>
</template>

<script>
  import BaseHeader from './../components/BaseHeader'
  import TableEnterprise from './../components/TableEnterprise'

  export default {
    name:"enterpriseFilter",data(){
      return {
        baseTitle:'企业查询',
      }
    },components:{
      BaseHeader,TableEnterprise
    },methods:{
      toDetail(item){
        this.$router.push('/home/enterpriseFilter/detail?companyId_sc=' + item.companyId_sc)
      },
    },
  }
</script>

<style scoped lang="scss">

</style>
