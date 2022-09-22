import { ComponentCategory, RegisterComponent } from '@/types';
import { ElButton, ElImage, ElInput } from 'element-plus';

export class Manager {

    public componentCategories: ComponentCategory[] = [
        { name: '基础', value: 'basic', icon: 'basic' },
        { name: '布局', value: 'layout', icon: 'layout' },
        { name: '输入', value: 'input', icon: 'input' },
        { name: '图表', value: 'chart', icon: 'chart' },
    ];

    public componentList: RegisterComponent[] = [];

    public componentMap: Record<RegisterComponent['type'], RegisterComponent> = {};

    constructor() { }

    public registerComponent(component: RegisterComponent) {
        this.componentList.push(component);
        this.componentMap[component.type] = component;
    }
}

const manager = new Manager();

manager.registerComponent({
    name: "文本",
    type: "text",
    icon: "text",
    category: "basic",
    preview: () => <span>文本</span>,
    render: () => <span>渲染文本</span>,
})

manager.registerComponent({
    name: "按钮",
    type: "button",
    icon: "button",
    category: "basic",
    preview: () => <ElButton>按钮</ElButton>,
    render: () => <ElButton type="primary">渲染按钮</ElButton>,
})

manager.registerComponent({
    name: "图片",
    type: "image",
    icon: "image",
    category: "basic",
    preview: () => <ElImage></ElImage>,
    render: () => <ElImage></ElImage>,
})

manager.registerComponent({
    name: "输入框",
    type: "input",
    icon: "input",
    category: "input",
    preview: () => <ElInput></ElInput>,
    render: () => <ElInput></ElInput>,
})

export default manager;