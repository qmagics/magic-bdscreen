import { ComputedRef, VNode } from "vue";

/** 容器配置数据 */
export interface ContainerData {
    width: number;
    height: number;
}

/** 区块配置数据 */
export interface BlockData<Props = Record<string, any>> {
    /** 组件类型 */
    type: string;

    /** left值 */
    left: number;

    /** top值 */
    top: number;

    /** zIndex值 */
    zIndex: number;

    // /** 宽度 */
    // width?: number;

    // /** 高度 */
    // height?: number;

    /** 放下后居中 */
    alignCenterWhenDrop?: boolean;

    /** 是否选中 */
    isFocused?: boolean;

    /** 组件属性 */
    props: Props;

    // /** 是否改变过大小 */
    // isResized?: boolean;

    /** 组件大小 */
    size: {
        /** 宽度 */
        width?: number;

        /** 高度 */
        height?: number;
    },

    model?: any,

    datasource: DataSource;
}

/** 大屏配置数据 */
export interface ConfigData {
    id: string;
    title: string;
    container: ContainerData;
    blocks: BlockData[];
}

/** 注册组件 */
export interface RegisterComponent<Props = any> {
    name: string;
    type: string;
    icon: string;
    category: string;
    render: ({ props, size, model }: { props: Props, size: { width?: number, height?: number }, model: any }) => any;
    preview?: (...args: any) => any;
    editor?: ({ props, block }: { props: Props, block: ComputedRef<BlockData<Props>> }) => VNode,
    props?: Props | Record<string, any>;
    defaultProps?: Props | Record<string, any>;
    resize?: { width: boolean, height: boolean };
    defaultSize?: { width: number, height: number };
    model?: {
        default?: string;
        [key: string]: any;
    };
}

export interface ComponentCategory {
    name: string;
    value: string;
    icon: string;
}

export interface FormModel {
    [key: string | number]: any;
}

export interface DataSource {
    type?: number;
    staticData?: any;
    apiUrl?: string;
}