import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RestaurantInputState, restaurantSchema } from '@/schema/restaurantSchema'
import { useRestaurantStore } from '@/store/useRestaurantStore'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

const Restaurant = () => {
    const [errors, setErrors] = useState<Partial<RestaurantInputState>>({});
    const [inputs, setInputs] = useState<RestaurantInputState>({
        restaurantName: "",
        city: "",
        country:  "",
        deliveryTime: 0,
        cuisines: [],
        imageFile: undefined,
    });
    const {loading, restaurant, getRestaurant, createRestaurant, updateRestaurant} = useRestaurantStore();
    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setInputs({ ...inputs, [name]: name === 'deliveryTime' ? Number(value): value });
    };
    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = restaurantSchema.safeParse(inputs);
        if(!result.success){
          const fieldErrors = result.error.formErrors.fieldErrors;
          setErrors(fieldErrors as Partial<RestaurantInputState>);
          return;
        }
          const formData = new FormData;
        formData.append("restaurantName", inputs.restaurantName);
        formData.append("city", inputs.city);
        formData.append("country", inputs.country);
        formData.append("deliveryTime", inputs.deliveryTime.toString());
        formData.append("cuisines", JSON.stringify(inputs.cuisines));
        if(inputs.imageFile){
            formData.append("imageFile", inputs.imageFile);
        }
        if(restaurant){
          await updateRestaurant(formData);
        } else {
          await createRestaurant(formData);
        }

    }
    useEffect(() => {
      const fetchRestaurant = async () => {
        await getRestaurant();
        if(restaurant){
          setInputs({
            restaurantName: restaurant?.restaurantName || "",
            city: restaurant?.city || "",
            country: restaurant?.country || "",
            deliveryTime: restaurant?.deliveryTime || 0,
            cuisines: restaurant?.cuisines ? restaurant.cuisines.map((cuisine: string) => cuisine) : [],
            imageFile: undefined
          })
        }
      }
      fetchRestaurant();
    },[getRestaurant, loading, restaurant])
  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className='mx-10 lg:mx-auto'>
          <h1 className='font-extrabold text-2xl mb-5'>{restaurant ? "Update Restaurant": "Add Restaurant"}</h1>
          <form onSubmit={submitHandler}>
              <div className='md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0'>
                  <div className='flex flex-col space-y-2 -space-x-1'>
                      <Label>Restaurant Name</Label>
                      <Input onChange={changeEventHandler} type='text' name='restaurantName' placeholder='Enter Your Restaurant Name'/>
                      {errors && (
            <span className="text-xs text-red-600 font-medium">
              {errors.restaurantName}
            </span>
          )}
                  </div>
                  <div className='flex flex-col space-y-2 -space-x-1'>
                      <Label>City</Label>
                      <Input onChange={changeEventHandler} type='text' name='city' placeholder='Enter Your City Name'/>
                      {errors && (
            <span className="text-xs text-red-600 font-medium">
              {errors.city}
            </span>
          )}
                  </div>
                  <div className='flex flex-col space-y-2 -space-x-1'>
                      <Label>Country</Label>
                      <Input onChange={changeEventHandler} type='text' name='country' placeholder='Enter Your Country Name'/>
                      {errors && (
            <span className="text-xs text-red-600 font-medium">
              {errors.country}
            </span>
          )}
                  </div>
                  <div className='flex flex-col space-y-2 -space-x-1'>
                      <Label>Delivery Time</Label>
                      <Input onChange={changeEventHandler} type='text' name='deliveryTime' placeholder='Enter Your Delivery Time'/>
                      {errors && (
            <span className="text-xs text-red-600 font-medium">
              {errors.deliveryTime}
            </span>
          )}
                  </div>
                  <div className='flex flex-col space-y-2 -space-x-1'>
                      <Label>Cuisines</Label>
                      <Input onChange={(e) => setInputs({...inputs, cuisines: e.target.value.split(",")})} type='text' name='cuisines' placeholder='Eg: Momos, Tikki'/>
                      {errors && (
                        <span className="text-xs text-red-600 font-medium">
                          {errors.cuisines}
                        </span>
                      )}
                  </div>
                  <div className='flex flex-col space-y-2 -space-x-1'>
                      <Label>Upload Restaurant Banner</Label>
                      <Input onChange={(e) => setInputs({...inputs, imageFile: e.target.files?.[0] || undefined})} type='file' accept='image/*' name='imageFile' />
                      {errors && (
                        <span className="text-xs text-red-600 font-medium">
                          {errors.imageFile?.name}
                        </span>
                      )}
                  </div>
              </div>
              <div className="my-5 w-full md:w-fit mx-auto">
                {loading ? (
                  <Button disabled className="bg-orange hover:bg-hoverOrange">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button className="bg-orange hover:bg-hoverOrange w-full">
                    {restaurant
                      ? "Update Your Restaurant"
                      : "Add Your Restaurant"}
                  </Button>
                )}
              </div>
          </form>
      </div>
    </div>
  )
}

export default Restaurant