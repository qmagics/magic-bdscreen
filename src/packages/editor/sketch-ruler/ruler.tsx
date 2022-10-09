import { computed, defineComponent, PropType, reactive, StyleValue, watch } from "vue";
import CanvasRuler from "./canvas-ruler";
import { CanvasConfig } from "./type";

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
        thick: {
            type: Number,
            required: true
        },
        palette: Object as PropType<any>,
        isShowReferLine: Boolean,
    },
    setup(props) {
        const state = reactive({
            isDraggingLine: false,
            showIndicator: false,
            indicatorValue: 0
        });

        const classes = computed(() => props.vertical ? 'v-ruler' : 'h-ruler');
        const styles = computed<StyleValue>(() => {
            const { thick, vertical } = props;

            const hContainer = {
                width: `calc(100% - ${thick}px)`,
                height: `${thick + 1}px`,
                left: `${thick}` + 'px',
            }
            const vContainer = {
                width: `${thick + 1}px`,
                height: `calc(100% - ${thick}px)`,
                top: `${thick}` + 'px',
            }
            return vertical ? vContainer : hContainer;
        });
        const indicatorStyle = computed<StyleValue>(() => {
            const { start, scale, vertical, palette } = props;
            const indicatorOffset = (state.indicatorValue - start) * scale;
            let positionKey = 'top';
            let boderKey = 'borderLeft'
            positionKey = vertical ? 'top' : 'left';
            boderKey = vertical ? 'borderBottom' : 'borderLeft';
            return {
                [positionKey]: indicatorOffset + 'px',
                [boderKey]: `1px solid ${palette.lineColor}`,
            };
        });

        return () => {
            const { start, scale, width, height, canvasConfigs, vertical, selectStart, selectLength } = props;

            const canvasRulerProps = {
                start, scale, width, height, canvasConfigs, vertical, selectStart, selectLength
            }

            return <div class={classes.value} style={styles.value}>
                <CanvasRuler {...canvasRulerProps}></CanvasRuler>

                <div class="indicator" style={indicatorStyle.value} v-show={state.showIndicator}>
                    <div class="value">{state.indicatorValue}</div>
                </div>
            </div>
        }
    }
});