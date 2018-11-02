<template>
  <div style="display: inline-block;width: 286px">
    <el-date-picker
      style="width: 136px"
      v-model="startDate"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      @change="change('startDate')"
      type="date"
      placeholder="选择日期"
      :picker-options="pickerOptions1">
    </el-date-picker>
    -
    <el-date-picker
      v-model="overDate"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      style="width: 136px"
      @change="change('overDate')"
      type="date"
      placeholder="选择日期"
      :picker-options="pickerOptions2">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    name:"BaseDatePickerGroup",props:['startFirst','typeStart','typeEnd'],//开始时间未输入的情况无法输入结束时间
    data(){
      var _this = this;
      return {
        startDate:'',overDate:'',pickerOptions1:{
          disabledDate(time){
            if(_this.overDate){
              return time > (new Date(_this.overDate)).getTime()
            }
            return false
          }
        },pickerOptions2:{
          disabledDate(time){
            if(_this.startFirst && !_this.startDate){
              return true
            }
            return (new Date(_this.startDate)).getTime() > (time.getTime() + 60 * 60 * 24 * 1000)
          }
        },
      }
    },methods:{
      change(arg){
        if(arg === 'startDate' && this.typeStart){
          this.$emit('onChangeDate',[this.typeStart,this.startDate]);
        }
        if(arg === 'overDate' && this.typeEnd){
          this.$emit('onChangeDate',[this.typeEnd,this.overDate])
        }
        if(arg === 'startDate' && !this.typeStart){
          this.$emit('onChangeDate',[arg,this.startDate]);
        }
        if(arg === 'overDate' && !this.typeEnd){
          this.$emit('onChangeDate',[arg,this.overDate])
        }
      }
    },
  }
</script>

<style scoped>

</style>
