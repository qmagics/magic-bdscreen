import { BlockData, ConfigData } from "@/types";
import { computed, ComputedRef, ref, WritableComputedRef } from "vue";

interface UseFocusArgs {
    configData: WritableComputedRef<ConfigData>;

    /** 区块按下后的回调 */
    onBlockMousedown?: (e: MouseEvent) => void;
}

export type FocusData = ComputedRef<{ focused: BlockData[], unfocused: BlockData[] }>

export const useFocus = ({ configData, onBlockMousedown }: UseFocusArgs) => {

    // 选中的索引
    const selectedIndex = ref(-1);

    // 最后选中的block
    const lastSelectedBlock = computed(() => {
        return configData.value.blocks[selectedIndex.value]
    });

    // 选中和未选中数据
    const focusData: FocusData = computed(() => {
        const focused: BlockData[] = [], unfocused: BlockData[] = [];

        configData.value.blocks.forEach(block => (block.isFocused ? focused : unfocused).push(block));

        return { focused, unfocused }
    });

    // 取消所有区块选中效果
    const clearBlocksFocused = () => {
        configData.value.blocks.forEach(block => block.isFocused = false);
        selectedIndex.value = -1;
    }

    // 触发区块Mousedown事件
    const triggerBlockItemMousedown = (e: MouseEvent, block: BlockData, index: number) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.shiftKey) {
            if (focusData.value.focused.length <= 1) {
                block.isFocused = true;
            }
            else {
                block.isFocused = !block.isFocused;
            }
        }
        else {
            if (!block.isFocused) {
                clearBlocksFocused();
                block.isFocused = true;
            }
        }

        selectedIndex.value = index;
        onBlockMousedown?.call(null, e);
    }

    return {
        clearBlocksFocused,
        triggerBlockItemMousedown,
        focusData,
        lastSelectedBlock
    }
}