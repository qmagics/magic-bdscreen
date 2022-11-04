import { CodeEditor } from "@/components/code-editor";
import { computed, defineComponent } from "vue";

export default defineComponent({
    props: {
        modelValue: {
            type: String,
            default: ''
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const code = computed({
            get: () => {
                return props.modelValue;
            },
            set: v => {
                emit('update:modelValue', v);
            }
        });
        return () => {
            return <div class="code-editor-plus">
                <div class="code-editor-plus__header">
                    ...
                </div>
                <div class="code-editor-plus__body">
                    <CodeEditor v-model={code} height={'100%'} width={'100%'}></CodeEditor>
                </div>
            </div>
        }
    }
});