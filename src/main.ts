import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import router from './router';
import store from './store';
import 'element-plus/lib/theme-chalk/index.css';
import 'normalize.css';
import 'nprogress/nprogress.css';
import './assets/css/global.less';
import App from './App.vue';

const app = createApp(App).use(ElementPlus).use(store).use(router);
app.mount('#app');
