<template>
  <!--区-->
  <el-select :value="districtCode" placeholder="请选择" @change="changeDistrictCode">
    <el-option
      v-for="city in districtOption"
      :key="city.code"
      :label="city.region"
      :value="city.code">
    </el-option>
  </el-select>
</template>

<script>
  import {city} from './../assets/js/city'

  export default {
    name: "BaseDistrictSelect", props: ['districtCode', 'cityCode'], data() {
      return {
        cityOption: city, districtOption: []
      }
    }, methods: {
      changeDistrictCode(val) {
        this.$emit('update:districtCode', val)
      },
    }, watch: {
      cityCode(N, O) {
        let target = this.cityOption.filter((f, i, fs) => {
          return f.code === N
        });
        if (target.length) {
          if (O) {
            this.$emit('update:districtCode', '');
          }
          this.districtOption = target[0].regionEntitys
        } else {
          this.districtOption = []
        }
      }
    }
  }
</script>

<style scoped>

</style>
