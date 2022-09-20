import { BlockData } from "@/types";
import { ComputedRef, reactive } from "vue";
import { FocusData } from "./useFocus";

interface UseBlockItemDraggerArgs {
    focusData: FocusData,
    lastSelectedBlock: ComputedRef<BlockData>
}

interface DragState {
    startX: number;
    startY: number;
    startTop: number;
    startLeft: number;
    startPosList: { left: number, top: number }[];
    lines: {
        x: { showLeft: number, left: number }[],
        y: { showTop: number, top: number }[],
    };
}

export interface MarkLine {
    x: number | null;
    y: number | null;
}

/**
 * 获取所有可能会显示的参考线
 * @param unfocusedBlocks 所有未选中的区块
 * @param lastSelectedBlock 最后一个选中的区块
 */
function getLines(unfocusedBlocks: BlockData[], lastSelectedBlock: BlockData): DragState['lines'] {
    const lines: DragState['lines'] = {
        x: [],
        y: []
    }

    const { left: BLeft, top: BTop, width: BWidth, height: BHeight } = lastSelectedBlock;

    unfocusedBlocks.forEach(block => {
        const { left: ALeft, top: ATop, width: AWidth, height: AHeight } = block;

        lines.y.push({ showTop: ATop, top: ATop - BHeight! }); // 底对顶
        lines.y.push({ showTop: ATop, top: ATop }); // 顶对顶
        lines.y.push({ showTop: ATop + AHeight! / 2, top: ATop + AHeight! / 2 - BHeight! / 2 }); // 中对中
        lines.y.push({ showTop: ATop + AHeight!, top: ATop + AHeight! - BHeight! }); // 底对底
        lines.y.push({ showTop: ATop + AHeight!, top: ATop + AHeight! }); // 顶对底
    })

    return lines;
}

export const useBlockItemDragger = ({ focusData, lastSelectedBlock }: UseBlockItemDraggerArgs) => {

    const dragState: DragState = {
        startX: 0,
        startY: 0,
        startLeft: 0,
        startTop: 0,
        startPosList: [],
        lines: {
            x: [],
            y: []
        }
    }

    // 辅助线
    const markLine: MarkLine = reactive({
        x: 0,
        y: 0
    });

    const triggerMousedown = (e: MouseEvent) => {
        dragState.startX = e.clientX;
        dragState.startY = e.clientY;
        dragState.startLeft = lastSelectedBlock.value.left;
        dragState.startTop = lastSelectedBlock.value.top;
        dragState.startPosList = focusData.value.focused.map(({ left, top }) => ({ left, top }));
        dragState.lines = getLines(focusData.value.unfocused, lastSelectedBlock.value);

        document.addEventListener('mousemove', onMousemove);
        document.addEventListener('mouseup', onMouseup);
    }

    const onMousemove = (e: MouseEvent) => {
        let { clientX: endX, clientY: endY } = e;

        const left = endX - dragState.startX + dragState.startLeft;
        const top = endY - dragState.startY + dragState.startTop;

        let y = null;
        let x = null;
        for (let i = 0; i < dragState.lines.y.length; i++) {
            // 获取每根线
            const { top: t, showTop: s } = dragState.lines.y[i];

            if (Math.abs(t - top) < 5) {  // 判断是否接近
                y = s;
                endY = dragState.startY - dragState.startTop + t;
                break;
            }
        }
        markLine.y = y;

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
        markLine.x = null;
        markLine.y = null;
    }


    return {
        triggerMousedown,
        markLine
    }

}