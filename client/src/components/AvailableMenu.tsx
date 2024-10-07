import { useCartStore } from "@/store/useCartStore";
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter } from "./ui/card"
import { MenuItem } from "@/types/restaurantType"
import { toast } from "sonner";


const AvailableMenu = ({menus}: {menus: MenuItem[] | undefined}) => {
    const {addToCart} = useCartStore();
   
  return (
    <div className="md:p-4">
        <h1 className="text-xl md:text-2xl font-extrabold mb-6">Available Menus</h1>
        <div className="grid md:grid-cols-3 space-y-4 md:space-y-0">
            {
                menus?.map((menu: MenuItem) => (
                <Card className="md:max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden">
                <img loading="lazy" src={menu.image} className="w-full h-40 object-cover" />
                <CardContent className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-50">{menu.name}</h2>
                    <p className="text-sm text-gray-600 mt-2 dark:text-gray-50">{menu.description}</p>
                    <h3 className="text-lg
                     font-semibold mt-4">Price: <span className="text-[#D19254]">₹ {menu.price}</span></h3>
                </CardContent>
                <CardFooter className="p-4">
                    <Button onClick={() => {
                        addToCart(menu);
                        toast.success("Item Added To Cart!")
                    }} className="w-full bg-orange hover:bg-hoverOrange">Add To Cart</Button>
                </CardFooter>
            </Card>

                ))
            }
            

        </div>
    </div>
  )
}

export default AvailableMenu