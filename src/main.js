import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/tailwind.css'
import router from './router'
import '@/services/axios'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

createApp(App).use(router).use(PrimeVue, {
    theme: {
        preset: Aura
    }
}).mount('#app')
