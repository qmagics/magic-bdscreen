import { defineComponent, onMounted, ref, computed, onBeforeUnmount, watch, PropType, nextTick } from "vue";
import './init-monaco-env';
import * as monaco from 'monaco-editor';
import { hasChanged, parseCssValue, sleep } from "@/utils";
import { DEFAULT_OPTIONS } from "./config";
import { useERD } from "@/hooks/useERD";

export default defineComponent({
    props: {
        width: {
            type: [Number, String],
            default: '100%'
        },
        height: {
            type: [Number, String],
            default: 250
        },
        modelValue: {
            type: String,
            default: ''
        },
        options: {
            type: Object as PropType<monaco.editor.IStandaloneEditorConstructionOptions>,
            default: () => ({})
        }
    },

    emits: ['update:modelValue'],

    setup(props, { emit }) {
        const editorRef = ref();
        let editor: monaco.editor.IStandaloneCodeEditor;

        const style = computed(() => {
            return {
                width: parseCssValue(props.width),
                height: parseCssValue(props.height),
            }
        });

        const options = computed(() => {
            return {
                ...DEFAULT_OPTIONS,
                ...props.options,
                readOnly: false,
            }
        });

        const code = ref<string>(props.modelValue);

        watch([() => props.width, () => props.height], () => {
            editor?.layout();
        });

        watch(() => props.modelValue, v => {
            if (hasChanged(v, code.value)) {
                code.value = v;
                editor.setValue(v);
            }
        });

        watch(code, v => {
            emit('update:modelValue', v);
        });

        watch(() => props.options, (v) => {
            editor?.updateOptions(v);
        });

        onMounted(async () => {
            await nextTick();
            editor = monaco.editor.create(editorRef.value, options.value);

            editor.onDidChangeModelContent(() => {
                const newVal = editor.getValue();

                code.value = newVal;
            });

            editor.setValue(code.value);

            if (props.options.readOnly) {
                editor.updateOptions({ readOnly: true });
            }

            useERD(editorRef.value, () => {
                editor?.layout();
            });
        });

        onBeforeUnmount(() => {
            editor?.dispose();
        });

        return () => {
            return <div class="code-editor" style={style.value} ref={editorRef}></div>
        }
    }
});