<template>
  <div class="all-screen-wrap" v-show="show">
    <div class="base-mask" v-if="noMask"></div>
    <div :class="{'base-message':true,'border-left':!noMask}">
      <div class="header">
        <span class="h3" v-if="title">{{title}}</span>
        <el-button type="text" @click="emitShow" class="close">
          <img src="../assets/img/icon_close.png" height="18"/>
        </el-button>
      </div>
      <div class="main">
        <slot></slot>
      </div>
    </div>
    <slot name="inner-message"></slot>
  </div>
</template>

<script>
  export default {
    name:"BaseMessageBox",props:{
      'noMask':{
        type:Boolean,default:true
      },'title':{
        type:String,
      },'show':{
        type:Boolean,
      }
    },methods:{
      emitShow(){
        this.$emit('before-close');
        this.$emit('update:show',false);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "./../assets/mixin/all";

  .base-mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
    z-index: 666;
  }

  .base-message {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    background: #ffffff;
    padding: 30px 25px 50px 30px;
    z-index: 667;
    overflow: scroll;
    &.border-left {
      border-left: 1px solid #d6d6d6;
    }
  }

  .header {
    margin-bottom: 24px;
    @include use-flex(center, space-between);
    .h3 {
      font-size: 24px;
      color: #468;
    }
  }
</style>
