import '@/styles/editor/index.scss';
import { computed, defineComponent, inject, PropType, provide, ref, StyleValue } from "vue";
import EditorHeader from './header';
import { ConfigData, FormModel } from "@/types";
import { deepClone } from "@/utils";
import BlockItem from "./block-item";
import ComponentLib from "./component-lib";
import SidebarPanel from './sidebar-panel';
import PropsEditor from './props-editor';
import Markline from './markline';
import { useMenuDragger } from "./hooks/useMenuDragger";
import { useFocus } from './hooks/useFocus';
import { useBlockItemDragger } from "./hooks/useBlockItemDragger";
import useDesignStore from '@/store/design';
import { useBlockItemContextmenu } from './hooks/useBlockItemContextmenu';
import { useCommands } from './hooks/useCommands';
import { COMMANDS_KEY, MANAGER_KEY } from '../tokens';
import ActionHistory from './action-history';
import CanvasScaler from './canvas-scaler';
import { afterScale } from './utils';
import SketchRuler from './sketch-ruler';
import { useSketchRuler } from './hooks/useSketchRuler';

export default defineComponent({
    props: {
        modelValue: {
            type: Object as PropType<ConfigData>,
            required: true
        },
        formData: {
            type: Object as PropType<FormModel>,
            required: true
        }
    },
    emits: ['update:modelValue'],
    setup: (props, { emit }) => {

        const designStore = useDesignStore();

        const manager = inject(MANAGER_KEY)!;

        // 容器元素
        const screenRef = ref();

        const containerRef = ref();
        const wrapperRef = ref();

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
                designStore.editorState.isPreview ? 'is--preview' : 'is--editing'
            ]
        });

        // 画布元素
        const canvasRef = ref();

        // 画布样式
        const canvasStyle = computed<StyleValue>(() => {
            let width = configData.value?.container.width;
            let height = configData.value?.container.height;

            width = afterScale(width);
            height = afterScale(height);

            return {
                width: `${width}px`,
                height: `${height}px`,
            }
        });

        // 物料库拖拽管理
        const { triggerMenuItemDragstart, triggerMenuItemDragend } = useMenuDragger({ canvasRef, configData });

        // 区块选中焦点的管理
        const { triggerBlockItemMousedown, clearBlocksFocused, focusData, lastSelectedBlock } = useFocus({ configData, onBlockMousedown: e => triggerMousedown(e) });

        // 区块的拖拽管理
        const { triggerMousedown, markline } = useBlockItemDragger({ configData, focusData, lastSelectedBlock });

        // 命令管理
        const commandsState = useCommands(configData, focusData);
        provide(COMMANDS_KEY, commandsState.commands);

        // 区块右键菜单管理
        const { triggerContextmenu } = useBlockItemContextmenu(commandsState.commands);

        // 画布比例尺
        const { sketchRulerProps, onScreenScroll } = useSketchRuler({ configData, containerRef, screenRef, wrapperRef, canvasRef });

        return () => {

            // 编辑画布
            const editorCanvas = (
                <div class="editor-canvas" style={canvasStyle.value} ref={canvasRef} onMousedown={clearBlocksFocused}>
                    {
                        configData.value?.blocks.map((block, index) => {
                            return <BlockItem
                                class={{ 'is--focused': block.isFocused }}
                                block={block}
                                formData={props.formData}
                                scale={designStore.editorState.scale}
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
                <div class="preview-canvas" style={canvasStyle.value} ref={canvasRef}>
                    {
                        configData.value?.blocks.map((block) => {
                            return <BlockItem block={block} formData={props.formData}></BlockItem>
                        })
                    }
                </div>
            )

            // 左侧边兰
            const leftSidebar = (
                <SidebarPanel>
                    {
                        {
                            header: () => <div style={{ textAlign: 'center', fontWeight: "bold" }}>物料</div>,
                            default: () => <ComponentLib onItemDragstart={triggerMenuItemDragstart} onItemDragend={triggerMenuItemDragend}></ComponentLib>
                        }
                    }
                </SidebarPanel>
            );

            // 右侧边兰
            const rightSidebar = (
                <SidebarPanel>
                    {
                        {
                            header: () => {
                                if (!configData.value) return null;

                                if (lastSelectedBlock.value) {
                                    const compName = manager.getComponentByType(lastSelectedBlock.value.type).name;
                                    return `[${compName}]属性`;
                                } else {
                                    return '容器属性';
                                }
                            },
                            default: () => configData.value ? <PropsEditor configData={configData} block={lastSelectedBlock}></PropsEditor> : null
                        }
                    }
                </SidebarPanel>
            )

            return <div class={editorClass.value}>

                <EditorHeader configData={configData}></EditorHeader>

                <div class="editor-left-sidebar">{leftSidebar}</div>

                <div class="editor-container" ref={containerRef}>
                    <div class="editor-container__screen" ref={screenRef} onScroll={onScreenScroll}>
                        {/* <ActionHistory commandsState={commandsState}></ActionHistory> */}
                        {/* <CanvasScaler></CanvasScaler> */}

                        <div class="editor-container__wrapper" ref={wrapperRef}>
                            {designStore.editorState.isPreview ? previewCanvas : editorCanvas}
                        </div>
                    </div>
                    {!designStore.editorState.isPreview && <SketchRuler {...sketchRulerProps.value}></SketchRuler>}
                </div>

                <div class="editor-right-sidebar">{rightSidebar}</div>
            </div>
        }
    },
})