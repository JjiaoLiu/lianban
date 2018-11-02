<template>
  <!--省-市-区-->
  <el-row type="flex" justify="space-between">
    <el-col>
      <el-select :value="provinceCode" filterable placeholder="请选择" @change="changeProvinceCode" style="width: calc(100% - 10px)">
        <el-option
          v-for="province in provinceOption"
          :key="province.code"
          :label="province.region"
          :value="province.code">
        </el-option>
      </el-select>
    </el-col>
    <el-col>
      <el-select :value="cityCode" placeholder="请选择" @change="changeCityCode" style="width: calc(100% - 10px)">
        <el-option
          v-for="city in cityOption"
          :key="city.code"
          :label="city.region"
          :value="city.code">
        </el-option>
      </el-select>
    </el-col>
    <el-col>
      <el-select :value="districtCode" placeholder="请选择" @change="changeDistrictCode">
        <el-option
          v-for="district in districtOption"
          :key="district.code"
          :label="district.region"
          :value="district.code">
        </el-option>
      </el-select>
    </el-col>
  </el-row>
</template>

<script>
  import {addrMap} from './../assets/js/addr'

  export default {
    name: "BaseProvinceSelect",
    props: ['provinceCode', 'cityCode', 'districtCode'],
    data() {
      return {
        provinceOption: addrMap,
      }
    },
    computed: {
      cityOption() {
        let target = this.provinceOption.filter((f, i, fs) => {
          return f.code === this.provinceCode
        });
        if(target.length){
          return target[0].regionEntitys
        }
        return []
      },
      districtOption() {
        let target = this.cityOption.filter((f, i, fs) => {
          return f.code === this.cityCode
        });
        if(target.length){
          return target[0].regionEntitys
        }
        return []
      }
    },
    methods: {
      changeProvinceCode(val) {
        this.$emit('update:cityCode', '');
        this.$emit('update:provinceCode', val);
        this.$emit('update:districtCode', '')
      },
      changeCityCode(val) {
        this.$emit('update:cityCode', val);
        this.$emit('update:districtCode', '')
      },
      changeDistrictCode(val) {
        this.$emit('update:districtCode', val);
      }
    },
  }
</script>

<style scoped>

</style>
