import MbChartBar from './src/mb-chart-bar';
import { App } from 'vue';

export default (app: App) => {
    app.component('mb-image', MbChartBar);
}

export {
    MbChartBar
}