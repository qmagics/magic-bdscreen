import { COMMANDS_KEY } from "@/packages/tokens";
import { ConfigData } from "@/types";
import { deepClone } from "@/utils";
import { ElForm, ElFormItem, ElInputNumber } from "element-plus";
import { defineComponent, inject, PropType, reactive, watch, WritableComputedRef } from "vue";

export default defineComponent({
    props: {
        configData: {
            type: Object as PropType<WritableComputedRef<ConfigData>>,
            required: true
        }
    },
    setup(props) {
        const commands = inject(COMMANDS_KEY)!;

        return () => {
            const { container } = props.configData.value;

            const containerData = reactive(deepClone(container));

            watch(containerData, newContainerData => {
                commands.updateConfigData({ ...props.configData.value, container: newContainerData });
            });

            return <div class="config-editor">
                <ElForm model={containerData} labelWidth="100px" labelPosition="top">
                    <ElFormItem label="页面宽度" prop="width">
                        <ElInputNumber v-model={containerData.width} />
                    </ElFormItem>
                    <ElFormItem label="页面高度" prop="height">
                        <ElInputNumber v-model={containerData.height} />
                    </ElFormItem>
                </ElForm>
            </div>
        }
    }
});