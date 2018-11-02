<template>
  <el-select :value="departmentId_sc" @change="change" size="small">
    <el-option
      v-for="item in dept_list"
      :key="item.id_sc"
      :label="item.departmentValue"
      :value="item.id_sc">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    name:"BaseDepartmentSelect",props:['departmentId_sc'],data(){
      return {
        dept_list:[]
      }
    },created(){
      this.getDept(false)
    },methods:{
      getDept(role){
        this.$axios.get(process.env.API_HOST[0] + '/dept/list',{
          params:{role:role}
        }).then(res => {
          if(res.data.success === true){
            this.dept_list = res.data.list_sc;
            this.dept_list.unshift({departmentValue:"请选择部门"})
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },change(val){
        this.$emit('update:departmentId_sc',val)
      }
    }
  }
</script>

<style scoped>

</style>
