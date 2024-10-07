import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import { Loader2 } from "lucide-react";
import { FormEvent, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
    const [otp, setOtp] = useState<string[]>(["", "" , "" , "", "" , ""]);
    const inputRef = useRef<(HTMLInputElement|null)[]>([]);
    const {verifyEmail, loading} = useUserStore();
    const navigate = useNavigate();
    // TODO: Kuch seekhne ka hai yaha 
    const handleChange = (index: number, value: string) => {
        if(/^[a-zA-Z0-9]$/.test(value) || value === ""){
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
        }
        // move to the next input field if a digit is entered
        if(value !== "" && index < 5){
            inputRef.current[index + 1]?.focus();
        }
    }
    const handleKeyDown = (index: number, e : React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Backspace' && !otp[index] && index > 0){
            inputRef.current[index - 1]?.focus();
        }
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const verficationCode: string = otp.join("");
        await verifyEmail(verficationCode);
        navigate("/");
    }
  return (
    <div className="flex items-center justify-center h-screen w-full">
        <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-200">
            <div className="text-center">
                <h1 className="font-extrabold text-2xl">Verify Your Email Address</h1>
                <p className="text-sm text-gray-600">Enter the 6 digit code sent to your email address.</p>
            </div>
            <form onSubmit={submitHandler}>
                <div className="flex justify-between">
                    {
                        otp.map(
                        (letter: string, index: number) => (
                            <Input
                            key={index}
                            type="text"
                            value={letter}
                            ref={(el) => inputRef.current[index] = el}
                            maxLength={1}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                            onChange={(e) => handleChange(index, e.target.value)}
                            className="text-lg md:w-12 md:h-12 w-8 h-8 text-center md:text-2xl font-normal  md:font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        ))
                    }
                </div>
                {loading ? (
                    <Button className="bg-orange hover:bg-hoverOrange mt-6 w-full" disabled>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Please Wait
                    </Button>
                ): (
                    <Button type="submit" className="bg-orange hover:bg-hoverOrange mt-6 w-full">Verify</Button>
                )}
            </form>
        </div>
    </div>
  )
}

export default VerifyEmail