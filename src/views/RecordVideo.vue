<template>
  <Navbar/>
  <v-app>

    <v-main>
      <v-container class="flex justify-center items-center h-screen">
        <v-row>
          <v-col cols="6">
            <v-card :ripple="false" class="p-6 rounded-lg w-5/5 h-4/5 overflow-hidden relative" height="600px"
              elevation="8" outlined>
              <div class="flex flex-col items-center justify-center h-full relative">

                <span v-show="!isRecording && !videoSrc" class="material-icons">
                  <span class="icons-camera mdi mdi-camera-off"></span>
                </span>
                <video ref="video" class="absolute inset-0 w-full h-full object-contain rounded-lg" :src="videoSrc"
                  autoplay playsinline>
                </video>
              </div>
            </v-card class="flex flex-col p-6 rounded-lg w-4/5 h-4/5 overflow-hidden relative" elevation="8" outlined>
          </v-col>
          <v-col cols="6">
            <v-card class="flex flex-col p-6 rounded-lg w-5/5 h-4/5 overflow-hidden relative" height="600px"
              elevation="8" outlined>
              <div class="flex flex-col items-center justify-center h-full relative">
                <v-img v-if="CapImage" :src="CapImage"
                  class="image-custom absolute inset-0 w-full h-full object-contain rounded-lg"></v-img>
                <span v-show="!CapImage" class="material-icons">
                  <span class="icons-camera mdi mdi-image-off"></span>
                </span>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <div class="buttons-rec absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-6">
          <v-btn
            class="bg-red-600 text-white  rounded-full custom-btn hover:bg-red-700 shadow-lg"
            @click="startCamera">
            <v-tooltip activator="parent" location="top">Włącz kamere</v-tooltip>
            <v-icon large>mdi-camera</v-icon>
          </v-btn>
          <v-btn
            class="bg-red-600 text-white p-1 rounded-full hover:bg-red-700 shadow-lg"
            @click="MakeImage" :disabled="!CameraEnabled">
            <v-icon large>mdi-file-image-plus</v-icon>
            <v-tooltip activator="parent" location="top">Zrób zdjęcie</v-tooltip>
          </v-btn>
          <v-btn
            class="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 shadow-lg"
            @click="uploadAllImages" :disabled="!CapImage">
            <v-icon large>mdi-upload</v-icon>
            <v-tooltip activator="parent" location="top">Wyślij zdjęcie</v-tooltip>
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
      CameraEnabled: false,
      CapImage: null,
      VidLink: null,
      APILink: 'https://banknotes.mwlodar.com/recogniseBill/'
    };
  },
  methods: {
    goResults() {
      this.$router.push('/results');
    },
    async startCamera() {

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {

          const VidLink = await navigator.mediaDevices.getUserMedia({ video: true });
          this.$refs.video.srcObject = VidLink;
          this.VidLink = VidLink;
          this.CameraEnabled = true;
        } catch (error) {
          alert('Brak dostępu do kamery.');
        }
      }
    },
    MakeImage() {

      const Vid = this.$refs.video;
      const docElement = document.createElement('canvas');
      docElement.height = Vid.videoHeight;
      docElement.width = Vid.videoWidth;
      const context = docElement.getContext('2d');
      context.drawImage(Vid, 0, 0, docElement.width, docElement.height);
      const URLInfo = docElement.toDataURL('image/png');
      const base64 = URLInfo.split(',')[1];

      this.CapImage = URLInfo;
    },
     async uploadAllImages() {
      this.$uploadState.isUploading = true;

      const formData = new FormData();
      formData.append('image', this.CapImage);
      formData.append('filename', this.CapImage.name);
      let uploadPromise;


      if (!(JSON.parse(localStorage.getItem('isUserLoggedIn')))) {
        uploadPromise = axios.post(this.APILink, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        const userAuthToken = localStorage.getItem('userAuthToken');
        console.log('auth');
        uploadPromise = axios.post(this.APILink, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Token ${userAuthToken}`
          }
        });
      }

      try {
        this.goResults();
        const results = await uploadPromise;
        this.$uploadState.results = [results];

        this.$uploadState.isUploading = false;
      } catch (error) {
        this.$uploadState.isUploading = false;
      }
    }
  }
};
</script>

<script setup>
import Navbar from '@/components/Navbar.vue';
</script>

<style scoped>
.buttons-rec {
  background-color: #1e1e1e;
  padding: 15px;
  border-radius: 50px;
}

.icons-camera {
  font-size: 150px;
}

.v-btn[disabled] {
  background-color: #b0bec5;
  color: #ffffff;
  cursor: not-allowed;
}

.v-btn[disabled] .v-icon {
  color: #ffffff;
}

.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.video-container video {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.image-custom {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.v-btn .v-icon {
  font-size: 30px;
}

.bg-red-600 {
  background-color: #e53e3e;
}

.bg-red-700 {
  background-color: #c53030;
}

.bg-green-600 {
  background-color: #c53030;
}

.bg-green-700 {
  background-color: #c53030;
}

.bg-blue-600 {
  background-color: #3182ce;
}

.bg-blue-700 {
  background-color: #2b6cb0;
}
</style>
