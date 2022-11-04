import CodeEditorPlus from './src/code-editor-plus';
import { App } from 'vue';

export default (app: App) => {
    app.component('code-editor-plus', CodeEditorPlus);
}

export {
    CodeEditorPlus
}