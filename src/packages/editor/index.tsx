import { computed, defineComponent, PropType, ref, StyleValue } from "vue";
import EditorHeader from './header';
import { ConfigData } from "@/types";
import { deepClone } from "@/utils";
import BlockItem from "./block-item";
import './editor.scss';
import ComponentLib from "./component-lib";
import { useMenuDragger } from "./useMenDragger";

export default defineComponent({
    props: {
        modelValue: {
            type: Object as PropType<ConfigData>,
            required: true
        }
    },
    emits: ['update:modelValue'],
    setup: (props, { emit }) => {
        const configData = computed({
            get() {
                return props.modelValue;
            },
            set(val) {
                emit('update:modelValue', deepClone(val));
            }
        });

        const canvasStyle = computed<StyleValue>(() => {
            return {
                width: `${configData.value?.container.width}px`,
                height: `${configData.value?.container.height}px`,
            }
        });

        const canvasRef = ref();

        // 物料库拖拽管理
        const { triggerMenuItemDragstart } = useMenuDragger({ canvasRef, configData });

        return () => {
            return <div class="editor">
                <EditorHeader></EditorHeader>
                <div class="editor-left-sidebar">
                    <panel>
                        {
                            {
                                header: () => <div style={{ textAlign: 'center', fontWeight: "bold" }}>物料</div>,
                                default: () => <ComponentLib onItemDragstart={triggerMenuItemDragstart}></ComponentLib>
                            }
                        }
                    </panel>
                </div>
                <div class="editor-container">
                    <div class="editor-container__wrapper">
                        <div class="editor-canvas" style={canvasStyle.value} ref={canvasRef}>
                            {
                                configData.value?.blocks.map(block => {
                                    return <BlockItem block={block}></BlockItem>
                                })
                            }
                        </div>
                    </div>
                </div>
                <div class="editor-right-sidebar">

                </div>
            </div>
        }
    },
})