import { BlockData } from "@/types";
import { MANAGER_KEY } from "@/utils/const";
import { computed, defineComponent, inject, onMounted, PropType, ref, Ref, StyleValue } from "vue";

const useAlignCenterWhenDrop = (block: BlockData, blockRef: Ref<HTMLDivElement | undefined>) => {
    onMounted(() => {
        if (block.alignCenterWhenDrop) {
            const { clientWidth, clientHeight } = blockRef.value!;
            block.left = block.left - clientWidth / 2;
            block.top = block.top - clientHeight / 2;
            block.alignCenterWhenDrop = false;
        }
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

        // 放下时位置相对放置点居中
        useAlignCenterWhenDrop(props.block, blockRef);

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