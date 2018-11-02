<template>
  <div class="header">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col :span="16">
        <span class="title-txt">{{title}}管理</span>
        <el-button style="height: 36px;padding: 0 13px" type="primary" @click="emitHeaderButton" v-if="!showbtn">
          <img src="../assets/img/icon_add.png" height="20" width="20"/>&nbsp;&nbsp;
          <span class="btn-txt" v-if="otherTitle">添加{{otherTitle}}</span>
          <span class="btn-txt" v-else>添加{{title}}</span>
        </el-button>
        <slot name="title"></slot>
      </el-col>
      <el-col :span="5">
        <slot></slot>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "BaseHeader",
    props: ['title', 'otherTitle', 'showbtn'],
    methods: {
      emitHeaderButton() {
        this.$emit('emitHeaderButton')
      }
    }
  }
</script>

<style scoped lang="scss">
  .header {
    background: #eff4fa;
    padding: 26px 30px 18px 30px;
    img, span {
      vertical-align: middle;
    }
    .title-txt {
      font-size: 24px;
      color: #468;
      margin-right: 20px;
      line-height: 36px;
    }
    .btn-txt {
      font-size: 20px;
    }
  }
</style>
