<template>
  <section>
    <BaseHeader :title="baseTitle" @emitHeaderButton="toDetail"></BaseHeader>
    <TableEnterprise>
      <template slot-scope="slotProps">
        <el-button type="text" @click="toDetail(slotProps.scope.row)">
          <img src="../assets/img/icon_edit.png" height="16" width="14"/>
        </el-button>
      </template>
    </TableEnterprise>
  </section>
</template>

<script>
  import BaseHeader from './../components/BaseHeader'
  import TableEnterprise from './../components/TableEnterprise'

  export default {
    name:"enterpriseMng",data(){
      return {
        title:'添加',   //角色修改
        baseTitle:'企业',
      }
    },components:{
      BaseHeader,TableEnterprise
    },methods:{
      toDetail(){
        arguments.length ? this.$router.push('/home/enterpriseMng/edit?companyId_sc=' + arguments[0].companyId_sc) : this.$router.push('/home/enterpriseMng/edit')
      }
    },
  }
</script>

<style scoped lang="scss">

</style>
