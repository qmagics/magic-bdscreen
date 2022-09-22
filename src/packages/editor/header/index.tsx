import { defineComponent, PropType, WritableComputedRef } from "vue";
import config from '@/config';
import logo from '@/assets/logo.svg';
import { ConfigData } from "@/types";
import { useCommands } from "../hooks/useCommands";
import { Dialog } from "@/components/dialog";
import { ElInput } from "element-plus";
import { FocusData } from "../hooks/useFocus";
import useDesignStore from "@/store/design";

interface ButtonData {
    label: string | (() => string);
    icon: string | (() => string);
    type?: string;
    handler: Function;
}

export default defineComponent({
    props: {
        configData: {
            required: true,
            type: Object as PropType<WritableComputedRef<ConfigData>>
        },
        focusData: {
            required: true,
            type: Object as PropType<FocusData>,
        }
    },

    setup: (props) => {
        const designStore = useDesignStore();
        const { commands } = useCommands(props.configData, props.focusData);

        const buttons: ButtonData[] = [
            {
                label: "撤销",
                icon: "undo",
                handler: () => commands.undo()
            },
            {
                label: "重做",
                icon: "redo",
                handler: () => commands.redo()
            },
            {
                label: "导出",
                icon: "export",
                handler() {
                    Dialog<{ content: string }>({
                        title: "导出JSON",
                        data: {
                            content: JSON.stringify(props.configData.value)
                        },
                        render(data) {
                            return <ElInput type="textarea" rows={10} v-model={data.content}></ElInput>
                        },
                        btns: false
                    })
                }
            },
            {
                label: "导入",
                icon: "import",
                handler() {
                    const dlg = Dialog<{ content: string }>({
                        title: "导入JSON",
                        data: {
                            content: ""
                        },
                        render(data) {
                            return <ElInput type="textarea" rows={10} v-model={data.content}></ElInput>
                        },
                        onConfirm(data) {
                            commands.updateConfigData(JSON.parse(data.content));
                            dlg.hide();
                        },
                        onCancel() {
                            dlg.hide();
                        }
                    })
                }
            },
            {
                label: "置顶",
                icon: 'place-top',
                handler: () => commands.placeTop()
            },
            {
                label: "置底",
                icon: "place-bottom",
                handler: () => commands.placeBottom()
            },
            {
                label: "删除",
                icon: "delete",
                handler: () => commands.delete()
            },
            {
                label: () => designStore.isPreView ? '设计' : '预览',
                icon: () => designStore.isPreView ? 'edit' : 'preview',
                type: "primary",
                handler: () => {
                    designStore.toggleIsPreview();
                }
            }
        ];

        return () => {
            return <div class="editor-header">
                <div class="editor-header-logo">
                    <img src={logo} />
                    <span>{config.title}</span>
                </div>
                <div class="editor-header-toolbar">
                    <div>
                        {buttons.map(btn => {
                            const icon = typeof btn.icon === 'function' ? btn.icon() : btn.icon;
                            const label = typeof btn.label === 'function' ? btn.label() : btn.label;
                            return <el-button type={btn.type} onClick={() => btn.handler && btn.handler()}>{label}</el-button>
                        })}
                    </div>
                </div>
            </div>
        }
    },
})

