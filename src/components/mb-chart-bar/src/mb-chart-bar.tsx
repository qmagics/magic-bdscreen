import { ECOption } from '@/plugins/echarts';
import { MbSize } from '@/types/components';
import { computed, defineComponent, PropType, ref } from 'vue';
import VueECharts from 'vue-echarts';

export default defineComponent({
    props: {
        size: Object as PropType<MbSize>,
        data: {
            type: Object,
            default: () => ({})
        },
        loading: Boolean,
        option: {
            type: Object as PropType<ECOption>,
            // required: true
        }
    },
    setup(props) {
        return () => {
            const { width, height } = props.size || {};

            const option = computed<ECOption>(() => {
                return {
                    // ...props.option,
                    grid: {
                        top: '5%',
                        bottom: '5%',
                        left: '5%',
                        right: '5%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: props.data?.categories || []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: (props.data?.series || []).map((i: any) => {
                        return {
                            name: i.name,
                            type: 'bar',
                            data: i.data,
                        }
                    })
                }
            });

            return <div class="mb-chart-bar" style={{ width: width + 'px', height: height + 'px' }}>
                <VueECharts autoresize option={option.value}></VueECharts>
            </div>
        }
    }
})