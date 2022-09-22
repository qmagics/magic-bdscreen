import { computed, defineComponent } from "vue";

export default defineComponent({
    props: {
        name: {
            type: String,
            required: true
        },
        prefix: {
            type: String,
            default: 'm'
        }
    },
    setup(props) {
        const symbolId = computed(() => `#${props.prefix}-${props.name}`);

        return () => {
            return <svg class="svg-icon" aria-hidden="true">
                <use xlinkHref={symbolId.value} />
            </svg>
        }
    }
});