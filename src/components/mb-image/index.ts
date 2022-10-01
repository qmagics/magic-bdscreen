import MbImage from './src/mb-image';
import { App } from 'vue';

export default (app: App) => {
    app.component('mb-image', Image);
}

export {
    MbImage
}