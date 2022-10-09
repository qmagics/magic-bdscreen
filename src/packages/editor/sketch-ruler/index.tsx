import { computed, defineComponent, PropType } from "vue";
import Ruler from "./ruler";

export default defineComponent({
    props: {
        scale: {
            type: Number,
            default: 1,
        },
        ratio: {
            type: Number,
            default: window.devicePixelRatio || 1,
        },
        thick: {
            type: Number,
            default: 20,
        },
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        startX: {
            type: Number,
            default: 0,
        },
        startY: {
            type: Number,
            default: 0,
        },
        shadow: {
            type: Object as PropType<{ x: number, y: number, width: number, height: number }>,
            default: () => {
                return {
                    x: 200,
                    y: 100,
                    width: 200,
                    height: 400
                };
            },
        },
        palette: {
            type: Object as PropType<any>,
            default: () => {
                return {
                    bgColor: 'rgba(225,225,225, 0)', // ruler bg color
                    longfgColor: '#BABBBC', // ruler longer mark color
                    shortfgColor: '#C8CDD0', // ruler shorter mark color
                    fontColor: '#7D8694', // ruler font color
                    shadowColor: '#E8E8E8', // ruler shadow color
                    lineColor: '#EB5648',
                    borderColor: '#DADADC',
                    cornerActiveColor: 'rgb(235, 86, 72, 0.6)'
                }
            },
        }
    },

    setup(props) {

        const canvasConfigs = computed(() => {
            const {
                bgColor,
                longfgColor,
                shortfgColor,
                fontColor,
                shadowColor,
                lineColor,
                borderColor,
                cornerActiveColor
            } = props.palette;

            return {
                ratio: props.ratio,
                bgColor,
                longfgColor,
                shortfgColor,
                fontColor,
                shadowColor,
                lineColor,
                borderColor,
                cornerActiveColor
            }
        });

        return () => {
            const { startX, startY, scale, width, height, thick, shadow, palette } = props;

            const rulerH_Props = {
                vertical: false,
                width,
                height: thick,
                thick,
                start: startX,
                selectStart: shadow.x,
                selectLength: shadow.width,
                scale,
                canvasConfigs: canvasConfigs.value,
                palette
            }

            const rulerV_Props = {
                vertical: true,
                width: thick,
                height,
                thick,
                start: startY,
                selectStart: shadow.y,
                selectLength: shadow.height,
                scale,
                canvasConfigs: canvasConfigs.value,
                palette
            }

            return <div class="sketch-ruler">
                <Ruler {...rulerH_Props} />
                <Ruler {...rulerV_Props} />
            </div>
        }
    }
});