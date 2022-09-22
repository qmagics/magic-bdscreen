import { defineComponent } from "vue";

export default defineComponent({
    props: {
        title: String
    },
    setup(props, { slots }) {
        return () => {
            const header = (<div class="sidebar-panel__header">{slots.header ? slots.header() : props.title}</div>)

            const body = slots.default ? (<div class="sidebar-panel__body">{slots.default()}</div>) : null;

            return <div class="sidebar-panel">
                {header}
                {body}
            </div>
        }
    }
});