import { MANAGER_KEY } from "@/packages/tokens";
import { BlockData } from "@/types";
import { ElForm, ElFormItem } from "element-plus";
import { ComputedRef, defineComponent, inject, PropType } from "vue";
import controlMap from "./controlMap";

export default defineComponent({
    props: {
        block: {
            type: Object as PropType<ComputedRef<BlockData>>,
            required: true
        }
    },
    setup(props) {
        const manager = inject(MANAGER_KEY)!;

        return () => {
            const { block } = props;
            const componentProps = manager.getComponentProps(block.value.type);

            // 组件特有属性表单项
            const componentFormItems = (
                Object.entries(componentProps).map(([propName, propConfig]) => {
                    const { type, label } = propConfig as any;
                    return <ElFormItem label={label} prop={propName}>
                        {controlMap[type] && controlMap[type](block.value.props, propName, propConfig)}
                    </ElFormItem>
                })
            )

            return (
                <ElForm model={block.value.props} labelWidth="100px" labelPosition="top">
                    {componentFormItems}
                </ElForm>
            )
        }
    }
});