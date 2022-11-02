import '@/styles/renderer/index.scss';
import { ConfigData, FormModel } from "@/types";
import { computed, defineComponent, PropType, StyleValue } from "vue";
import BlockItem from './block-item';

export default defineComponent({
    props: {
        configData: {
            type: Object as PropType<ConfigData>,
            required: true
        },
        formData: {
            type: Object as PropType<FormModel>,
            required: true
        }
    },
    setup: (props) => {

        // 画布样式
        const canvasStyle = computed<StyleValue>(() => {
            let width = props.configData.container.width;
            let height = props.configData.container.height;

            return {
                width: `${width}px`,
                height: `${height}px`,
            }
        });

        return () => {
            return <div class="renderer">
                <div class="renderer-canvas" style={canvasStyle.value}>
                    {
                        props.configData?.blocks.map(block => {
                            return <BlockItem
                                key={block.type}
                                block={block}
                                formData={props.formData}
                            ></BlockItem>
                        })
                    }
                </div>
            </div>
        }
    },
})