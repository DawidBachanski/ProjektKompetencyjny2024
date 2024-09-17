<template>
   <Navbar/>
  <v-app>
 
    <v-main>
      <v-container class="flex justify-center items-center h-screen w-screen">
        <v-card elevation="8"
        width="1000px"
        >
        

        <v-data-table :items="items"
        fixed-header
        hide-default-footer
      density="compact"
      height="700px"
     
    :headers="headers">
      <thead>
        <tr >
          <th>ZDJĘCIE</th>
          <th>WALUTA</th>
          <th>WARTOŚĆ</th>
          <th>PRAWDOPODOBIEŃSTWO</th>
        </tr>
      </thead>
      <tbody>
    
        <tr v-for="(item, index) in this.$uploadState.results" :key="index" class="custom-row">
          
          <td><v-img height="200px" width="250px" :src="'https://banknotes.mwlodar.com'+ item.data.image" class="custom-img"></v-img></td>
         
          
          <td>{{ item.data.currency }}</td>
          <td>{{ item.data.denomination }}</td>
          <td>{{ parseFloat( item.data.confidence ).toFixed(2)}}</td>
       
        </tr>
      </tbody>
    </v-data-table>
  </v-card>
  </v-container>
    </v-main>

    
    <v-dialog v-model="overlayVisible" persistent>
      <v-card height="100px" width="400px" align="center" justify="center">
        <v-card-title >
          <span class="headline">Trwa analiza plików...</span>
        </v-card-title>
        <v-card-subtitle>
          <v-progress-circular  indeterminate color="primary"></v-progress-circular>
        </v-card-subtitle>
      </v-card>
    </v-dialog>
  </v-app>
</template>
  
  <script>
  import axios from 'axios';
  
  export default {
  data() {
    return {
      items: [],
      overlayVisible: true, 
      
    };
  },
  computed: {
    isUploading() {
      return this.$uploadState.isUploading;
    },
    uploadResults() {
      return this.$uploadState.results;
    },
    uploadError() {
      return this.$uploadState.error;
    }
  },
  watch: {
  isUploading(newValue) {
    console.log('Watcher isUploading called. New value:', newValue);
    if (!newValue) {
      console.log('Zdjęcia zostały przesłane:', this.uploadResults);
      this.overlayVisible = false;
    }
  },
 
      
  
},
  mounted() {
    if (!this.isUploading) {
      console.log('Zdjęcia zostały przesłane:', this.uploadResults);
      this.overlayVisible = false;
    }
  },

    created() {
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get('https://banknotes.mwlodar.com/recogniseBill/');
          this.items = response.data;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
      goHome() {
        this.$router.push('/');
      },
      goLogin() {
        this.$router.push('/login');
      },
      goRegister() {
        this.$router.push('/register');
      }
    },
  };
  </script>
  <script setup>
  import Navbar from '@/components/Navbar.vue';
  </script>
  <style scoped>
  .v-card {
    max-width: 1000px;
    margin: auto;
  }

  .custom-table {
  max-width: 1000px;
}

.custom-img .v-image__image {
  border-radius: 20px;
}

.custom-row {
  background-color: #f5f5f5;
  border-radius: 25px;
  padding: 10px;
}

.custom-row td {
  padding: 10px;
  border: none;
}


</style>