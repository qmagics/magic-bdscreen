import registerComponents from '@/config/registerComponents';
import { ComponentCategory, RegisterComponent } from '@/types';
import { deepClone } from '@/utils';

export class Manager {
    public componentCategories: ComponentCategory[] = [
        { name: '基础', value: 'basic', icon: 'basic' },
        { name: '布局', value: 'layout', icon: 'layout' },
        { name: '输入', value: 'input', icon: 'input' },
        { name: '图表', value: 'chart', icon: 'chart' },
    ];

    public componentList: RegisterComponent<any>[] = [];

    public componentMap: Record<RegisterComponent<any>['type'], RegisterComponent<any>> = {};

    constructor() { }

    public registerComponent<Props = any>(component: RegisterComponent<Props>) {
        this.componentList.push(component);
        this.componentMap[component.type] = component;
    }

    /**
     * 根据组件类型获取默认props
     * @param componentType 
     */
    public getComponentDefaultProps(componentType: string) {
        const component = this.componentMap[componentType];
        return deepClone(component.defaultProps);
    }

    /**
    * 根据组件类型获取props
    * @param componentType 
    */
    public getComponentProps(componentType: string) {
        const component = this.componentMap[componentType];
        return component.props;
    }
}

const manager = new Manager();

registerComponents(manager);

export default manager;