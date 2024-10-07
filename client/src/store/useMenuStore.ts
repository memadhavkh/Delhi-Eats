import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useRestaurantStore } from "./useRestaurantStore";

type MenuState = {
    loading: boolean,
    menu: null,
    createMenu: (formData: FormData) => Promise<void>,
    editMenu: (menuId: string, formData: FormData) => Promise<void>,
}

const API_ENDPOINT = 'http://localhost:8000/api/v1/menu';
axios.defaults.withCredentials = true

export const useMenuStore = create<MenuState>()(persist((set) => ({
    loading: false,
    menu: null,
    createMenu: async (formData: FormData) => {
        try {
            set({loading: true});
            const response = await axios.post(`${API_ENDPOINT}/`, formData, {
                headers: {
                    'Content-Type':'multipart/form-data'
                }
            })
            if(response.data.success){
                toast.success(response.data.message);
                set({loading: false});
            }
            // update restaurant
            useRestaurantStore.getState().addMenuToRestaurant(response.data.menu)
        } catch {
            toast.error("All Field Are Required")
            set({loading: false});
        }
    },
    editMenu: async (menuId: string, formData: FormData) => {
        try {
            set({loading: true});
            const response = await axios.put(`${API_ENDPOINT}/${menuId}`, formData, {
                headers: {
                    'Content-Type':'multipart/form-data'
                }
            });
            if(response.data.success){
                toast.success(response.data.message);
                set({loading: false, menu: response.data.menu});
            }
            useRestaurantStore.getState().updateMenuToRestaurant(response.data.menu)

        } catch {
            toast.error("Failed To Update Menu");
            set({loading: false});
        }
    },

}), {
    name: 'menu-name',
    storage: createJSONStorage(() => localStorage)
}))