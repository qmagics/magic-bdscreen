import { MANAGER_KEY } from "@/packages/tokens";
import useDesignStore from "@/store/design";
import { BlockData } from "@/types";
import { computed, defineComponent, inject, onMounted, PropType, ref, Ref, StyleValue } from "vue";
import BlockResizer from "../block-resizer";

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
        scale: {
            type: Number,
            default: 1
        }
    },
    setup: (props) => {
        const designStore = useDesignStore();

        const manager = inject(MANAGER_KEY)!;

        const blockRef = ref<HTMLDivElement>();

        const blockStyle = computed<StyleValue>(() => {
            let { left, top, zIndex } = props.block;

            // left = left * props.scale;
            // top = top * props.scale;

            return {
                left: `${left}px`,
                top: `${top}px`,
                zIndex: zIndex
            }
        });

        useAdjustElement(props.block, blockRef);

        return () => {
            const component = manager.getComponentByType(props.block.type);

            let { width, height } = props.block.size;

            // width = (width || 0) * props.scale;
            // height = (height || 0) * props.scale;

            const renderedComponent = component.render({
                props: props.block.props || {},
                size: { width, height }
            });

            return <div class="block-item" ref={blockRef} style={blockStyle.value}>
                {renderedComponent}
                {(!designStore.editorState.isPreview && props.block.isFocused) ? <BlockResizer block={props.block} component={component}></BlockResizer> : null}
            </div>
        }
    }
})