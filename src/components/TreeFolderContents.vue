<template>
  <ul style="height: 1000px">
    <li v-for="child in authRouter">
      <p class="nav-p" v-if="!child.childs_sc">
        <router-link class="nav-span" tag="a" :target="child.openWay === 1 ? '_blank':''" :to=" '/home/' + child.dataUrl">
          <span class="nav-icon"><img src="../assets/img/nav_icon.png" height="21" width="18"/></span>
          <span class="nav-title">{{ child.menuName }}</span>
        </router-link>
      </p>
      <TreeFolder v-else :folder="child"/>
    </li>
  </ul>
</template>
<!--child.openWay 1-新窗口，0-本窗口 ,-->
<script>
  export default {
    name: "TreeFolderContents", props: ['authRouter'], data() {
      return {
        selectIndex: ''
      }
    }, components: {
      TreeFolder: () => import('./TreeFolder.vue')
    }, created() {

    }
  }
</script>

<style scoped>
</style>
