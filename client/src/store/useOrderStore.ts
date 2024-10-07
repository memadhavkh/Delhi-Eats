import { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const API_ENDPOINT: string = 'http://localhost:8000/api/v1/order';
axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>()(persist((set) =>({
    loading: false,
    orders: [],
    createCheckoutSession: async (checkoutSessionRequest: CheckoutSessionRequest) => {
        try {
            const response = await axios.post(`${API_ENDPOINT}/checkout/create-checkout-session`, checkoutSessionRequest, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response)
            window.location.href = response.data.session.url;
        } catch  {
            toast.error("Error Creating Checkout Session With Stripe")
        }
    },
    getOrderDetails: async () => {
        try {
            const response = await axios.get(`${API_ENDPOINT}/`);
            console.log(response)
            set({orders:response.data.order});
        } catch {
            console.log("Error Getting Order Details");
        }
    }
}), {
    name: 'order-name',
    storage: createJSONStorage(() => localStorage)
}))