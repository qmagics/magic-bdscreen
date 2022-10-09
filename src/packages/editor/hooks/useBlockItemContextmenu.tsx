import { Dialog } from "@/components/dialog";
import { Dropdown } from "@/components/dropdown";
import DropdownItem from "@/components/dropdown/src/dropdown-item";
import { BlockData } from "@/types"
import { ElInput } from "element-plus";
import { ref } from "vue";
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
                Dialog({
                    title: "查看区块JSON",
                    render() {
                        return <ElInput type="textarea" modelValue={JSON.stringify(block)} rows={10}></ElInput>
                    },
                    btns: false,
                })
            }
        },
        {
            label: "导入",
            handler(e, block) {
                const dlg = Dialog<{ content: string }>({
                    title: "导入区块JSON",
                    data: { content: "" },
                    render(data) {
                        return <ElInput type="textarea" v-model={data.content} rows={10}></ElInput>
                    },
                    onConfirm(data) {
                        const newBlock = JSON.parse(data.content);

                        commands.updateBlock(newBlock, block);

                        dlg.hide();
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