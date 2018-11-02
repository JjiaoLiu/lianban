<template>
  <div class="header">
    <div>
      <span @click="$router.back()"><img src="../assets/img/icon_back.png" height="33" width="18"/></span>
      {{title}}
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "BaseSecHeader",
    props: ['title']
  }
</script>

<style scoped lang="scss">
  @import "./../assets/mixin/all";

  .header {
    height: 78px;
    font-size: 24px;
    padding: 27px 30px;
    background: #f0f4fa;
    @include use-flex(center, space-between);
    span {
      display: inline-block;
      vertical-align: middle;
      padding: 0 10px;
      margin-right: 14px;
      cursor: pointer;
    }
  }
</style>
