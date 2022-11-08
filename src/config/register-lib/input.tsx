import { Manager } from "@/packages/manager";
import { ElInput } from 'element-plus';
import { StyleValue } from "vue";

export default (manager: Manager) => {
    manager.registerComponent<{ size: string, placeholder: string }>({
        name: "输入框",
        type: "input",
        icon: "input",
        category: "input",
        preview: () => <ElInput></ElInput>,
        render: ({ props, size, model }) => {
            const style: StyleValue = {
                width: size.width && size.width + 'px',
                height: size.height && size.height + 'px',
            };

            return <ElInput
                placeholder={props.placeholder}
                size={props.size}
                style={style}
                {...model.default}></ElInput>;
        },
        // editor: ({ props, block }) => {
        //     return <div>
        //         <ElInput v-model={props.placeholder}></ElInput>
        //         <ElInputNumber v-model={block.value.size.width}></ElInputNumber>
        //     </div>
        // },
        // props: {
        //     placeholder: createInputProp('占位文本'),
        //     size: createSelectProp('尺寸', [
        //         { label: "小", value: "small" },
        //         { label: "默认", value: "default" },
        //         { label: "大", value: "large" },
        //     ]),
        // },
        defaultProps: {
            placeholder: "请输入内容",
            size: "default"
        },
        resize: {
            width: true,
            height: false
        },
        model: {
            default: "绑定字段"
        }
    })
}

