import { MANAGER_KEY } from "@/packages/tokens";
import { ConfigData, RegisterComponent } from "@/types";
import { inject, ref, Ref, WritableComputedRef } from "vue";
import events from "../events";

interface UseMenuDraggerArgs {
    canvasRef: Ref<HTMLDivElement>;
    configData: WritableComputedRef<ConfigData>;
}

export const useMenuDragger = ({ canvasRef, configData }: UseMenuDraggerArgs) => {

    const manager = inject(MANAGER_KEY)!;

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

        const component = manager.getComponentByType(currentComponent.value!.type);

        const { defaultProps, defaultSize } = component;

        const newConfigData = {
            ...configData.value,
            blocks: [
                ...blocks,
                {
                    top: e.offsetY,
                    left: e.offsetX,
                    zIndex: 1,
                    type: currentComponent.value!.type,
                    alignCenterWhenDrop: true,
                    props: defaultProps,
                    size: defaultSize || {}
                }
            ]
        }

        configData.value = newConfigData;

        currentComponent.value = null;
    }

    // 触发物料的拖拽开始事件
    const triggerMenuItemDragstart = (e: Event, component: RegisterComponent) => {
        canvasRef.value.addEventListener('dragenter', onDragenter);
        canvasRef.value.addEventListener('dragover', onDragover);
        canvasRef.value.addEventListener('dragleave', onDragleave);
        canvasRef.value.addEventListener('drop', onDrop);

        currentComponent.value = component;
        events.emit('dragAddStart');
    }

    // 触发物料的拖拽结束事件
    const triggerMenuItemDragend = (e: Event, component: RegisterComponent) => {
        canvasRef.value.removeEventListener('dragenter', onDragenter);
        canvasRef.value.removeEventListener('dragover', onDragover);
        canvasRef.value.removeEventListener('dragleave', onDragleave);
        canvasRef.value.removeEventListener('drop', onDrop);

        events.emit('dragAddEnd', component);
    }

    return {
        triggerMenuItemDragstart,
        triggerMenuItemDragend
    }
}