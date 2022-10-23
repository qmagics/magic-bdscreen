import MbTable from './src/mb-table.vue';
import { App } from 'vue';

export default (app: App) => {
    app.component('mb-table', MbTable);
}

export {
    MbTable
}