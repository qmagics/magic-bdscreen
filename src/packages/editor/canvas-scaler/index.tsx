import useDesignStore from "@/store/design";
import { ElInputNumber } from "element-plus";
import { defineComponent } from "vue";

export default defineComponent({
    setup(props) {
        return () => {
            const { editorState } = useDesignStore();

            return <div class="canvas-scaler">
                <ElInputNumber v-model={editorState.scale} step={0.5}></ElInputNumber>
            </div>
        }
    }
});