import { BlockData } from "@/types";
import { ElInput, ElInputNumber, ElOption, ElSelect } from "element-plus";
import { VNode } from "vue";

export default {
    input: (props, propName) => {
        return <ElInput v-model={props[propName]}></ElInput>
    },
    inputNumber: (props, propName) => {
        return <ElInputNumber v-model={props[propName]}></ElInputNumber>
    },
    select: (props, propName, propConfig) => {
        return <ElSelect v-model={props[propName]}>
            {propConfig.options.map((opt: any) => <ElOption {...opt}></ElOption>)}
        </ElSelect>
    }
} as Record<string, (props: BlockData['props'], propName: any, propConfig: any) => VNode>