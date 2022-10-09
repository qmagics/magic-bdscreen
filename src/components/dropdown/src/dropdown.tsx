import { isFunction } from "@/utils";
import { computed, defineComponent, InjectionKey, onBeforeUnmount, onMounted, PropType, provide, reactive, ref, VNode } from "vue";

export interface DropdownOptions {
    event: MouseEvent;
    el: HTMLElement;
    render: () => VNode;
}

export const DROPDOWN_KEY: InjectionKey<{ hide: Function }> = Symbol('dropdown');

export default defineComponent({
    props: {
        options: {
            required: true,
            type: Object as PropType<DropdownOptions>
        },
        onClosed: Function
    },
    setup(props, { expose, slots }) {
        const state = reactive({
            options: props.options,
            isShow: false,
            left: 0,
            top: 0
        });

        const show = (options: DropdownOptions) => {
            state.options = options;

            // const { left, top, width, height } = options.el.getBoundingClientRect();

            // state.left = left;
            // state.top = top + height;
            state.left = options.event.pageX;
            state.top = options.event.pageY;

            state.isShow = true;
        }

        const hide = () => {
            state.isShow = false;

            if (isFunction(props.onClosed)) {
                props.onClosed!();
            }
        }

        expose({ show });

        provide(DROPDOWN_KEY, { hide });

        const classes = computed(() => {
            return [
                'dropdown',
                {
                    'is--show': state.isShow
                }
            ]
        });

        const style = computed(() => {
            return {
                top: state.top + 'px',
                left: state.left + 'px'
            }
        });

        const dropdownRef = ref<HTMLDivElement>();

        const onDocumentMousedown = (e: MouseEvent) => {
            if (!dropdownRef.value!.contains(e.target as HTMLElement)) {
                hide();
            }
        }

        onMounted(() => {
            document.addEventListener('mousedown', onDocumentMousedown, true);
        });

        onBeforeUnmount(() => {
            document.removeEventListener('mousedown', onDocumentMousedown, true);
        });

        return () => {

            const { render } = state.options;

            const content = render ? render() : slots.default ? slots.default() : null;

            return <div class={classes.value} style={style.value} ref={dropdownRef}>
                {content}
            </div>
        }
    }
});