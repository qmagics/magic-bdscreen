import { MbImage } from "@/components/mb-image";
import { Manager } from "@/packages/manager";
import { createInputProp, createSelectProp, createPropGroup, createColorProp } from "@/utils/factory";
import { ElButton, ElInput, ButtonProps } from 'element-plus';
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
            createPropGroup('', {
                color: createColorProp('文本颜色'),
                backgroundColor: createColorProp('背景颜色'),
                fontSize: createSelectProp('字体大小', [
                    { label: "12px", value: 12 },
                    { label: "14px", value: 14 },
                    { label: "16px", value: 16 },
                    { label: "18px", value: 18 },
                    { label: "20px", value: 20 },
                    { label: "24px", value: 24 },
                    { label: "28px", value: 28 },
                    { label: "32px", value: 32 },
                ])
            }),
        ],
        // props: {
        //     text: createInputProp('文本内容'),
        //     color: createColorProp('字体颜色'),
        //     fontSize: createSelectProp('字体大小', [
        //         { label: "12px", value: 12 },
        //         { label: "14px", value: 14 },
        //         { label: "16px", value: 16 },
        //         { label: "18px", value: 18 },
        //         { label: "20px", value: 20 },
        //         { label: "24px", value: 24 },
        //         { label: "28px", value: 28 },
        //         { label: "32px", value: 32 },
        //     ])
        // },
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
        type: "image",
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

    // 输入框
    manager.registerComponent({
        name: "输入框",
        type: "input",
        icon: "input",
        category: "input",
        preview: () => <ElInput></ElInput>,
        render: ({ props, size }) => {
            const style: StyleValue = {
                width: size.width && size.width + 'px',
                height: size.height && size.height + 'px',
            };

            return <ElInput style={style}></ElInput>;
        },
        props: {
            placeholder: createInputProp('占位文本'),
            size: createSelectProp('尺寸', [
                { label: "小", value: "small" },
                { label: "默认", value: "default" },
                { label: "大", value: "large" },
            ]),
        },
        defaultProps: {
            placeholder: "请输入内容",
            size: "default"
        },
        resize: {
            width: true,
            height: false
        }
        // model: {
        //     default: {

        //     }
        // }
    })
}