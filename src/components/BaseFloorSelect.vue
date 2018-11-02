<template>
  <el-select :value="floorId_sc" placeholder="请选择楼层" @change="change">
    <el-option
      v-for="item in floorOption"
      :key="item.floorId_sc"
      :label="item.floorName"
      :value="item.floorId_sc">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    name:"BaseFloorSelect",props:['spaceId_sc','floorId_sc'],data(){
      return {
        floorOption:[]
      }
    },methods:{
      change(val){
        this.$emit('update:floorId_sc',val)
      }
    },created(){
    },watch:{
      spaceId_sc:{
        handler(N,O){
          if(N){
            this.$axios.get(process.env.API_HOST[1] + '/comm/floorlist',{params:{spaceId_sc:this.spaceId_sc}}).then(res => {
              if(res.data.success === true){
                this.floorOption = res.data.list_sc;
              }else{
                this.$message.warning(res.data.msg)
              }
            })
          }
        },immediate:true
      }
    }
  }
</script>

<style scoped>

</style>
