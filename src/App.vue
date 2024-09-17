<script>
import { RouterLink, RouterView } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
export default {
  name: 'Home',
  components: {
    Navbar
  }
}
</script>



<template>

  <v-app>

    <router-view />
  </v-app>
</template>
