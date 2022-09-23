import { BlockData, ConfigData } from "@/types";
import { ComputedRef, defineComponent, PropType, WritableComputedRef } from "vue";
import BlockEditor from "./block-editor";
import ConfigEditor from "./config-editor";

export default defineComponent({
    props: {
        block: {
            required: true,
            type: Object as PropType<ComputedRef<BlockData>>
        },
        configData: {
            required: true,
            type: Object as PropType<WritableComputedRef<ConfigData>>
        }
    },
    setup(props) {
        return () => {
            return (<div class="props-editor">
                {props.block.value ? <BlockEditor block={props.block}></BlockEditor> : <ConfigEditor configData={props.configData}></ConfigEditor>}
            </div>)
        }
    }
});