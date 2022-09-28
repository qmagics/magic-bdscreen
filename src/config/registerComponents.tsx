import { Manager } from "@/packages/manager";
import { createInputProp, createSelectProp, createInputNumberProp } from "@/utils/factory";
import { ElButton, ElImage, ElInput, ButtonProps } from 'element-plus';
import { StyleValue } from "vue";

// 统一注册物料组件
export default (manager: Manager) => {

    // 文本
    manager.registerComponent<{ text: string, color: string, fontSize: string }>({
        name: "文本",
        type: "text",
        icon: "text",
        category: "basic",
        preview: () => <span>文本</span>,
        render: ({ props, size }) => {
            const style: StyleValue = {
                color: props.color,
                fontSize: props.fontSize,
                width: size ? `${size.width}px` : undefined,
                height: size ? `${size.height}px` : undefined,
            }

            return <div style={style}>{props.text}</div>
        },
        props: {
            text: createInputProp('文本内容'),
            color: createInputProp('字体颜色'),
            fontSize: createInputProp('字体大小')
        },
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
    manager.registerComponent<{ width: number, height: number, src: string }>({
        name: "图片",
        type: "image",
        icon: "image",
        category: "basic",
        preview: () => <ElImage></ElImage>,
        render: ({ props, size }) => {
            const { width, height } = size || {};
            return <ElImage style={{ width: width && width + 'px', height: height && height + 'px' }} src={props.src}></ElImage>
        },
        props: {
            // width: createInputNumberProp('宽度'),
            // height: createInputNumberProp('高度'),
            src: createInputProp('资源路径'),
        },
        defaultProps: {
            // width: 100,
            // height: 100,
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
        render: () => <ElInput></ElInput>,
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