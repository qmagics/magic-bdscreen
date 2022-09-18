import panel from './panel.vue';
import { App } from 'vue';

export default (app: App) => {
    app.component('panel', panel);
}