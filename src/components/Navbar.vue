<template>
  <v-app-bar>
    <v-toolbar flat color="super_light">
      <v-toolbar-title>
        <v-btn text @click="goHome" class="text-light font-semibold">Strona Główna</v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="navbarLoginRegisterPanelsVisible" text @click="goLogin" class="text-light">Zaloguj się</v-btn>
      <v-btn v-if="navbarLoginRegisterPanelsVisible" text @click="goRegister" class="text-light">Zarejestruj się</v-btn>
      <v-btn v-if="navbarUserPanelVisible" text @click="goUser" class="text-light">Panel użytkownika</v-btn>
      <v-btn v-if="navbarAdminPanelVisible" text @click="goAdmin" class="text-light">Panel administratora</v-btn>
      <v-btn v-if="navbarLoggOutVisible" text @click="logOut" class="text-light">Wyloguj</v-btn>
    </v-toolbar>
  </v-app-bar>
</template>



<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Navbar',

  created() {
  },
  methods: {
    goHome() {
      this.$router.push('/');
    },
    goLogin() {
      this.$router.push('/login');
    },
    goRegister() {
      this.$router.push('/register');
    },
    goUser() {
      this.$router.push('/user');
    },
    goAdmin() {
      this.$router.push('/admin');
    }
  },

};


</script>

<script setup>
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { ref, onMounted, onBeforeUpdate, onUpdated, onActivated } from 'vue'
const toast = useToast();
const router = useRouter()


const logOut = () => {
  localStorage.setItem('isUserLoggedIn', JSON.stringify(false));
  localStorage.setItem('userAuthToken', '');
  localStorage.setItem('isStaff', JSON.stringify(false));

  toast.success('Wylogowano', { timeout: 1500 });
  router.push('/');

};

let isLogged = ref();
let isStaff = ref();
let navbarUserPanelVisible = ref(false);
let navbarLoginRegisterPanelsVisible = ref(true);
let navbarLoggOutVisible = ref(false);
let navbarAdminPanelVisible = ref(false);


onMounted(() => {
  let route = useRoute();
  const urlPath = route.name;
  console.log('Scieżka: ' + urlPath)

  isLogged = JSON.parse(localStorage.getItem('isUserLoggedIn'));
  isStaff = JSON.parse(localStorage.getItem('isStaff'));

  console.log("localStorage: " + JSON.stringify(localStorage));

  if (isLogged || urlPath === 'login' || urlPath === 'register' || urlPath === 'admin') navbarLoginRegisterPanelsVisible = false;
  else navbarLoginRegisterPanelsVisible = true;
  console.log("Widoczność: login i rejestracja: " + navbarLoginRegisterPanelsVisible);

  if (urlPath === 'user' || !isLogged) navbarUserPanelVisible = false;
  else navbarUserPanelVisible = true;
  console.log("widoczność: panel użytkownika: " + navbarUserPanelVisible);

  if (isLogged) navbarLoggOutVisible = true;
  else navbarLoggOutVisible = false;
  console.log("Widoczność: panel wylogowania: " + navbarLoggOutVisible);

  if (isLogged && isStaff && urlPath === "user") navbarAdminPanelVisible = true;
  else navbarAdminPanelVisible = false
  console.log("Widoczność: panel admina: " + navbarAdminPanelVisible);


})
</script>
