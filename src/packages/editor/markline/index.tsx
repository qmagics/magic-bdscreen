import { defineComponent, PropType } from "vue";

export interface MarkLineData {
    x: number | null;
    y: number | null;
}

export default defineComponent({
    props: {
        data: {
            required: true,
            type: Object as PropType<MarkLineData>
        }
    },
    setup(props) {
        const { data } = props;
        return () => {
            return <>
                {data.x !== null ? <div class="markline markline-x" style={{ left: data.x + 'px' }}></div> : null}
                {data.y !== null ? <div class="markline markline-y" style={{ top: data.y + 'px' }}></div> : null}
            </>
        }
    }
})