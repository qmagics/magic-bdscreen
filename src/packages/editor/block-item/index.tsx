import { BlockData } from "@/types";
import { MANAGER_KEY } from "@/utils/const";
import { computed, defineComponent, inject, onMounted, PropType, ref, Ref, StyleValue } from "vue";

// 校正和补充元素属性
const useAdjustElement = (block: BlockData, blockRef: Ref<HTMLDivElement | undefined>) => {
    onMounted(() => {
        const { clientWidth, clientHeight } = blockRef.value!;

        if (block.alignCenterWhenDrop) {
            block.left = block.left - clientWidth / 2;
            block.top = block.top - clientHeight / 2;
            block.alignCenterWhenDrop = false;
        }

        block.width = clientWidth;
        block.height = clientHeight;
    });
}

export default defineComponent({
    props: {
        block: {
            type: Object as PropType<BlockData>,
            required: true
        }
    },
    setup: (props) => {
        const manager = inject(MANAGER_KEY)!;
        const blockRef = ref<HTMLDivElement>();

        const blockStyle = computed<StyleValue>(() => {
            const { left, top, zIndex } = props.block;
            return {
                left: `${left}px`,
                top: `${top}px`,
                zIndex: zIndex
            }
        });

        useAdjustElement(props.block, blockRef);

        return () => {
            const { componentMap } = manager;
            const { render } = componentMap[props.block.type];

            const renderedComponent = render();

            return <div class="block-item" ref={blockRef} style={blockStyle.value}>
                {renderedComponent}
            </div>
        }
    }
})