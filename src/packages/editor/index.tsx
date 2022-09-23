import '@/styles/editor/index.scss';
import { computed, defineComponent, PropType, provide, ref, StyleValue } from "vue";
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
import useDesignStore from '@/store/design';
import { useBlockItemContextmenu } from './hooks/useBlockItemContextmenu';
import { useCommands } from './hooks/useCommands';
import { COMMANDS_KEY } from '../tokens';

export default defineComponent({
    props: {
        modelValue: {
            type: Object as PropType<ConfigData>,
            required: true
        }
    },
    emits: ['update:modelValue'],
    setup: (props, { emit }) => {

        const designStore = useDesignStore();

        // 配置数据代理对象
        const configData = computed({
            get() {
                return props.modelValue;
            },
            set(val) {
                emit('update:modelValue', deepClone(val));
            }
        });

        // 编辑器classNames 
        const editorClass = computed(() => {
            return [
                'editor',
                designStore.isPreView ? 'is--preview' : 'is--editing'
            ]
        });

        // 画布元素
        const canvasRef = ref();

        // 画布样式
        const canvasStyle = computed<StyleValue>(() => {
            return {
                width: `${configData.value?.container.width}px`,
                height: `${configData.value?.container.height}px`,
            }
        });

        // 物料库拖拽管理
        const { triggerMenuItemDragstart, triggerMenuItemDragend } = useMenuDragger({ canvasRef, configData });

        // 区块选中焦点的管理
        const { triggerBlockItemMousedown, clearBlocksFocused, focusData, lastSelectedBlock } = useFocus({ configData, onBlockMousedown: e => triggerMousedown(e) });

        // 区块的拖拽管理
        const { triggerMousedown, markline } = useBlockItemDragger({ configData, focusData, lastSelectedBlock });
        
        // 命令管理
        const { commands } = useCommands(configData, focusData);
        provide(COMMANDS_KEY, commands);
        
        // 区块右键菜单管理
        const { triggerContextmenu } = useBlockItemContextmenu(commands);

        return () => {

            // 编辑画布
            const editorCanvas = (
                <div class="editor-canvas" style={canvasStyle.value} ref={canvasRef} onMousedown={clearBlocksFocused}>
                    {
                        configData.value?.blocks.map((block, index) => {
                            return <BlockItem
                                class={{ 'is--focused': block.isFocused }}
                                block={block}
                                onMousedown={(e: MouseEvent) => triggerBlockItemMousedown(e, block, index)}
                                onContextmenu={(e: MouseEvent) => triggerContextmenu(e, block)}
                            ></BlockItem>
                        })
                    }

                    <Markline data={markline}></Markline>
                </div>
            )

            // 预览画布
            const previewCanvas = (
                <div class="preview-canvas" style={canvasStyle.value}>
                    {
                        configData.value?.blocks.map((block) => {
                            return <BlockItem block={block}></BlockItem>
                        })
                    }
                </div>
            )

            return <div class={editorClass.value}>
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
                        {designStore.isPreView ? previewCanvas : editorCanvas}
                    </div>
                </div>
                <div class="editor-right-sidebar">

                </div>
            </div>
        }
    },
})