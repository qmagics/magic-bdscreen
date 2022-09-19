import { ConfigData, RegisterComponent } from "@/types"
import { ref, Ref, WritableComputedRef } from "vue"

export const useMenuDragger = ({ canvasRef, configData }: { canvasRef: Ref<HTMLDivElement>, configData: WritableComputedRef<ConfigData> }) => {

    const currentComponent = ref<RegisterComponent | null>();

    const onDragenter = (e: DragEvent) => {
        e.dataTransfer!.dropEffect = 'move';
    }

    const onDragover = (e: DragEvent) => {
        e.preventDefault();
    }

    const onDragleave = (e: DragEvent) => {
        e.dataTransfer!.dropEffect = 'none';
    }

    const onDrop = (e: DragEvent) => {
        const blocks = configData.value.blocks;

        const newConfigData = {
            ...configData.value,
            blocks: [
                ...blocks,
                {
                    top: e.offsetY,
                    left: e.offsetX,
                    zIndex: 1,
                    type: currentComponent.value!.type,
                    alignCenterWhenDrop:true
                }
            ]
        }

        configData.value = newConfigData;

        currentComponent.value = null;
    }

    // 触发物料的拖拽开始事件
    const triggerMenuItemDragstart = (e: Event, component: RegisterComponent) => {
        currentComponent.value = component;

        canvasRef.value.addEventListener('dragenter', onDragenter);
        canvasRef.value.addEventListener('dragover', onDragover);
        canvasRef.value.addEventListener('dragleave', onDragleave);
        canvasRef.value.addEventListener('drop', onDrop);
    }

    return {
        triggerMenuItemDragstart
    }
}