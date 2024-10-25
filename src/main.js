import 'primeicons/primeicons.css'
import './assets/main.scss';

import {createApp} from 'vue';
import {createPinia} from 'pinia';

import App from './App.vue';
import router from './router';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import DialogService from 'primevue/dialogservice';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.fake-dark-selector',
        },
    }
});
app.use(DialogService);

app.mount('#app');
