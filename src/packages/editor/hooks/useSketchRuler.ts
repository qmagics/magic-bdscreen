import { ConfigData } from "@/types"
import { computed, onMounted, reactive, WritableComputedRef } from "vue"

export const useSketchRuler = (configData: WritableComputedRef<ConfigData>, screenRef: any, scrollContainerRef: any) => {
    // const sketchRulerProps = computed(() => {
    //     const { width, height } = configData.value.container;
    //     return {
    //         width,
    //         height
    //     }
    // });

    const sketchRulerProps = reactive({
        width: 0,
        height: 0,
        thick: 16
    });

    onMounted(() => {
        const wrapperRect = screenRef.value.getBoundingClientRect();
        console.log(wrapperRect)
        const borderWidth = 1;
        sketchRulerProps.width = wrapperRect.width - sketchRulerProps.thick - borderWidth;
        sketchRulerProps.height = wrapperRect.height - sketchRulerProps.thick - borderWidth;
    });

    return {
        sketchRulerProps
    }
}