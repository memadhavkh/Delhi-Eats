import { useParams } from "react-router-dom"
import { Badge } from "./ui/badge";
import { Timer } from "lucide-react";
import AvailableMenu from "./AvailableMenu";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useEffect } from "react";
const RestaurantDetail = () => {
    const params = useParams();
    const {singleRestaurant, getSingleRestaurant} = useRestaurantStore();
    
    useEffect(() => {
        getSingleRestaurant(params.id!);  // Get restaurant details on mounting component
    },[getSingleRestaurant, params.id, singleRestaurant])


  return (
    <div className="max-w-6xl mx-10 my-10 lg:mx-auto">
        <div className="w-full">
            <div className="relative w-full h-32 md:h-64 lg:h-72">
                <img loading="lazy" src={singleRestaurant?.imageURL} alt="res_image" className="object-cover w-full h-full rounded-lg shadow-lg"/>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
                <div className="my-5">
                    <h1 className="font-medium text-xl">{singleRestaurant?.restaurantName || "Loading..."}</h1>
                    <div className="flex gap-2 my-2">
                        {
                            singleRestaurant?.cuisines.map((cuisine: string, index: number) => (
                                <Badge key={index}>{cuisine}</Badge>
                            ))
                        }
                    </div>
                    <div className="flex md:flex-row flex-col gap-2 my-5">
                        <div className="flex items-center gap-2">
                            <Timer className="w-5 h-5" />
                            <h1 className="flex items-center gap-2 font-medium">Delivery Time: {" "} <span className="text-[#D19254]">{singleRestaurant?.deliveryTime} mins</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
            <AvailableMenu menus={singleRestaurant?.menus} />
        </div>
    </div>
  )
}

export default RestaurantDetail