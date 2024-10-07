import { Orders } from "./orderType"

export type RestaurantState = {
    loading: boolean,
    restaurant: Restaurant | null,
    searchedRestaurant: SearchedRestaurant | null,
    appliedFilter: string[],
    singleRestaurant: Restaurant | null,
    restaurantOrder: Orders[],
    createRestaurant: (formData: FormData) => Promise<void>,
    getRestaurant: () => Promise<void>,
    updateRestaurant: (formData: FormData) => Promise<void>,
    searchRestaurant: (searchText: string, searchQuery: string, selectedCuisines: string[]) => Promise<void>,
    addMenuToRestaurant: (menu: MenuItem) => void,
    updateMenuToRestaurant: (menu: MenuItem) => void,
    setAppliedFilter: (value: string) => void,
    resetAppliedFilter: () => void,
    getSingleRestaurant: (restaurantId: string) => Promise<void>,
    getRestaurantOrders: () => Promise<void>,
    updateRestaurantOrder: (orderId: string, status: string) => Promise<void>,

}

export type MenuItem = {
    _id: string,
    name: string,
    price: number,
    description: string,
    image: string
}

export type Restaurant = {
    _id: string,
    user: string,
    restaurantName: string,
    city: string,
    country: string,
    deliveryTime: number,
    cuisines: string[],
    imageURL: string,
    menus: MenuItem[]
}

export type SearchedRestaurant = {
    restaurants: Restaurant[]
}
