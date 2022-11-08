import { ComponentCategory, RegisterComponent } from '@/types';
import { deepClone } from '@/utils';
import { RegisterComponentFn } from './type';

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
     * 根据组件类型获取组件对象
     * @param componentType 
     * @returns 
     */
    public getComponentByType(componentType: string) {
        const component = this.componentMap[componentType];
        return component;
    }

    /**
     * 根据组件类型获取默认props
     * @param componentType 
     */
    public getComponentDefaultProps(componentType: string) {
        const component = this.getComponentByType(componentType);
        return deepClone(component.defaultProps);
    }

    /**
    * 根据组件类型获取props
    * @param componentType 
    */
    public getComponentProps(componentType: string) {
        const component = this.getComponentByType(componentType);
        return component.props;
    }


}

const manager = new Manager();

// 注册物料库
const modules = import.meta.globEager('@/config/register-lib/**/*.tsx') as Record<string, { default: RegisterComponentFn }>;
Object.keys(modules).forEach((key) => {
    const mod = modules[key].default || {};
    mod(manager);
});

export default manager;