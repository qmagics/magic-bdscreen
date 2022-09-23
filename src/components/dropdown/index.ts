import { createVNode, render } from "vue";
import DropdownComponent, { DropdownOptions } from "./src/dropdown";

interface DropdownReturn {
    show: Function;
    hide: Function;
}

export const Dropdown = (options: DropdownOptions): DropdownReturn => {
    const el = document.createElement('div');

    const vnode = createVNode(DropdownComponent, {
        options
    });

    render(vnode, el);

    document.body.appendChild(el);

    const { show } = vnode.component!.exposed!;
    show(options);

    return vnode.component!.exposed! as DropdownReturn;
}