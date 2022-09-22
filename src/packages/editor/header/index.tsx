import { defineComponent, PropType, WritableComputedRef } from "vue";
import config from '@/config';
import logo from '@/assets/logo.svg';
import { ConfigData } from "@/types";
import { useCommands } from "../hooks/useCommands";
import { Dialog } from "@/components/dialog";
import { ElInput } from "element-plus";
import { FocusData } from "../hooks/useFocus";

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
        const { commands } = useCommands(props.configData, props.focusData);

        const buttons = [
            {
                label: "撤销",
                icon: "undo",
                handler() {
                    commands.undo();
                }
            },
            {
                label: "重做",
                icon: "redo",
                handler() {
                    commands.redo();
                }
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
                            content: JSON.stringify(props.configData.value)
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
                handler() {
                    commands.placeTop();
                }
            },
            {
                label: "置底",
                icon: "place-bottom",
                handler() {
                    commands.placeBottom();
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
                        {buttons.map(btn => <el-button onClick={() => btn.handler && btn.handler()}>{btn.label}</el-button>)}
                        <el-button type="success">预览</el-button>
                        <el-button type="primary">保存</el-button>
                    </div>
                </div>
            </div>
        }
    },
})

