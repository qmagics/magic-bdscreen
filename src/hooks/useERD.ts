import { isFunction } from '@/utils';
import ERD from 'element-resize-detector';
import { onBeforeUnmount } from 'vue';

export const useERD = (el: HTMLElement, handler: (args: { width: number, height: number }) => any) => {
    const erd = ERD();

    const detect = () => {
        erd.listenTo(el, element => {
            const { offsetWidth, offsetHeight } = element;
            handler({
                width: offsetWidth,
                height: offsetHeight,
            });
        })
    }

    const undetect = () => {
        erd.removeAllListeners(el);
    }

    if (el && isFunction(handler)) {
        detect();
    }

    onBeforeUnmount(() => {
        undetect();
    });
}