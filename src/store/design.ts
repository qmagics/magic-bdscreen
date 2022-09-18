import { defineStore } from 'pinia';

const useDesignStore = defineStore('designStore', {
    state: () => {
        return {
            componentLib: {
                activeCategory: "basic"
            }
        }
    },
})

export default useDesignStore;