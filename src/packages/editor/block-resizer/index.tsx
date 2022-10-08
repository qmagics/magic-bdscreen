import { BlockData, RegisterComponent } from "@/types";
import { defineComponent, PropType } from "vue";
import events from "../events";
import { afterScale, beforeScale } from "../utils";

interface MoveDirection {
    verticle: "start" | "end" | "center";
    horizontal: "start" | "end" | "center";
}

export default defineComponent({
    props: {
        block: {
            type: Object as PropType<BlockData>,
            required: true
        },
        component: {
            type: Object as PropType<RegisterComponent>,
            required: true
        }
    },
    setup(props) {

        let state = {
            startX: 0,
            startY: 0,
            startLeft: 0,
            startTop: 0,
            startWidth: 0,
            startHeight: 0,
            direction: null as unknown as MoveDirection
        }

        const onMousedown = (e: MouseEvent, direction: MoveDirection) => {
            e.preventDefault();
            e.stopPropagation();
            const { clientX, clientY } = e;
            const { left, top, size: { width, height } } = props.block;

            state = {
                startX: clientX,
                startY: clientY,
                startLeft: afterScale(left),
                startTop: afterScale(top),
                startWidth: afterScale(width!),
                startHeight: afterScale(height!),
                direction
            }

            document.addEventListener('mousemove', onMousemove);
            document.addEventListener('mouseup', onMouseup);

            events.emit('dragResizeStart');
        }

        const onMousemove = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const { clientX, clientY } = e;
            const { startX, startY, startLeft, startTop, startWidth, startHeight, direction: { verticle, horizontal } } = state;

            let durX = clientX - startX;
            let durY = clientY - startY;

            if (horizontal === 'center') durX = 0;
            if (verticle === 'center') durY = 0;

            if (horizontal === 'start') {
                props.block.left = beforeScale(startLeft + durX);
                durX = -durX;
            }

            if (verticle === 'start') {
                props.block.top = beforeScale(startTop + durY);
                durY = -durY;
            }

            props.block.size.width = beforeScale(startWidth + durX);
            props.block.size.height = beforeScale(startHeight + durY);
        }

        const onMouseup = (e: MouseEvent) => {
            document.removeEventListener('mousemove', onMousemove);
            document.removeEventListener('mouseup', onMouseup);

            events.emit('dragResizeEnd', props.block);
        }

        return () => {
            const { resize } = props.component;
            if (!resize) return null;

            return (
                <>
                    {
                        resize.width && <>
                            <div class="block-resizer is--l" onMousedown={e => onMousedown(e, { horizontal: 'start', verticle: 'center' })}></div>
                            <div class="block-resizer is--r" onMousedown={e => onMousedown(e, { horizontal: 'end', verticle: 'center' })}></div>
                        </>
                    }
                    {
                        resize.height && <>
                            <div class="block-resizer is--t" onMousedown={e => onMousedown(e, { horizontal: 'center', verticle: 'start' })}></div>
                            <div class="block-resizer is--b" onMousedown={e => onMousedown(e, { horizontal: 'center', verticle: 'end' })}></div>
                        </>
                    }
                    {
                        (resize.width && resize.height) && <>
                            <div class="block-resizer is--tl" onMousedown={e => onMousedown(e, { horizontal: 'start', verticle: 'start' })}></div>
                            <div class="block-resizer is--tr" onMousedown={e => onMousedown(e, { horizontal: 'end', verticle: 'start' })}></div>
                            <div class="block-resizer is--bl" onMousedown={e => onMousedown(e, { horizontal: 'start', verticle: 'end' })}></div>
                            <div class="block-resizer is--br" onMousedown={e => onMousedown(e, { horizontal: 'end', verticle: 'end' })}></div>
                        </>
                    }
                </>
            )
        }
    }
});