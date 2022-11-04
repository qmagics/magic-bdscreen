import { CodeEditor } from "@/components/code-editor";
import { computed, defineComponent, PropType } from "vue";
import * as monaco from 'monaco-editor';
import { ElButton } from "element-plus";
import { createCodeDialog } from "@/utils/code-dialog";

export default defineComponent({
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        options: {
            type: Object as PropType<monaco.editor.IStandaloneEditorConstructionOptions>,
            default: () => ({})
        },
        description: String
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

        const editCodeFull = () => {
            createCodeDialog({
                title: "编辑代码",
                description: props.description,
                language: props.options.language,
                code: code.value,
                onConfirm: v => code.value = v
            })
        }

        return () => {
            return <div class="code-editor-plus">
                <div class="code-editor-plus__header">
                    <ElButton type="primary" plain onClick={editCodeFull}>全屏编辑</ElButton>
                </div>
                <div class="code-editor-plus__body">
                    <CodeEditor v-model={code.value} height={'100%'} width={'100%'} options={props.options}></CodeEditor>
                </div>
            </div>
        }
    }
});