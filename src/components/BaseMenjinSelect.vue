<template>
  <el-select
    :value="equipCode"
    filterable
    size="small"
    remote
    :disabled="!floorId_sc"
    reserve-keyword
    placeholder="请输入"
    :remote-method="remoteMethod"
    @change="change"
    :loading="loading">
    <el-option
      v-for="(item,index) in option"
      :key="index"
      :label="item"
      :value="item">
    </el-option>
  </el-select>
</template>

<script>

  export default {
    name: "BaseMenjinSelect",
    props: ['spaceId_sc', 'floorId_sc', 'size', 'multiple', 'equipCode'],
    data() {
      return {
        option: [],
        loading: false
      }
    },
    methods: {
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          this.getList()
        }
      },
      change(val) {
        this.$emit('update:equipCode', val);
      },
      getList() {
        this.$axios.get(process.env.API_HOST[1] + '/comm/equipList', {
          params: {
            floorId_sc: this.floorId_sc,
            spaceId_sc: this.spaceId_sc,
            equipCode: this.equipCode,
            size: 10
          }
        }).then(res => {
          if (res.data.success === true) {
            if (res.data.list && res.data.list.length) {
              this.option = res.data.list;
            } else {
              this.option = [];
            }
            this.loading = false
          }else {
            this.$message.warning(res.data.msg)
          }
        })
      }
    },
    watch: {
      spaceId_sc: {
        handler(N, O) {
          if (N) {
            this.getList()
          }
        },
        immediate: true
      },
      floorId_sc: {
        handler(N, O) {
          if (N) {
            this.getList()
          }
        },
        immediate: true
      },
    }
  }
</script>

<style scoped>

</style>
