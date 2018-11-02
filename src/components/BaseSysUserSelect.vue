<template>
  <el-select
    :value="user_id"
    filterable
    size="small"
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    @change="change"
    :loading="loading">
    <el-option
      v-for="item in user"
      :key="item.userId_sc"
      :label="item.userName"
      :value="item.userId_sc">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    name: "BaseSysUserSelect",
    props: ['user_id', 'user_name'],
    data() {
      return {
        loading: false,
        user: []
      }
    },
    methods: {
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          this.$axios.get(process.env.API_HOST[1] + '/comm/sysuserlist', {
            params: {name: query}
          }).then(res => {
            if (res.data.success === true) {
              this.loading = false;
              this.user = res.data.list_sc;
            }else {
              this.$message.warning(res.data.msg)
            }
          });
        }
      },
      change(val) {
        this.$emit('update:user_id', val);
        this.$emit('update:user_name', val);
      }
    },
    watch: {
      user_name: {
        handler(newV, old) {
          if(newV && !old){
            this.remoteMethod(newV)
          }
        },
        immediate: true
      }
    }
  }
</script>

<style scoped>

</style>
