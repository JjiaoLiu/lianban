<template>
  <el-container style="overflow: hidden;height: 100%">
    <div class="aside">
      <div class="aside-wrap">
        <div class="logo" :class="{'expand':expand}"></div>
        <div class="left-nav" :class="{'expand':expand}">
          <div style="display: inline-block;height: 100%">
            <el-tree ref="tree" :data="authRoutes" :props="defaultProps" :highlight-current="true" accordion
                     node-key="menuId_sc"
                     @current-change="handleCurrentChange">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span v-if="data.pictureUrl"><img :src="data.pictureUrl" style="vertical-align: middle;"/></span>
                <span class="expand-label" style="margin-left: 20px">{{node.label}}</span>
              </span>
            </el-tree>
          </div>
        </div>
        <div class="toggle-expand" :class="{'expand':expand}" @click="expand = !expand">
          <img src="../assets/img/icon_arr_left.png" height="7" width="4"/>
        </div>
        <div class="user">
          <p class="avater"><img src="../assets/img/icon_user_default.png" height="30" width="30"/>
            <span v-show="!expand">{{realName}}</span>
          </p>
          <p class="user-action">
            <span @click="toMsg"><img src="../assets/img/icon_msg.png" height="16" width="14"/><em>0</em></span>
            <span @click="loginOut"><img src="../assets/img/icon_login_out.png" height="16" width="16"/></span>
          </p>
        </div>
      </div>
    </div>
    <el-container>
      <el-main>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  import {getCookie} from './../config'

  export default {
    name: "leftNav", data() {
      return {
        defaultProps: {
          children: 'childs_sc', label: 'menuName'
        }, expand: false, realName: getCookie('realName')
      }
    }, computed: {
      authRoutes() {
        return this.$store.state.authRoutes
      }
    }, created() {
      if (!this.authRoutes.length) {
        this.$store.dispatch('getUserMenu')
      }
    }, methods: {
      handleCurrentChange(data, node) {
        if (!data.childs_sc.length) {
          this.$refs.tree.store.nodesMap[data.menuId_sc].parent.expanded = false;
          if (data.openWay) {
            window.open(window.location.origin + '/#/home/' + data.dataUrl)
          } else {
            this.$router.push('/home/' + data.dataUrl);
          }
        }
      }, loginOut() {
        this.$confirm('确定退出登录？', '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          this.$store.commit('loginOUT');
        }).catch(() => {
          this.$message( '取消操作');
        });
      }, toMsg() {
        alert("toMsg")
      }
    }
  }
</script>

<style lang="scss">

  html, body, #app {
    height: 100%;
    width: 100%;
    min-height: 668px;
    overflow: auto;
  }

  .aside-wrap {
    height: 100%;
    background: #2d3d4e;
    position: relative;
    z-index: 665;
  }

  .el-tree-node {
    position: relative;
    background: #2d3d4e;
    width: 170px;
  }

  .el-tree-node__children {
    position: absolute;
    left: 100%;
    top: 0;
    z-index: 1;
  }

  .el-tree-node__content {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .custom-tree-node {
    height: 70px;
    line-height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .el-tree-node__expand-icon {
    order: 2
  }

  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background: #1e2d3c;
  }

  .logo {
    height: 80px;
    border-bottom: 1px solid #818b95;
    background: url("../assets/img/icon_logo_white.png") no-repeat center center #2d3d4e;
    background-size: 100px 61px;
    &.expand {
      background-size: 70px 44px;
    }
  }

  .left-nav.expand .el-tree {
    > .el-tree-node {
      width: 80px;
      > .el-tree-node__content {
        .el-tree-node__expand-icon.el-icon-caret-right, .expand-label {
          display: none;
        }
      }
    }

  }

  .toggle-expand {
    width: 8px;
    height: 90px;
    background: #3f566e;
    cursor: pointer;
    line-height: 90px;
    text-align: center;
    position: absolute;
    z-index: 0;
    right: -8px;
    top: 50%;
    transform: translateY(-50%) rotate(0);
    &.expand {
      transform: translateY(-50%) rotate(180deg);
    }
  }

  .user {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding-top: 13px;
    padding-bottom: 16px;
    background: #2d3d4e;
    border-top: 1px solid #818b95;;
    .avater {
      margin-bottom: 12px;
      color: #ffffff;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      img + span {
        margin-left: 10px;
      }
    }
    .user-action {
      > span {
        position: relative;
      }
      img {
        cursor: pointer;
      }
      display: flex;
      align-items: center;
      justify-content: space-around;
      em {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #ff9000;
        display: inline-block;
        position: absolute;
        top: -5px;
        right: -9px;
        font-style: normal;
        text-align: center;
        line-height: 12px;
        color: #1d2b35;
        font-size: 12px;
      }
    }
  }
</style>
