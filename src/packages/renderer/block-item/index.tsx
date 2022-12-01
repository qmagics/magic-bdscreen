import { MANAGER_KEY } from "@/packages/tokens";
import { BlockData, FormModel, RenderContextState } from "@/types";
import { computed, defineComponent, inject, onMounted, PropType, reactive, ref, Ref, StyleValue, toRef, watch } from "vue";
import { useData } from "@/packages/hooks/useData";

// 校正和补充元素属性
const useAdjustElement = (block: BlockData, blockRef: Ref<HTMLDivElement | undefined>) => {
    onMounted(() => {
        const { clientWidth, clientHeight } = blockRef.value!;

        if (block.alignCenterWhenDrop) {
            block.left = block.left - clientWidth / 2;
            block.top = block.top - clientHeight / 2;
            block.alignCenterWhenDrop = false;
        }

        block.size.width = clientWidth;
        block.size.height = clientHeight;
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
        const manager = inject(MANAGER_KEY)!;

        const blockRef = ref<HTMLDivElement>();

        const state = reactive<RenderContextState>({
            loading: false
        });

        const blockStyle = computed<StyleValue>(() => {
            let { left, top, zIndex } = props.block;

            return {
                left: `${left}px`,
                top: `${top}px`,
                zIndex: zIndex
            }
        });

        useAdjustElement(props.block, blockRef);

        const { data, loading, refresh } = useData({ block: toRef(props, 'block') });
        watch(loading, v => state.loading = v);

        return () => {
            const component = manager.getComponentByType(props.block.type);

            let { width, height } = props.block.size;

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
            </div>
        }
    }
})