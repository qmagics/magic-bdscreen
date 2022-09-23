import { defineComponent, inject } from "vue";
import { DROPDOWN_KEY } from "./dropdown";

export default defineComponent({
    props: {
        label: {
            type: String,
            required: true
        },
        icon: {
            type: String
        }
    },
    emits: ['click'],
    setup(props, { emit }) {

        const { hide } = inject(DROPDOWN_KEY)!;

        const onItemClick = (e: MouseEvent) => {
            hide();
            emit('click', e);
        }

        return () => {
            return <div class="dropdown-item" onClick={e => onItemClick(e)}>
                {props.icon ? <svg-icon class="dropdown-item__icon" name={props.icon}></svg-icon> : null}
                <span class="dropdown-item__label">{props.label}</span>
            </div>
        }
    }
});