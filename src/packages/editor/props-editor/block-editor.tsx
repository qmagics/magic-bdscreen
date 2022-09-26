import { MANAGER_KEY, COMMANDS_KEY } from "@/packages/tokens";
import { BlockData } from "@/types";
import { deepClone } from "@/utils";
import { ElForm, ElFormItem } from "element-plus";
import { ComputedRef, defineComponent, inject, PropType, reactive } from "vue";
import controlMap from "./controlMap";
import { watchDebounced } from '@vueuse/core';

export default defineComponent({
    props: {
        block: {
            type: Object as PropType<ComputedRef<BlockData>>,
            required: true
        }
    },
    setup(props) {
        const manager = inject(MANAGER_KEY)!;

        const commands = inject(COMMANDS_KEY)!;

        return () => {
            const { block } = props;
            const component = manager.getComponentByType(block.value.type);
            const componentProps = component.props;

            // 重新构建属性编辑对象（不能直接修改，因为要添加进操作历史记录）
            const formData = reactive(deepClone(block.value.props));

            // 监听并触发变更事件，需要防抖
            watchDebounced(formData, (data) => {
                const newBlock = { ...block.value, props: data };
                commands.updateBlock(newBlock, block.value, `${component.name}<更新属性>`);
            }, { debounce: 500 });

            // 组件特有属性表单项
            const componentFormItems = (
                Object.entries(componentProps).map(([propName, propConfig]) => {
                    const { type, label } = propConfig as any;
                    return <ElFormItem label={label} prop={propName}>
                        {controlMap[type] && controlMap[type](formData, propName, propConfig)}
                    </ElFormItem>
                })
            )

            return (
                <ElForm model={formData} labelWidth="100px" labelPosition="top">
                    {componentFormItems}
                </ElForm>
            )
        }
    }
});