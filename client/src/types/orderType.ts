export type CheckoutSessionRequest = {
    cartItems: {
        _id: string,
        name: string,
        image: string,
        price: number,
        quantity: number,
        description: string
    }[],
    deliveryDetails: {
        name: string,
        email: string,
        address: string,
        city: string,
        country: string,
        contact: string
    },
    restaurantId: string
};

export interface Orders extends CheckoutSessionRequest {
    _id: string,
    status: string,
    totalAmount: number
}

export type OrderState = {
    loading: boolean,
    orders: Orders[],
    createCheckoutSession: (checkoutSessionRequest: CheckoutSessionRequest) => Promise<void>,
    getOrderDetails: () => Promise<void>
}