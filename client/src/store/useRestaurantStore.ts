
import { Orders } from "@/types/orderType";
import { MenuItem, RestaurantState } from "@/types/restaurantType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


const API_ENDPOINT = 'https://delhi-eats.onrender.com/api/v1/restaurant';
axios.defaults.withCredentials = true;
export const useRestaurantStore = create<RestaurantState>()(persist((set, get) => ({
    loading: false,
    restaurant: null,
    searchedRestaurant: null,
    appliedFilter: [],
    singleRestaurant: null,
    restaurantOrder: [],
    createRestaurant: async (formData: FormData) => {
        try {
            set({loading: true});
            const response = await axios.post(`${API_ENDPOINT}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(response.data.success){
                toast.success(response.data.message);
            }
            set({loading: false});
        } catch {
            set({loading: false});
            toast.error("Failed To Create Restaurant");
        }
    },
    getRestaurant: async () => {
        try {
            const response = await axios.get(`${API_ENDPOINT}`);
            if(response.data.success){
                set({restaurant: response.data.restaurant});
            }
        } catch {
            set({loading: false});
        }
    },
    updateRestaurant: async (formData: FormData) => {
        try {
            set({loading: true});
            const response = await axios.put(`${API_ENDPOINT}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            if(response.data.success){
                toast.success(response.data.message);
            }
            set({loading: false});
        } catch {
            set({loading: false});
            toast.error("Restaurant Not Found");
        }
    },
    searchRestaurant: async (searchText: string, searchQuery: string, selectedCuisines ) => {
        try {
            set({loading: false});
            const params = new URLSearchParams();
            params.set("searchQuery", searchQuery);
            params.set("selectedCuisines", selectedCuisines.join(","));
            const response = await axios.get(`${API_ENDPOINT}/search/${searchText}?${params.toString()}`);
            set({loading: false});
            if(response.data.success as boolean){
                set({searchedRestaurant: response.data});
            }
        } catch{
            toast.error("Failed To Search Restaurant");
            set({loading: false})
        }
    },
    addMenuToRestaurant: (menu: MenuItem) => {
        set((state: RestaurantState) => ({
            restaurant: state.restaurant ? {...state.restaurant, menus: [...state.restaurant.menus, menu]}: null,
        }))
    },
    updateMenuToRestaurant: (updatedMenu: MenuItem) => {
        set((state: RestaurantState) => {
            if(state.restaurant){
                const updatedMenuList = state.restaurant.menus.map((menu: MenuItem) => menu._id === updatedMenu._id ? updatedMenu: menu);
                return {
                    restaurant: {
                        ...state.restaurant,
                        menus: updatedMenuList
                    }
                }
            }
            return state;
        })
    },
    setAppliedFilter: (value: string) => {
        set((state: RestaurantState) => {
            const isAlreadyApplied = state.appliedFilter.includes(value);
            const updatedFilter = isAlreadyApplied ? state.appliedFilter.filter((item: string) => item !== value): [...state.appliedFilter, value];
            return {
                appliedFilter: updatedFilter
            }
        })
    },
    resetAppliedFilter: () => {
        set({appliedFilter: []})
    },
    getSingleRestaurant: async (restaurantId: string) => {
        try {
            const response = await axios.get(`${API_ENDPOINT}/${restaurantId}`);
            if(response.data.success){
                set({singleRestaurant: response.data.restaurant});
            }
        } catch {
            toast.error("No Restaurant Found")
        }
    },
    getRestaurantOrders: async () => {
        try {
            const response = await axios.get(`${API_ENDPOINT}/order`);
            if(response.data.success){
                set({restaurantOrder: response.data.orders});
            }
        } catch {
            toast.error("Failed To Get Restaurant Orders");
        }
    },
    updateRestaurantOrder: async (orderId: string, status: string) => {
        set({loading: true})
        try {
            const response = await axios.put(`${API_ENDPOINT}/order/${orderId}/status`, {status}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(response.data.success){
                const updatedOrder = get().restaurantOrder.map((order: Orders) => {
                    return order._id === orderId? {...order, status: response.data.status}: order;
                });
                set({restaurantOrder: updatedOrder, loading: false});
                toast.success(response.data.message);
            }
        } catch {
            toast.error("Failed to Update Restaurant Order");
            set({loading: false})
        }
    }
}), {
    name: 'restaurant-name',
    storage: createJSONStorage(() => localStorage)
}))