import { defineComponent, PropType } from "vue";
import type { MarkLine } from "./useBlockItemDragger";

export default defineComponent({
    props: {
        markLine: {
            required: true,
            type: Object as PropType<MarkLine>
        }
    },
    setup(props) {
        const { markLine } = props;
        return () => {
            return <div>
                {markLine.x ? <div class="mark-line mark-line-x" style={{ top: markLine.x + 'px' }}></div> : null}
                {markLine.y ? <div class="mark-line mark-line-y" style={{ top: markLine.y + 'px' }}></div> : null}
            </div>
        }
    }
})