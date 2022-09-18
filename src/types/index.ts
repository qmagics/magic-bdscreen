export interface ContainerData {
    width: number;
    height: number;
}

export interface BlockData {
    type: string;
    left: number;
    top: number;
    zIndex: number;
}

export interface ConfigData {
    id: string;
    title: string;
    container: ContainerData;
    blocks: BlockData[];
}

/** 注册组件 */
export interface RegisterComponent {
    name: string;
    type: string;
    category: string;
    preview: (...args: any) => any;
    render: (...args: any) => any;
}

export interface ComponentCategory {
    name: string;
    value: string;
    icon: string;
}