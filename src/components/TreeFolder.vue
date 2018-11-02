<template>
  <p class="nav-p">
    <span class="nav-span">
      <span class="nav-icon"><img src="../assets/img/nav_icon.png" height="21" width="18"/></span>
      <span class="nav-title">{{ folder.menuName }}</span>
      <span class="nav-next">
        <img src="../assets/img/icon_arr_right.png" height="8" width="6" v-if="folder.childs_sc && folder.childs_sc.length"/>
      </span>
    </span>
    <transition name="fade">
      <TreeFolderContents :authRouter="folder.childs_sc"/>
    </transition>
  </p>
</template>

<script>
  export default {
    name: "TreeFolder", props: ['folder', 'index'], data() {
      return {
        show: false
      }
    }, components: {
      TreeFolderContents: () => import('./TreeFolderContents.vue')
    },
  }
</script>

<style>


</style>
