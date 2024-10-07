import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { useUserStore } from "@/store/useUserStore";
import { Loader2, Mail } from "lucide-react";
import { FormEvent, useState } from "react"
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>("");
    const {forgotPassword, loading} = useUserStore();
    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Email Is Required!");
            return;
        }
        try {
            await forgotPassword(email);         
        } catch {
            toast.error("Failed To Send Reset Password Email");
        }
    }
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
        <form className="flex flex-col gap-5 md:border md:p-8 w-full max-w-md rounded-lg mx-4 " onSubmit={submitHandler}>
            <div className="text-center">
                <img loading="lazy" src="/logo.png" className="w-32 mb-4 mx-auto" alt="" />
                <h1 className="font-bold text-xl mb-2">Forgot Password</h1>
                <p className="text-sm font-light text-gray-600">Enter your email address to reset your password</p>
            </div>
            <div className="relative w-full">
                <Input type="text" onChange={(e)=>setEmail(e.target.value)} value={email} placeholder="name@company.com" className="pl-10" />
                <Mail className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
            </div>
            {loading ? (
                <Button className="bg-orange hover:bg-hoverOrange" disabled>
                    <Loader2 className="h-4 mr-2 w-4 animate-spin" />
                    Please Wait
                </Button>
            ) : (
                <Button className="bg-orange hover:bg-hoverOrange">
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

export default ForgotPassword