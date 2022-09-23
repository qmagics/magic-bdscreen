import { createVNode, render, VNode } from 'vue';
import DialogComponent from './src/dialog';

export interface DialogOptions<DataT = any> {
    title: string;
    render: (data: DataT) => VNode;
    renderHeader?: (data: DataT) => VNode;
    renderFooter?: (data: DataT) => VNode;

    data?: DataT;
    onConfirm?: (data: DataT) => any;
    onCancel?: Function;
    btns?: boolean | string[] | any[];
}

export const Dialog = <DataT = any>(options: DialogOptions<DataT>): { show: Function, hide: Function } | Record<string, any> => {
    const el = document.createElement('div');

    const vnode = createVNode(DialogComponent, {
        options,
        onClosed() {
            document.body.removeChild(el);
        }
    });

    render(vnode, el);

    document.body.appendChild(el);

    const { show } = vnode.component!.exposed!;
    show(options);

    return vnode.component!.exposed!;
}