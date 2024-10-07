import { Loader2, LocateIcon, Mail, MapPin, MapPinnedIcon, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { FormEvent, useRef, useState } from "react"
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";

const Profile = () => {
  const imageRef = useRef<HTMLInputElement | null>(null);
  const {user, updateProfile} = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedProfilePic, setSelectedProfilePic] = useState<string>(user?.profilePic || "");
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country ||  "",
    profilePic: user?.profilePic || ""
  });
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setProfileData({...profileData, [name]: value})
  }
  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedProfilePic(result)
        setProfileData((prev) => ({
          ...prev,
          profilePic: result,
        }))
      };
      reader.readAsDataURL(file);
    }
  };
  const updateProfileHandler = async (e: FormEvent) => {
    e.preventDefault();
    // update api implementation
    try {
      setIsLoading(true);
      await updateProfile(profileData);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  }
  return (
    <form className="max-w-7xl mx-auto my-5" onSubmit={updateProfileHandler}>
      <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="relative md:w-28 md:h-28 w-20 h-20">
          <AvatarImage src={selectedProfilePic} />
          <AvatarFallback>MK</AvatarFallback>
        <input ref={imageRef} type="file" className="hidden" accept="image/*" onChange={fileChangeHandler} /> 
        <div onClick={() => imageRef.current?.click()} className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full"  >

        <Plus className="text-white w-8 h-8" />
        </div>
        </Avatar>
        <Input value={profileData.name} onChange={changeHandler} type="text" name="name" className="font-bold text-2xl outline-none border-none focus-visible:ring-transparent" />
      </div>
      </div>
      <div className="grid md:grid-cols-4 md:gap-2 gap-3 my-10">
        <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
          <Mail className="text-gray-500" />
          <div className="w-full">
            <Label>Email</Label>
            <input
            disabled
              name="email"
              value={profileData.email}
              onChange={changeHandler}
              className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
          <LocateIcon className="text-gray-500" />
          <div className="w-full">
            <Label>Address</Label>
            <input
              name="address"
              value={profileData.address}
              onChange={changeHandler}
              className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
          <MapPin className="text-gray-500" />
          <div className="w-full">
            <Label>City</Label>
            <input
              name="city"
              value={profileData.city}
              onChange={changeHandler}
              className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
          <MapPinnedIcon className="text-gray-500" />
          <div className="w-full">
            <Label>Country</Label>
            <input
              name="country"
              value={profileData.country}
              onChange={changeHandler}
              className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>
      </div>
      <div className="text-center">
        {isLoading ? (
          <Button disabled className="bg-orange hover:bg-hoverOrange">
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="bg-orange hover:bg-hoverOrange">Update</Button>
        )}
      </div>

    </form>
  )
}

export default Profile