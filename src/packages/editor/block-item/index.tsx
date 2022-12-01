import { MANAGER_KEY } from "@/packages/tokens";
import useDesignStore from "@/store/design";
import { BlockData, FormModel, RenderContextState } from "@/types";
import { computed, defineComponent, inject, onMounted, PropType, reactive, ref, Ref, StyleValue, toRef, watch } from "vue";
import BlockResizer from "../block-resizer";
import { afterScale, beforeScale } from "../utils";
import { useData } from "@/packages/hooks/useData";
import { watchDebounced } from "@vueuse/core";
import config from "@/config";

// 校正和补充元素属性
const useAdjustElement = (block: BlockData, blockRef: Ref<HTMLDivElement | undefined>) => {
    onMounted(() => {
        const { clientWidth, clientHeight } = blockRef.value!;

        if (block.alignCenterWhenDrop) {
            block.left = block.left - clientWidth / 2;
            block.top = block.top - clientHeight / 2;
            block.alignCenterWhenDrop = false;
        }

        block.size.width = beforeScale(clientWidth);
        block.size.height = beforeScale(clientHeight);
    });
}

export default defineComponent({
    props: {
        block: {
            type: Object as PropType<BlockData>,
            required: true
        },
        formData: {
            type: Object as PropType<FormModel>,
            required: true
        }
    },
    setup: (props) => {
        const designStore = useDesignStore();

        const manager = inject(MANAGER_KEY)!;

        const blockRef = ref<HTMLDivElement>();

        const state = reactive<RenderContextState>({
            loading: false
        });

        const blockStyle = computed<StyleValue>(() => {
            let { left, top, zIndex } = props.block;

            left = afterScale(left);
            top = afterScale(top);

            return {
                left: `${left}px`,
                top: `${top}px`,
                zIndex: zIndex
            }
        });

        useAdjustElement(props.block, blockRef);

        const { data, refresh, loading } = useData({ block: toRef(props, 'block') });
        watch(loading, v => state.loading = v);

        watchDebounced([
            () => props.block.datasource?.apiUrl,
            () => props.block.datasource?.type,
            () => props.block.datasource?.staticData,
            () => props.block.datasource?.formatter
        ], refresh, { immediate: true, debounce: config.dataRefreshDebounce });

        return () => {
            const component = manager.getComponentByType(props.block.type);

            let { width, height } = props.block.size;

            width = afterScale(width);
            height = afterScale(height);

            const renderedComponent = component.render({
                props: props.block.props || {},
                size: { width, height },
                data: data.value,
                state,
                model: Object.keys(component.model || {}).reduce((pre: any, modelName: string) => {
                    let propName = props.block.model[modelName];

                    pre[modelName] = {
                        modelValue: props.formData[propName],
                        'onUpdate:modelValue': (v: any) => props.formData[propName] = v
                    }

                    return pre;
                }, {})
            });

            return <div class="block-item" ref={blockRef} style={blockStyle.value}>
                {renderedComponent}
                {(!designStore.editorState.isPreview && props.block.isFocused) ? <BlockResizer block={props.block} component={component}></BlockResizer> : null}
            </div>
        }
    }
})