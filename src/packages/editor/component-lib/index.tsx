import { MANAGER_KEY } from "@/packages/tokens";
import useDesignStore from "@/store/design";
import { RegisterComponent } from "@/types";
import { computed, defineComponent, inject } from "vue";

export default defineComponent({
    emits: ['itemDragstart', 'itemDragend'],

    setup: (props, { emit }) => {
        const manager = inject(MANAGER_KEY)!;

        const { componentLib } = useDesignStore();

        const { componentList, componentCategories } = manager!;

        const currentComponentList = computed(() => {
            return componentList.filter(i => i.category === componentLib.activeCategory);
        });

        const onItemDragstart = (e: Event, component: RegisterComponent) => {
            emit('itemDragstart', e, component);
        }

        const onItemDragend = (e: Event, component: RegisterComponent) => {
            emit('itemDragend', e, component);
        }

        return () => {
            return <div class="component-lib">
                <div class="component-lib__menu">
                    {
                        componentCategories.map(cat => {
                            return <div
                                class={['menu-item', { 'is--active': componentLib.activeCategory === cat.value }]}
                                onClick={() => { componentLib.activeCategory = cat.value }}>
                                <svg-icon class="menu-item__icon" name={cat.icon}></svg-icon>
                                <span class="menu-item__name">{cat.name}</span>
                            </div>
                        })
                    }
                </div>
                <div class="component-lib__content">
                    {currentComponentList.value.map(component => {
                        // const { preview } = manager.componentMap[component.type];
                        return <div class="component-item" draggable onDragstart={e => onItemDragstart(e, component)} onDragend={e => onItemDragend(e, component)}>
                            {/* {preview()} */}
                            <svg-icon class="component-item__icon" name={component.icon}></svg-icon>
                            <span class="component-item__name">{component.name}</span>
                        </div>
                    })}
                </div>
            </div>
        }
    }
})