import SvgIcon from './src/svg-icon';
import { App } from 'vue';

export default (app: App) => {
    app.component('svg-icon', SvgIcon);
}