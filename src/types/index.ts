import { ComputedRef, VNode } from "vue";

/** 容器配置数据 */
export interface ContainerData {
    width: number;
    height: number;
}

/** 区块配置数据（可以理解为组件实例数据） */
export interface BlockData<Props = Record<string, any>> {
    /** 组件类型 */
    type: string;

    /** left值 */
    left: number;

    /** top值 */
    top: number;

    /** zIndex值 */
    zIndex: number;

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

    /** 数据源 */
    datasource?: DataSource;
}

/** 大屏配置数据 */
export interface ConfigData {
    /** 大屏唯一ID */
    id: string;

    /** 大屏名称/标题 */
    title: string;

    /** 大屏容器属性 */
    container: ContainerData;

    /** 大屏包含的元素区块集合 */
    blocks: BlockData[];
}

export interface RenderContextState {
    loading: boolean
}

/** 注册组件渲染函数上下文参数 */
export interface RenderContext<Props = any> {
    props: Props;
    size: {
        width?: number;
        height?: number;
    };
    model: any;
    data: any;
    state: RenderContextState;
}

/** 注册组件 */
export interface RegisterComponent<Props = any> {
    /** 组件名 */
    name: string;

    /** 组件唯一标识 */
    type: string;

    /** 组件图标 */
    icon: string;

    /** 组件类别 */
    category: ComponentCategory['value'];

    /** 组件渲染函数 */
    render: (context: RenderContext<Props>) => any;

    /** 组件预览图渲染函数（与[组件图标]功能类似） */
    preview?: (...args: any) => any;

    /** 组件属性编辑栏渲染函数 */
    editor?: ({ props, block }: { props: Props, block: ComputedRef<BlockData<Props>> }) => VNode,

    /** 组件拥有的可配置属性（会产生对应的编辑控件） */
    props?: Props | Record<string, any>;

    /** 组件被添加进画布时提供的默认属性值 */
    defaultProps?: Props | Record<string, any>;

    /** 组件的缩放配置 */
    resize?: { width: boolean, height: boolean };

    /** 组件被添加进画布时提供的默认大小 */
    defaultSize?: { width: number, height: number };

    /** 组件的表单绑定配置（会在产生组件编辑器区产生对应的编辑控件） */
    model?: {
        default?: string;
        [key: string]: any;
    };

    /** 组件默认的数据源属性值 */
    defaultDatasource?: DataSource;

    /** 数据源格式化函数描述 */
    datasourceFormatterDesc?: string;
}

/** 组件类别 */
export interface ComponentCategory {
    /** 类别名 */
    name: string;

    /** 类别值 */
    value: string;

    /** 类别图标 */
    icon: string;
}

export interface FormModel {
    [key: string | number]: any;
}

/** 数据源描述对象 */
export interface DataSource {
    /** 数据源类型 */
    type?: DataSourceType;

    /** 静态数据内容 */
    staticData?: string;

    /** API接口地址 */
    apiUrl?: string;

    /** 格式化函数内容 */
    formatter?: string;
}

/** 数据源类型枚举 */
export enum DataSourceType {
    /** 静态数据 */
    STATIC = 1,

    /** API接口数据 */
    API = 2
}