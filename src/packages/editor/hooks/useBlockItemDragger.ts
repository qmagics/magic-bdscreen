import { BlockData, ConfigData } from "@/types";
import { ComputedRef, reactive, WritableComputedRef } from "vue";
import events from "../events";
import { MarkLineData } from "../markline";
import { FocusData } from "./useFocus";

interface UseBlockItemDraggerArgs {
    configData: WritableComputedRef<ConfigData>,
    focusData: FocusData,
    lastSelectedBlock: ComputedRef<BlockData>
}

interface DragState {
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    isDragging: boolean;
    startPosList: { left: number, top: number }[];
    lines: {
        x: { showLeft: number, left: number }[],
        y: { showTop: number, top: number }[],
    };
}

/**
 * 获取所有可能会显示的参考线
 * @param unfocusedBlocks 所有未选中的区块
 * @param lastSelectedBlock 最后一个选中的区块
 */
function getLines(configData: WritableComputedRef<ConfigData>, unfocusedBlocks: BlockData[], lastSelectedBlock: BlockData): DragState['lines'] {
    const lines: DragState['lines'] = {
        x: [],
        y: []
    }

    // 将整个画布容器也视作一个区块，包含进参考线生成的逻辑中
    const containerBlock = {
        left: 0,
        top: 0,
        width: configData.value.container.width,
        height: configData.value.container.height
    }

    // 添加区块靠近时可能会产生的所有参考线
    const { width: BWidth, height: BHeight } = lastSelectedBlock;
    [...unfocusedBlocks, containerBlock].forEach(block => {
        const { left: ALeft, top: ATop, width: AWidth, height: AHeight } = block;

        lines.y.push({ showTop: ATop, top: ATop - BHeight! }); // 底对顶
        lines.y.push({ showTop: ATop, top: ATop }); // 顶对顶
        lines.y.push({ showTop: ATop + AHeight! / 2, top: ATop + AHeight! / 2 - BHeight! / 2 }); // 中对中
        lines.y.push({ showTop: ATop + AHeight!, top: ATop + AHeight! - BHeight! }); // 底对底
        lines.y.push({ showTop: ATop + AHeight!, top: ATop + AHeight! }); // 顶对底

        lines.x.push({ showLeft: ALeft, left: ALeft - BWidth! }); // 右对左
        lines.x.push({ showLeft: ALeft, left: ALeft }); // 左对左
        lines.x.push({ showLeft: ALeft + AWidth! / 2, left: ALeft + AWidth! / 2 - BWidth! / 2 }); // 中对中
        lines.x.push({ showLeft: ALeft + AWidth!, left: ALeft + AWidth! - BWidth! }); // 右对右
        lines.x.push({ showLeft: ALeft + AWidth!, left: ALeft + AWidth! }); // 左对右
    });

    return lines;
}

export const useBlockItemDragger = ({ configData, focusData, lastSelectedBlock }: UseBlockItemDraggerArgs) => {

    const dragState: DragState = {
        startX: 0,
        startY: 0,
        startLeft: 0,
        startTop: 0,
        isDragging: false,
        startPosList: [],
        lines: {
            x: [],
            y: []
        }
    }

    const markline: MarkLineData = reactive({
        x: null,
        y: null
    });

    const triggerMousedown = (e: MouseEvent) => {
        dragState.startX = e.clientX;
        dragState.startY = e.clientY;
        dragState.startLeft = lastSelectedBlock.value.left;
        dragState.startTop = lastSelectedBlock.value.top;
        dragState.startPosList = focusData.value.focused.map(({ left, top }) => ({ left, top }));
        dragState.lines = getLines(configData, focusData.value.unfocused, lastSelectedBlock.value);

        document.addEventListener('mousemove', onMousemove);
        document.addEventListener('mouseup', onMouseup);
    }

    const onMousemove = (e: MouseEvent) => {
        // 触发拖拽前事件
        if (!dragState.isDragging) {
            dragState.isDragging = true;
            events.emit('dragMoveStart');
        }

        let { clientX: endX, clientY: endY } = e;

        // 最后一个选中区块的最新位置
        const newLeft = endX - dragState.startX + dragState.startLeft;
        const newTop = endY - dragState.startY + dragState.startTop;

        // 辅助线位置
        let x = null, y = null;

        // 计算辅助线位置 横向
        for (let i = 0; i < dragState.lines.y.length; i++) {
            const { showTop: s, top: t } = dragState.lines.y[i];

            // 判断是否接近
            if (Math.abs(newTop - t) < 5) {
                y = s;
                endY = dragState.startY - dragState.startTop + t;
                break;
            }
        }

        // 计算辅助线位置 纵向
        for (let i = 0; i < dragState.lines.x.length; i++) {
            const { showLeft: s, left: l } = dragState.lines.x[i];

            // 判断是否接近
            if (Math.abs(newLeft - l) < 5) {
                x = s;
                endX = dragState.startX - dragState.startLeft + l;
                break;
            }
        }

        // 更新辅助线UI
        markline.y = y;
        markline.x = x;

        // 移动的距离
        const durX = endX - dragState.startX;
        const durY = endY - dragState.startY;

        // 给所有拖拽的区块设置最新位置
        focusData.value.focused.forEach((block, index) => {
            const { left, top } = dragState.startPosList[index];
            block.left = left + durX;
            block.top = top + durY;
        })
    }

    const onMouseup = (e: MouseEvent) => {
        document.removeEventListener('mousemove', onMousemove);
        document.removeEventListener('mouseup', onMouseup);
        markline.x = null;
        markline.y = null;

        // 触发拖拽后事件
        if (dragState.isDragging) {
            dragState.isDragging = false;
            events.emit('dragMoveEnd', lastSelectedBlock.value);
        }
    }

    return {
        triggerMousedown,
        markline
    }
}