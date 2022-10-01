import { MbSize } from "@/types/components";
import { ElImage } from "element-plus";
import { defineComponent, PropType } from "vue";

export default defineComponent({
    props: {
        size: Object as PropType<MbSize>,
        src: String
    },
    setup(props) {
        return () => {
            const { width, height } = props.size || {};
            return <ElImage class="mb-image" style={{ width: width && width + 'px', height: height && height + 'px' }} src={props.src}></ElImage>
        }
    }
});

