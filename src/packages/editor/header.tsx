import { defineComponent, PropType, WritableComputedRef } from "vue";
import config from '@/config';
import logo from '@/assets/logo.svg';
import { ConfigData } from "@/types";
import { useCommands } from "./useCommands";

export default defineComponent({
    props: {
        configData: {
            required: true,
            type: Object as PropType<WritableComputedRef<ConfigData>>
        }
    },

    setup: (props) => {
        const { commands } = useCommands(props.configData);

        const buttons = [
            {
                label: "撤销",
                icon: "m-undo",
                handler() {
                    commands.undo();
                }
            },
            {
                label: "重做",
                icon: "m-redo",
                handler() {
                    commands.redo();
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

