import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
    const [userCity, setUserCity] = useState<string>("");
    const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-4 md:mx-auto md:p-10 rounded-lg items-center justify-center m-4 gap-20 ">
      <div className="flex flex-col gap-10 md:w-[40%]">
      <div className="flex flex-col gap-5">
          <h1 className="font-bold md:font-extrabold md:text-5xl text-4xl">
            Order Food anytime & anywhere
          </h1>
          <p className="text-gray-500">
            Hey! Our Delicious food is waiting for you, we are always near to
            you.
          </p>
        </div>
        <div className="relative flex items-center gap-2">
            <Input type="text" value={userCity} onChange={(e) => setUserCity(e.target.value)} className="pl-10 shadow-lg" placeholder="Search Restaurant by name or city"/>
            <Search className="text-gray-500 absolute inset-y-2 left-2" />
            </div>
            <Button className="bg-orange hover:bg-hoverOrange" onClick={()=> navigate(`/search/${userCity}`)}>Search</Button>
      </div>
      <div>
        <img loading="lazy" src='/hero_pizza.png' className="object-cover w-full max-h-[500px]" />
      </div>
    </div>
  );
};

export default HeroSection;
