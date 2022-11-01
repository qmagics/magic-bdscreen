import { CodeEditor } from "@/components/code-editor";
import { Dialog } from "@/components/dialog";
import { Dropdown } from "@/components/dropdown";
import DropdownItem from "@/components/dropdown/src/dropdown-item";
import { BlockData } from "@/types"
import { editCode, viewCode } from "@/utils/code-dialog";
import { ref } from "vue";
import { parseJSON, serializeJSON } from "../utils";
import { UseCommandsState } from "./useCommands";

interface DropdownButtonData {
    label: string;
    icon?: string;
    handler: (e: MouseEvent, block: BlockData) => void;
}

export const useBlockItemContextmenu = (commands: UseCommandsState['commands']) => {

    const items = ref<DropdownButtonData[]>([
        {
            label: "删除",
            handler: () => commands.delete()
        },
        {
            label: "置顶",
            handler: () => commands.placeTop()
        },
        {
            label: "置底",
            handler: () => commands.placeBottom()
        },
        {
            label: "查看JSON",
            handler(e, block) {
                viewCode({
                    title: "查看区块JSON",
                    language:"json",
                    code: serializeJSON(block)
                })
            }
        },
        {
            label: "导入",
            handler(e, block) {
                editCode({
                    title: "导入区块JSON",
                    language:"json",
                    code: serializeJSON(block),
                    onConfirm(code) {
                        const newBlock = parseJSON(code);
                        commands.updateBlock(newBlock, block);
                    },
                });
            }
        }
    ]);

    const triggerContextmenu = (e: MouseEvent, block: BlockData) => {
        e.preventDefault();
        const el = e.target as HTMLElement;

        Dropdown({
            event: e,
            el,
            render() {
                return (<>
                    {items.value.map(item => <DropdownItem label={item.label} icon={item.icon} onClick={e => item.handler(e, block)}></DropdownItem>)}
                </>)
            }
        })

    }

    return {
        triggerContextmenu
    }
}