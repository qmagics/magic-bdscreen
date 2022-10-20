import { MbImage } from "@/components/mb-image";
import { MbTable } from "@/components/mb-table";
import { Manager } from "@/packages/manager";
import { createInputProp, createSelectProp, createPropGroup, createColorProp, createFontsizeSelect } from "@/utils/factory";
import { ElButton, ElInput, ButtonProps, ElInputNumber, Column } from 'element-plus';
import { StyleValue } from "vue";

// 统一注册物料组件
export default (manager: Manager) => {

    // 文本
    manager.registerComponent<{ text: string, color: string, backgroundColor: string, fontSize: string }>({
        name: "文本",
        type: "text",
        icon: "text",
        category: "basic",
        preview: () => <span>文本</span>,
        render: ({ props, size }) => {
            const style: StyleValue = {
                color: props.color,
                backgroundColor: props.backgroundColor,
                fontSize: `${props.fontSize}px`,
                width: size ? `${size.width}px` : undefined,
                height: size ? `${size.height}px` : undefined,
            }

            return <div style={style}>{props.text}</div>
        },
        props: [
            createPropGroup('基础属性', {
                text: createInputProp('文本内容'),
            }),
            createPropGroup('文字属性', {
                color: createColorProp('文本颜色'),
                backgroundColor: createColorProp('背景颜色'),
                fontSize: createFontsizeSelect('字体大小')
            }),
        ],
        defaultProps: {
            text: "一段文本"
        },
        resize: {
            width: true,
            height: true
        }
    })

    // 按钮
    manager.registerComponent<{ text: string, size: ButtonProps['size'], type: ButtonProps['type'] }>({
        name: "按钮",
        type: "button",
        icon: "button",
        category: "basic",
        preview: () => <ElButton>按钮</ElButton>,
        render: ({ props, size }) => {
            return <ElButton
                size={props.size} type={props.type}
                style={size ? {
                    width: size.width + 'px',
                    height: size.height + 'px'
                } : null}> {props.text}</ElButton>
        },
        props: {
            text: createInputProp('文本'),
            type: createSelectProp('类型', [
                { label: "主要", value: "primary" },
                { label: "成功", value: "success" },
                { label: "警告", value: "warning" },
                { label: "危险", value: "danger" },
                { label: "信息", value: "info" },
                { label: "文字", value: "text" },
            ]),
            size: createSelectProp('尺寸', [
                { label: "小", value: "small" },
                { label: "默认", value: "default" },
                { label: "大", value: "large" },
            ]),
        },
        defaultProps: {
            text: "按钮",
            size: "default"
        },
        resize: {
            width: true,
            height: true
        }
    })

    // 图片
    manager.registerComponent<{ src: string }>({
        name: "图片",
        type: "mb-image",
        icon: "image",
        category: "basic",
        render: ({ props, size }) => {
            return <MbImage src={props.src} size={size}></MbImage>
        },
        props: {
            src: createInputProp('图片地址'),
        },
        defaultProps: {
            src: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.11665.com%2Fimg_p5%2Fi2%2F2201287339141%2FO1CN01yxhAXF2HOd84CRDJz_%21%212201287339141.jpg&refer=http%3A%2F%2Fimg.11665.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652368911&t=0f229c9586d21e9dd8257fdd9ccab0d7"
        },
        defaultSize: {
            width: 100,
            height: 100
        },
        resize: {
            width: true,
            height: true
        }
    })

    // 表格
    manager.registerComponent<{ columns: Column[], data: Object[] }>({
        name: "表格",
        type: "mb-table",
        icon: "table",
        category: "basic",
        render: ({ props, size }) => {
            return <MbTable size={size} columns={props.columns} data={props.data}></MbTable>
        },
        defaultSize: {
            width: 300,
            height: 150,
        },
        defaultProps: {
            columns: [
                {
                    label: "姓名",
                    prop: "Name"
                },
                {
                    label: "年龄",
                    prop: "Age"
                }
            ],
            data: [
                {
                    Name: "奥迪A7",
                    Age: 12
                },
                {
                    Name: "宝马5系",
                    Age: 15
                }
            ]
        },
        resize: {
            width: true,
            height: true
        }
    })

    // 输入框
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