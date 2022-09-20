import { BlockData } from "@/types";
import { ComputedRef } from "vue";
import { FocusData } from "./useFocus";

interface UseBlockItemDraggerArgs {
    focusData: FocusData,
    lastSelectedBlock: ComputedRef<BlockData>
}

interface DragState {
    startX: number;
    startY: number;
    startPosList: { left: number, top: number }[];
    lines: {
        x: { showTop: number, top: number }[],
        y: { showLeft: number, left: number }[]
    };
}

/**
 * 获取所有可能会显示的参考线
 * @param unfocusedBlocks 所有未选中的区块
 * @param lastSelectedBlock 最后一个选中的区块
 */
function getLines(unfocusedBlocks: BlockData[], lastSelectedBlock: BlockData): DragState['lines'] {
    const lines = {
        x: [],
        y: []
    }

    return lines;
}

export const useBlockItemDragger = ({ focusData, lastSelectedBlock }: UseBlockItemDraggerArgs) => {

    const dragState: DragState = {
        startX: 0,
        startY: 0,
        startPosList: [],
        lines: {
            x: [],
            y: []
        }
    }

    const triggerMousedown = (e: MouseEvent) => {
        dragState.startX = e.clientX;
        dragState.startY = e.clientY;
        dragState.startPosList = focusData.value.focused.map(({ left, top }) => ({ left, top }));
        dragState.lines = getLines(focusData.value.unfocused, lastSelectedBlock.value);

        document.addEventListener('mousemove', onMousemove);
        document.addEventListener('mouseup', onMouseup);
    }

    const onMousemove = (e: MouseEvent) => {
        const { clientX: endX, clientY: endY } = e;

        const durX = endX - dragState.startX;
        const durY = endY - dragState.startY;

        focusData.value.focused.forEach((block, index) => {
            const { left, top } = dragState.startPosList[index];
            block.left = left + durX;
            block.top = top + durY;
        })
    }

    const onMouseup = (e: MouseEvent) => {
        document.removeEventListener('mousemove', onMousemove);
        document.removeEventListener('mouseup', onMouseup);
    }


    return {
        triggerMousedown
    }

}