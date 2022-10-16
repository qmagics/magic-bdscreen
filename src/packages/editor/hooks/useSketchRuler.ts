import useDesignStore from "@/store/design";
import { ConfigData } from "@/types";
import { nextTick, onMounted, reactive, WritableComputedRef } from "vue";

export const useSketchRuler = (configData: WritableComputedRef<ConfigData>, containerRef: any, screenRef: any, wrapperRef: any, canvasRef: any) => {

    const { editorState } = useDesignStore();

    const sketchRulerProps = reactive({
        width: 0,
        height: 0,
        startX: 0,
        startY: 0,
        thick: 16
    });

    onMounted(async () => {
        initSize();

        await nextTick();

        scrollToCenter();

        onScreenScroll();
    });

    // 初始化宽高
    const initSize = () => {
        const screenRect = screenRef.value.getBoundingClientRect();
        const borderWidth = 1;
        sketchRulerProps.width = screenRect.width - sketchRulerProps.thick - borderWidth;
        sketchRulerProps.height = screenRect.height - sketchRulerProps.thick - borderWidth;
    }

    // 滚到中间
    const scrollToCenter = async () => {
        const contsinerRect = containerRef.value.getBoundingClientRect();
        // const screenRect = screenRef.value.getBoundingClientRect();
        // const wrapperRef = screenRef.value.getBoundingClientRect();

        screenRef.value.scrollLeft = contsinerRect.width / 2 - configData.value.container.width;
    }

    // 滚动
    const onScreenScroll = () => {
        const screensRect = screenRef.value.getBoundingClientRect();
        const canvasRect = canvasRef.value.getBoundingClientRect();

        // 标尺开始的刻度
        const startX = (screensRect.left + sketchRulerProps.thick - canvasRect.left) / editorState.scale;
        const startY = (screensRect.top + sketchRulerProps.thick - canvasRect.top) / editorState.scale;

        sketchRulerProps.startX = startX >> 0;
        sketchRulerProps.startY = startY >> 0;
    }

    return {
        sketchRulerProps,
        onScreenScroll
    }
}