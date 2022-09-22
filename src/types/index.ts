export interface ContainerData {
    width: number;
    height: number;
}

export interface BlockData {
    /** 组件类型 */
    type: string;

    /** left值 */
    left: number;

    /** top值 */
    top: number;

    /** zIndex值 */
    zIndex: number;

    /** 宽度 */
    width?: number;

    /** 高度 */
    height?: number;

    /** 放下后居中 */
    alignCenterWhenDrop?: boolean;

    /** 是否选中 */
    isFocused?: boolean;
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
    icon: string;
    category: string;
    preview: (...args: any) => any;
    render: (...args: any) => any;
}

export interface ComponentCategory {
    name: string;
    value: string;
    icon: string;
}