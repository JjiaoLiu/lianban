<template>
  <el-select :value="spaceId_sc" placeholder="请选择空间" @change="change" filterable
             :multiple="multiple" :readOnly="readOnly" :disabled="disabled">
    <el-option label="全部空间" value="" v-if="all"></el-option>
    <el-option
      v-for="item in space_list"
      :key="item.spaceId_sc"
      :label="item.spaceName"
      :value="item.spaceId_sc">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    name:"BaseSpaceRoomSelect",props:['multiple','spaceId_sc','cityCode','all','readOnly','disabled'],data(){
      return {
        space_list:[]
      }
    },created(){
      this.getSpace()
    },methods:{
      getSpace(){
        this.$axios.get(process.env.API_HOST[1] + '/comm/spacelist',{params:{cityCode:this.cityCode}}).then(res => {
          if(res.data.success === true){
            this.space_list = res.data.list_sc;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },change(val){
        this.$emit('update:spaceId_sc',val);
      },
    },watch:{
      cityCode(N,O){
        this.getSpace()
      }
    }
  }
</script>

<style scoped>

</style>
