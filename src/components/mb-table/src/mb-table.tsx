import { MbSize } from "@/types/components";
import { ElTable, Column, ElTableColumn } from "element-plus";
import { computed, defineComponent, PropType } from "vue";

export default defineComponent({
    props: {
        size: Object as PropType<MbSize>,
        columns: {
            type: Array as PropType<Column[]>,
            required: true,
        },
        data: {
            type: Array as PropType<Object[]>,
            default: () => ([])
        }
    },
    setup(props) {
        return () => {
            const { width, height } = props.size || {};

            const columns = computed(() => {
                return props.columns;
            });

            return <div class="mb-table" style={{ width: width + 'px' }}>
                <ElTable height={height} data={props.data}>
                    {
                        columns.value.map(column => (
                            <ElTableColumn {...column}></ElTableColumn>
                        ))
                    }
                </ElTable>
            </div>
        }
    }
});

