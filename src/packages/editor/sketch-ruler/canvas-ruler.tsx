import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { CanvasConfig } from "./type";
import { drawHorizontalRuler, drawVerticalRuler } from "./utils";

export default defineComponent({
    props: {
        vertical: Boolean,
        start: {
            type: Number,
            required: true
        },
        scale: {
            type: Number,
            required: true
        },
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        canvasConfigs: {
            type: Object as PropType<CanvasConfig>,
            required: true
        },
        selectStart: {
            type: Number,
            required: true
        },
        selectLength: {
            type: Number,
            required: true
        },
    },
    setup(props) {
        const canvasRef = ref<HTMLCanvasElement>();

        let canvasContext: CanvasRenderingContext2D | null;

        const drawRuler = () => {
            if (!canvasRef.value || !canvasContext) return;

            const { start, scale, width, height, canvasConfigs, vertical, selectStart, selectLength } = props;

            const options = {
                scale,
                width,
                height,
                canvasConfigs
            }

            if (vertical) {
                drawVerticalRuler(canvasContext, start, { y: selectStart, height: selectLength }, options)
            } else {
                drawHorizontalRuler(canvasContext, start, { x: selectStart, width: selectLength }, options)
            }
        }

        const updateContext = () => {
            const { width, height, canvasConfigs: { ratio } } = props;

            if (!canvasRef.value || !canvasContext) return;

            // 比例宽高
            canvasRef.value.width = width * ratio;
            // console.log(width);
            canvasRef.value.height = height * ratio;

            canvasContext.font = `${12 * ratio}px -apple-system, 
                "Helvetica Neue", ".SFNSText-Regular", 
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB", 
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`;
            canvasContext.lineWidth = 1;
            canvasContext.textBaseline = 'middle';
        }

        watch(() => props.start, drawRuler);
        watch([() => props.width, () => props.height], () => {
            updateContext();
            drawRuler();
        });

        onMounted(() => {
            canvasContext = canvasRef.value!.getContext('2d');
            updateContext();
            drawRuler();
        });

        return () => {
            return (
                <canvas class="canvas-ruler" ref={canvasRef}></canvas>
            )
        }
    }
});