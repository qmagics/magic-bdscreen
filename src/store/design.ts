import { defineStore } from 'pinia';

// interface DesignStoreState {
//     isPreView: boolean;

//     componentLib: {
//         activeCategory: string;
//     }
// }

const useDesignStore = defineStore('designStore', {
    state: () => {
        return {
            isPreView: false,

            componentLib: {
                activeCategory: "basic"
            }
        }
    },

    actions: {
        toggleIsPreview(value?: boolean) {
            this.isPreView = value ?? !this.isPreView;
        }
    }
})

export default useDesignStore;