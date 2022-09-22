import { ElDialog, ElButton } from "element-plus";
import { defineComponent, PropType, reactive } from "vue";
import type { DialogOptions } from "..";

export default defineComponent({
    props: {
        options: {
            required: true,
            type: Object as PropType<DialogOptions>,
        },
        onClosed: {
            type: Function,
            required: true
        }
    },
    setup(props, { expose }) {
        const state = reactive({
            isShow: false,
            options: props.options
        });

        const show = (options?: DialogOptions) => {
            if (options) {
                state.options = options;
            }
            state.isShow = true;
        }

        const hide = () => {
            state.isShow = false;
        }

        expose({
            show,
            hide
        })

        return () => {
            const { render, renderFooter, renderHeader, onConfirm, onCancel } = state.options;

            return <ElDialog
                v-model={state.isShow}
                title={state.options.title}
                draggable
                onClosed={() => props.onClosed()}
                destroyOnClose={true}>
                {
                    {
                        default: render(state.options.data),
                        header: renderHeader && renderHeader(state.options.data),
                        footer: renderFooter ? renderFooter(state.options.data) : state.options.btns === false ? null : () => {
                            return <div>
                                <ElButton type="success" onClick={() => { onConfirm && onConfirm(state.options.data) }}>确认</ElButton>
                                <ElButton onClick={() => { onCancel && onCancel() }}>取消</ElButton>
                            </div>
                        }
                    }
                }
            </ElDialog>
        }
    }
});