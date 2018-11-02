<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

  export default {
    name:'App',created(){
      if(this.$route.fullPath.includes('/home/')){
        this.$store.dispatch('getUserMenu')
      }
    }
  }
</script>
