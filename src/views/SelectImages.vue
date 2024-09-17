

<template>
  <Navbar/>
  <v-app>
    <v-main>
      <v-container class="flex justify-center items-center h-screen">
        <v-card :ripple="false"
          class="flex flex-col p-2 rounded-lg shadow-lg bg-dark-bg w-4/5 h-4/5 overflow-hidden relative" elevation="8"
          outlined @click="triggerFileInput" @drop="handleDrop" @dragover.prevent ripple="false">
          <input type="file" ref="fileInput" multiple accept="image/*" class="hidden" @change="UploadImagesToPreview"
            @click.stop />

          <div v-if="images.length == 0"
            class="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-400 rounded-lg p-6 bg-gray-1000 cursor-pointer">
            <v-icon large class="text-light">mdi-upload</v-icon>
            <span class="mt-2 text-lg text-light">Przeciągnij zdjęcia tutaj lub kliknij, aby je dodać</span>
          </div>

          <div class="mt-4 grid grid-cols-4 gap-4 overflow-y-auto">
            <v-col v-for="(image, index) in images" :key="index" class="p-0">
              <v-card class="relative rounded-lg overflow-hidden shadow-md bg-gray-700" outlined elevation="3">
                <v-img :src="image.base64" class="w-full h-64 object-cover"></v-img>
                <v-icon class="absolute top-2 right-2 text-red-500 cursor-pointer" @click.stop="RemoveImage(index)">
                  mdi-delete
                </v-icon>
              </v-card>
            </v-col>
          </div>

        </v-card>

        <div class="buttons-rec absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-6">
          <v-btn
            class="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 shadow-lg transform transition-transform duration-300 ease-in-out"
            @click="UploadImages" :disabled="images.length == 0">
            <v-icon large>mdi-upload</v-icon>
            <v-tooltip activator="parent" location="top">Wyślij zdjęcia</v-tooltip>
          </v-btn>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      images: [],
      APILink: 'https://banknotes.mwlodar.com/recogniseBill/'
    };
  },
  methods: {
    UploadImagesToPreview(event) {
      const TempImg = event.target.files;
      if (TempImg.length) 
      {
        const TempImages = [];
        for (const file of TempImg) 
        {
          const Conv = new FileReader();
          Conv.onload = (e) => {

            TempImages.push({ base64: e.target.result, name: file.name });
            if (TempImages.length === TempImg.length) {
              this.images = [...this.images, ...TempImages];
            }
          };
          Conv.readAsDataURL(file);
        }
      }
    },
    goResults() {
      this.$router.push('/results');
    },
    handleDrop(event) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length) {
          this.UploadImagesToPreview({ target: { files } });
        }
      },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    RemoveImage(index) {
      this.images.splice(index, 1);
    },
    async UploadImages() {
      this.$uploadState.isUploading = true;
      try {
        console.log('Obiekty do wysłania:', this.images);
        const uploadPromises = this.images.map(image => {
          const formData = new FormData();


          formData.append('image', image.base64);
          formData.append('filename', image.name);

          if (!(JSON.parse(localStorage.getItem('isUserLoggedIn')))) {
            console.log('Noauth');
            return axios.post(this.APILink, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
          } else {
            const userAuthToken = localStorage.getItem('userAuthToken');
            console.log('auth');
            return axios.post(this.APILink, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Token ${userAuthToken}`
              }
            });
          }

        });
        this.goResults();
        const results = await Promise.all(uploadPromises);
        this.$uploadState.results = results;

        this.$uploadState.isUploading = false;
      } catch (error) {
        this.$uploadState.isUploading = false;
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

  }
}
</script>

<script setup>
import Navbar from '@/components/Navbar.vue';
</script>

<style scoped>
.v-main {
  padding: 0;
}

.image-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.image-card {
  height: 0;
  padding-top: 100%;
  position: relative;
}

.image-card img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.buttons-rec {
  padding: 15px;
  background-color: #1e1e1e;
  border-radius: 50px;
}

.v-btn[disabled] {
  color: #ffffff;
  background-color: #b0bec5;
  cursor: not-allowed;
}

.v-btn[disabled] .v-icon {
  color: #ffffff;
}
.bg-blue-700 {
  background-color: #2b6cb0;
}

.bg-blue-600 {
  background-color: #3182ce;
}


</style>