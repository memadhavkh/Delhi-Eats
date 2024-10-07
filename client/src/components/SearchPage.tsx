import { Link, useParams } from "react-router-dom"
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Globe, MapPin, Search, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Restaurant } from "@/types/restaurantType";
import { Skeleton } from "./ui/skeleton";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import FilterPage from "./FilterPage";

const SearchPage = () => {
    const params = useParams();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const {loading, searchRestaurant, searchedRestaurant, appliedFilter, setAppliedFilter} = useRestaurantStore();
    useEffect(() => {
      searchRestaurant(params.id!, searchQuery, appliedFilter);
    }, [appliedFilter, params.id, searchQuery, searchRestaurant, searchedRestaurant])

  return (
    <div className="max-w-7xl mx-auto my-10">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <FilterPage />
            <div className="flex-col space-y-2">
              <div className="mx-10 md:mx-auto relative"
              >
                  <Input type="text" value={searchQuery} placeholder="Search by restaurant name or city" onChange={(e)=>setSearchQuery(e.target.value)}/>
                  <Button className="absolute z-10 top-0 right-0 bg-gray-100 text-black dark:bg-gray-300 dark:text-gray-800 hover:bg-gray-300 dark:hover:bg-gray-400" onClick={() => searchRestaurant(params.text!, searchQuery, appliedFilter)} ><Search /></Button>
              </div>
              <div>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2 my-3 mx-10 md:mx-auto">
                      <h1 className="font-medium text-lg">({searchedRestaurant?.restaurants.length}) Search Result Found</h1>
                      <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                          {
                              appliedFilter.map((selectedFilter: string, idx: number) => (
                                  <div key={idx} className="relative inline-flex items-center max-w-full">
                                      <Badge className="text-[#D19254] rounded-md hover:cursor-pointer pr-6 whitespace-nowrap" variant={'outline'}>{selectedFilter}</Badge>
                                      <X onClick={() => setAppliedFilter(selectedFilter)} className="absolute text-[#D19254] right-1 hover:cursor-pointer" size={16}
                                      />
                                  </div>
                              ))
                          }
                      </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mx-10 md:mx-auto">
                    {
                      loading ? <SearchPageSkeleton /> : (
                        !loading && searchedRestaurant?.restaurants.length === 0 ? ( <NoResultFound searchText={params?.searchText} /> ): (
                          searchedRestaurant?.restaurants.map((restaurant: Restaurant) => (
                            <Card key={restaurant._id} className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                            <div className="relative">
                                <AspectRatio ratio={16/6}>
                                    <img loading="lazy" src={restaurant.imageURL} className="w-full h-full object-cover" />
                                </AspectRatio>
                                <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 bg-opacity-75 rounded-lg py-1 px-3">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured</span>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{restaurant.restaurantName}</h1>
                                <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                                    <MapPin size={16} />
                                    <p className="text-sm">
                                        City: {" "}
                                        <span className="font-medium">{restaurant.city}</span>
                                    </p>
                                </div>
                                <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                                    <Globe size={16} />
                                    <p className="text-sm">
                                        Country: {" "}
                                        <span className="font-medium">{restaurant.country}</span>
                                    </p>
                                </div>
                                <div className="flex gap-2 mt-4 flex-wrap">
                                    {
                                        restaurant.cuisines.map((cuisine: string, idx: number) => (
                                            <Badge key={idx} className="font-medium px-2 py-1 rounded-full shadow-sm bg-gray-800 dark:bg-gray-200">{cuisine}</Badge>
                                        ))
                                    }
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100 text-white flex justify-center">
                                <Link to={`/restaurant/${restaurant._id}`}>
                                    <Button className="font-semibold bg-orange hover:bg-hoverOrangeoy-2 px-4 rounded-full shadow-md transition-colors duration-200">View Menus</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                        ))
                        )

                      )
                    }
                      
                  </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default SearchPage;


const SearchPageSkeleton = () => {
    return (
      <>
        {[...Array(3)].map((_, index) => (
          <Card
            key={index}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden"
          >
            <div className="relative">
              <AspectRatio ratio={16 / 6}>
                <Skeleton className="w-full h-full" />
              </AspectRatio>
            </div>
            <CardContent className="p-4">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="mt-2 flex gap-1 items-center text-gray-600 dark:text-gray-400">
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex gap-2 mt-4 flex-wrap">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
            <CardFooter className="p-4  dark:bg-gray-900 flex justify-end">
              <Skeleton className="h-10 w-24 rounded-full" />
            </CardFooter>
          </Card>
        ))}
      </>
    );
  };
  
  const NoResultFound = ({ searchText }: { searchText: string | undefined }) => {
    const {appliedFilter} = useRestaurantStore();
    // UPDATE: text-center
    return (
      <div className="">
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 text-center">
          No results found
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-center">
          We couldn't find any results for "{searchText ? searchText : appliedFilter}". <br /> Try searching
          with a different term.
        </p>
        <Link to="/" className="">
          <Button className="mt-4 bg-orange hover:bg-orangeHover text-center">
            Go Back to Home
          </Button>
        </Link>
      </div>
    );
  };