import useDesignStore from "@/store/design";
import { ConfigData } from "@/types";
import { computed, nextTick, onMounted, reactive, Ref, watch, WritableComputedRef } from "vue";

interface UseSketchRulerArgs {
    configData: WritableComputedRef<ConfigData>;
    containerRef: Ref<HTMLDivElement>;
    screenRef: Ref<HTMLDivElement>;
    wrapperRef: Ref<HTMLDivElement>;
    canvasRef: Ref<HTMLDivElement>;
}

export const useSketchRuler = ({ configData, containerRef, screenRef, wrapperRef, canvasRef }: UseSketchRulerArgs) => {

    const { editorState } = useDesignStore();

    const sketchRulerProps = reactive({
        width: 0,
        height: 0,
        startX: 0,
        startY: 0,
        thick: 16,
    });

    const shadow = computed(() => {
        return {
            x: 0,
            y: 0,
            width: configData.value.container.width,
            height: configData.value.container.height
        }
    });

    onMounted(() => {
        initSize();

        scrollToCenter();
    });

    // 初始化比例尺宽高
    const initSize = () => {
        const screenRect = screenRef.value.getBoundingClientRect();
        const borderWidth = 1;
        sketchRulerProps.width = screenRect.width - sketchRulerProps.thick - borderWidth;
        sketchRulerProps.height = screenRect.height - sketchRulerProps.thick - borderWidth;
    }

    // 刷新比例尺开始坐标
    const refreshRulerStartPos = () => {
        const screensRect = screenRef.value.getBoundingClientRect();
        const canvasRect = canvasRef.value.getBoundingClientRect();

        const startX = (screensRect.left + sketchRulerProps.thick - canvasRect.left) / editorState.scale;
        const startY = (screensRect.top + sketchRulerProps.thick - canvasRect.top) / editorState.scale;

        sketchRulerProps.startX = startX >> 0;
        sketchRulerProps.startY = startY >> 0;
    }

    // 画布滚到中间来
    const scrollToCenter = () => {
        const wrapperRect = wrapperRef.value.getBoundingClientRect();
        // const containerRect = containerRef.value.getBoundingClientRect();
        const screenRect = screenRef.value.getBoundingClientRect();

        screenRef.value.scrollLeft = wrapperRect.width / 2 - screenRect.width / 2;
    }

    // 编辑区屏幕滚动事件
    const onScreenScroll = () => {
        refreshRulerStartPos();
    }

    // 画布宽高变更，需要重新计算比例尺开始坐标
    watch(() => configData.value.container, async () => {
        await nextTick();
        refreshRulerStartPos();
    }, { deep: true, immediate: true })

    return {
        sketchRulerProps: computed(() => {
            return {
                ...sketchRulerProps,
                shadow: shadow.value
            }
        }),
        onScreenScroll
    }
}