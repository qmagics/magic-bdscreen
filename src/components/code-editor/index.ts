import CodeEditor from './src/code-editor';
import { App } from 'vue';

export default (app: App) => {
    app.component('code-editor', CodeEditor);
}

export {
    CodeEditor
}