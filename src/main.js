import { createApp,  reactive  } from 'vue';
import App from './App.vue';


import router from './router';

import toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'


import { createVuetify } from 'vuetify';
import 'vuetify/styles'; 
import '@mdi/font/css/materialdesignicons.css'; 


import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';





const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light', 
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          super_light: '#FFFFFF',
        },
      },
      dark: {
        colors: {
          primary: '#1E88E5',
          secondary: '#424242',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
    },
  },
});


import './assets/main.css';
import { toastInjectionKey } from 'vue-toastification';


const app = createApp(App)
  .use(vuetify)
  .use(router)



  app.config.globalProperties.$uploadState = reactive({
    isUploading: false,
    results: [],
    error: null,
  });

  
  app.use(toast)
  app.mount('#app');
