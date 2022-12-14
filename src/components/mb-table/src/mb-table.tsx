import { MbSize } from "@/types/components";
import { isArray } from "@/utils";
import { Column, ElTable, ElTableColumn } from "element-plus";
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
        },
        loading: Boolean
    },
    setup(props) {
        const columns = computed(() => {
            return props.columns;
        });

        const tableData = computed(() => {
            return isArray(props.data) ? props.data : [];
        });

        return () => {
            const { width, height } = props.size || {};

            return <div class="mb-table" style={{ width: width + 'px', height: height + 'px' }}>
                <ElTable height={height} data={tableData.value} v-loading={props.loading}>
                    {
                        columns.value.map(column => <ElTableColumn {...column}></ElTableColumn>)
                    }
                </ElTable>
            </div>
        }
    }
});

