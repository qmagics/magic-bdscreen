import '@/styles/editor/index.scss';
import { computed, defineComponent, PropType, ref, StyleValue } from "vue";
import EditorHeader from './header';
import { ConfigData } from "@/types";
import { deepClone } from "@/utils";
import BlockItem from "./block-item";
import ComponentLib from "./component-lib";
import SidebarPanel from './sidebar-panel';
import Markline from './markline';
import { useMenuDragger } from "./hooks/useMenuDragger";
import { useFocus } from './hooks/useFocus';
import { useBlockItemDragger } from "./hooks/useBlockItemDragger";

export default defineComponent({
    props: {
        modelValue: {
            type: Object as PropType<ConfigData>,
            required: true
        }
    },
    emits: ['update:modelValue'],
    setup: (props, { emit }) => {

        // 配置数据代理对象
        const configData = computed({
            get() {
                return props.modelValue;
            },
            set(val) {
                emit('update:modelValue', deepClone(val));
            }
        });

        // 画布样式
        const canvasStyle = computed<StyleValue>(() => {
            return {
                width: `${configData.value?.container.width}px`,
                height: `${configData.value?.container.height}px`,
            }
        });

        // 画布元素
        const canvasRef = ref();

        // 物料库拖拽管理
        const { triggerMenuItemDragstart, triggerMenuItemDragend } = useMenuDragger({ canvasRef, configData });

        // 区块选中焦点的管理
        const { triggerBlockItemMousedown, clearBlocksFocused, focusData, lastSelectedBlock } = useFocus({ configData, onBlockMousedown: e => triggerMousedown(e) });

        // 区块的拖拽管理
        const { triggerMousedown, markline } = useBlockItemDragger({ configData, focusData, lastSelectedBlock });

        return () => {
            return <div class="editor">
                <EditorHeader configData={configData}></EditorHeader>
                <div class="editor-left-sidebar">
                    <SidebarPanel>
                        {
                            {
                                header: () => <div style={{ textAlign: 'center', fontWeight: "bold" }}>物料</div>,
                                default: () => <ComponentLib onItemDragstart={triggerMenuItemDragstart} onItemDragend={triggerMenuItemDragend}></ComponentLib>
                            }
                        }
                    </SidebarPanel>
                </div>
                <div class="editor-container">
                    <div class="editor-container__wrapper">
                        <div class="editor-canvas" style={canvasStyle.value} ref={canvasRef} onMousedown={clearBlocksFocused}>
                            {
                                configData.value?.blocks.map((block, index) => {
                                    return <BlockItem
                                        class={{ 'is--focused': block.isFocused }}
                                        block={block}
                                        onMousedown={(e: MouseEvent) => triggerBlockItemMousedown(e, block, index)}
                                    ></BlockItem>
                                })
                            }

                            <Markline data={markline}></Markline>
                        </div>
                    </div>
                </div>
                <div class="editor-right-sidebar">

                </div>
            </div>
        }
    },
})