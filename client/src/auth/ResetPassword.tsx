import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Loader2, LockKeyholeIcon } from "lucide-react";
import { FormEvent, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import {useUserStore} from '@/store/useUserStore'
const ResetPassword = () => {
    const params = useParams();
    const {resetPassword, loading} = useUserStore();
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await resetPassword(params.token!, password);
        navigate("/login")
    }
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
        <form className="flex flex-col gap-5 md:border md:p-8 w-full max-w-md rounded-lg mx-4" onSubmit={handleSubmit}>
            <div className="text-center">
                <img loading="lazy" src="/logo.png" className="w-32 mx-auto mb-4" alt="" />
                <h1 className="font-bold text-xl mb-2">Reset Password</h1>
                <p className="text-sm text-light text-gray-600">Enter your new password to login into your account</p>
            </div>
            <div className="relative w-full">
                <Input type="password" onChange={(e)=>setPassword(e.target.value)} value={password} placeholder="********" className="pl-10" />
                <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
            </div>
            {loading ? (
                <Button className="bg-orange hover:bg-hoverOrange" disabled>
                    <Loader2 className="h-4 mr-2 w-4 animate-spin" />
                    Please Wait
                </Button>
            ) : (
                <Button type='submit' className="bg-orange hover:bg-hoverOrange">
                    Send Reset Password Link
                </Button>
            )}
            <span className="text-center">Back to {" "}
                <Link to={'/login'} className="text-blue-500 hover:underline">Login Page</Link>
            </span>
        </form>
    </div>
  )
}

export default ResetPassword;