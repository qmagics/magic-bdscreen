import { ConfigData } from "@/types";
import { ElForm, ElFormItem, ElInputNumber } from "element-plus";
import { defineComponent, PropType, WritableComputedRef } from "vue";

export default defineComponent({
    props: {
        configData: {
            type: Object as PropType<WritableComputedRef<ConfigData>>,
            required: true
        }
    },
    setup(props) {
        return () => {
            const { container } = props.configData.value;

            return <ElForm model={container} labelWidth="100px" labelPosition="top">
                <ElFormItem label="页面宽度" prop="width">
                    <ElInputNumber v-model={container.width} />
                </ElFormItem>
                <ElFormItem label="页面高度" prop="height">
                    <ElInputNumber v-model={container.height} />
                </ElFormItem>
            </ElForm>
        }
    }
});