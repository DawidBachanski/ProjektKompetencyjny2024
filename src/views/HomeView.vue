<script>
import image_bg_1 from '@/assets/Folder.png';
import image_bg_2 from '@/assets/icon-photo.png';
import { onMounted } from 'vue';

export default {
  data() {
    return {
      image_bg_1,
      image_bg_2
    };
  },
  methods: {
    goLogin() {
      this.$router.push('/login');
    },
    goRegister() {
      this.$router.push('/register');
    },
    goImages() {
      this.$router.push('/images');
    },
    goVideo() {
      this.$router.push('/video');
    }
  }
}
</script>

<script setup>
import Navbar from '@/components/Navbar.vue';

onMounted(() => {
  const is1 = localStorage.getItem('isUserLoggedIn');
  if (!is1) { localStorage.setItem('isUserLoggedIn', JSON.stringify(false))}

  const is2 = localStorage.getItem('isStaff');
  if (!is2) { localStorage.setItem('isStaff', JSON.stringify(false))}

  const is3 = localStorage.getItem('userAuthToken');
  if (!is3) { localStorage.setItem('userAuthToken', '')}


})

</script>

<template>
  <v-app>
  <Navbar/>
  
    <v-main>
      <v-container fluid class="custom-container">
        <v-row class="row-40 align-center justify-center">
          <v-card-title class="text-h4 text-md-h5 text-lg-h4">WYBIERZ METODĘ ANALIZY BANKNOTÓW</v-card-title>
        </v-row>
        <v-row class="row-60 align-center">
        
          <v-col class="d-flex justify-center align-center">
            <v-btn @click="goImages" class="ma-10" elevation="8" width="500" height="500" tile rounded
              :style="{ backgroundImage: 'url(' + image_bg_1 + ')', backgroundSize: 'cover'}">
              <v-tooltip
                activator="parent" location="top">Analiza przy pomocy zdjęć z dysku
              </v-tooltip>
            </v-btn>
            <v-btn @click="goVideo" class="ma-10" elevation="8" width="500" height="500" tile rounded
              :style="{ backgroundImage: 'url(' + image_bg_2 + ')', backgroundSize: 'cover'}">
              <v-tooltip
                activator="parent" location="top">Analiza zdjęcia zrobionego przy użyciu kamery urządzenia
              </v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
.row-60 {
  flex: 0 0 50%;
}

.row-40 {
  flex: 0 0 20%;
}

.custom-container {
  height: 90vh;
  display: flex;
  flex-direction: column;
}


</style>




