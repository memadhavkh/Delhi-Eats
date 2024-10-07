import { IndianRupee } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";
import { Orders } from "@/types/orderType";
import { CartItem } from "@/types/cartType";

const Success = () => {
    const {orders, getOrderDetails} = useOrderStore();
    useEffect(() => {
        getOrderDetails();
    }, [getOrderDetails])
    if(orders === undefined || orders.length === 0){
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className='font-bold text-2xl text-gray-700 dark:text-gray-300'>Order Not Found</h1>
            </div>
        )
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full">
            <div className="text-center mb-6">
                <h1 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Order Status: {" "}
                    <span className="text-hoverOrange">{orders.map((order) => order.status.toUpperCase())}</span> </h1>
            </div>
            <div className="mb-6">
                <h2 className="font-semibold mb-4 text-lg text-gray-700 dark:text-gray-300">Order Summary</h2>
                {
                    orders.map((order: Orders , index: number) => (
                        <div key={index}>
                            {
                                order.cartItems.map((item: CartItem) => (
                                    <div key={item._id} className="mb-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <img loading="lazy" src={item.image} className="w-14 h-14 rounded-md object-cover" alt="" />
                                    <h3 className="ml-4 text-gray-800 dark:text-gray-100">{item.name}</h3>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-800 dark:text-gray-200 flex items-center">
                                        <IndianRupee className="text-lg" /> <span className="text-lg font-medium">{item.price}</span>
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-4" />
                        </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
            <Link to={'/'}>
            <Button className="bg-orange hover:bg-hoverOrange w-full rounded-md shadow-lg py-3 dark:text-gray-800 font-semibold">Continue Shopping</Button>
            </Link>
        </div>
    </div>
  )
}

export default Success