<template>
  <!--市-->
  <el-select :value="cityCode" placeholder="请选择" @change="change" filterable>
    <el-option value="" label="全部" v-if="all"></el-option>
    <el-option
      v-for="city in cityOption"
      :key="city.code"
      :label="city.region"
      :value="city.code">
    </el-option>
  </el-select>
</template>

<script>
  import {city} from './../assets/js/city'

  export default {
    name: "BaseCitySelect", props: ['cityCode', 'all', 'cityName'], data() {
      return {
        cityOption: city,
      }
    }, methods: {
      change(val) {
        this.$emit('update:cityCode', val);
      }
    },
  }
</script>

<style scoped>

</style>
