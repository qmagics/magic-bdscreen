import { BlockData } from "@/types";
import { MANAGER_KEY } from "@/utils/const";
import { computed, defineComponent, inject, PropType, StyleValue } from "vue";

export default defineComponent({
    props: {
        block: {
            type: Object as PropType<BlockData>,
            required: true
        }
    },
    setup: (props) => {
        const blockStyle = computed<StyleValue>(() => {
            const { left, top } = props.block;
            return {
                left: `${left}px`,
                top: `${top}px`
            }
        });

        const manager = inject(MANAGER_KEY)!;

        return () => {
            const { componentMap } = manager;
            const { render } = componentMap[props.block.type];

            const renderedComponent = render();

            return <div class="block-item" style={blockStyle.value}>
                {renderedComponent}
            </div>
        }
    }
})