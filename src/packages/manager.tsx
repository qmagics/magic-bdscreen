import { ComponentCategory, RegisterComponent } from '@/types';
import { ElButton, ElInput } from 'element-plus';

export class Manager {

    public componentCategories: ComponentCategory[] = [
        { name: '基础组件', value: 'basic', icon: '' },
        { name: '布局组件', value: 'layout', icon: '' },
        { name: '输入组件', value: 'input', icon: '' },
        { name: '图表组件', value: 'chart', icon: '' },
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
    category: "basic",
    preview: () => <span>文本</span>,
    render: () => <span>渲染文本</span>,
})

manager.registerComponent({
    name: "按钮",
    type: "button",
    category: "basic",
    preview: () => <ElButton>按钮</ElButton>,
    render: () => <ElButton type="primary">渲染按钮</ElButton>,
})

manager.registerComponent({
    name: "输入框",
    type: "input",
    category: "input",
    preview: () => <ElInput></ElInput>,
    render: () => <ElInput></ElInput>,
})

export default manager;