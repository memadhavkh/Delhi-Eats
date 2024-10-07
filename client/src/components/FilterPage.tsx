import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export type IFilterOptions = {
    id: string,
    label: string,
}[];
const filterOptions: IFilterOptions = [
    {
        id: "NorthIndian",
        label: "North Indian"
    },
    {
        id: "Chinese",
        label: "Chinese"
    },
    {
        id: "Italian",
        label: "Italian"
    },
    {
        id: "Beverages",
        label: "Beverages"
    },
    {
        id: "European",
        label: "European"
    },
    {
        id: "South Indian",
        label: "South Indian"
    }
]

const FilterPage = () => {
    const {setAppliedFilter, appliedFilter, resetAppliedFilter} = useRestaurantStore();
    const appliedFilterHandler = (value: string) => {
        setAppliedFilter(value);
    };

  return (
    <div className="md:w-64 md:mt-12 mx-10 md:mx-5">
        <div className="flex items-center justify-between">
            <h1 className="font-medium text-lg">Filter Cuisines</h1>
            <Button variant={'link'} onClick={resetAppliedFilter}>Reset</Button>
        </div>
        {
            filterOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 my-5">
                    <Checkbox checked={appliedFilter.includes(option.label)} id={option.id} onClick={() => appliedFilterHandler(option.label)} />
                        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{option.label}</Label>
                </div>
            ))
        }
    </div>
  )
}

export default FilterPage