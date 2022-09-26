import { defineComponent, PropType } from "vue";
import { UseCommandsState } from "../hooks/useCommands";

export default defineComponent({
    props: {
        commandsState: {
            required: true,
            type: Object as PropType<UseCommandsState>
        }
    },
    setup(props) {

        const changeCurrent = (index: number) => {
            props.commandsState.commands.applyQueue(index);
        }

        return () => {
            const { queue, current } = props.commandsState;
            return <div class="action-history">
                {
                    queue.map((action, index) => {
                        return <div onClick={() => changeCurrent(index)} class={['action-history-item', { 'is--current': current === index }]}>{action.queueName}</div>
                    })
                }
            </div>
        }
    }
});