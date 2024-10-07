import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SignUpInputState, userSignupSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyhole, Mail, Phone, User } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";


const SignUp = () => {
  // Partial error shows that there is a partial error in sign up input state
  const [error, setError] = useState<Partial<SignUpInputState>>({});
  const [inputs, setInputs] = useState<SignUpInputState>({
    name: "",
    email: "",
    password: "",
    contact: ""
  });
  const navigate = useNavigate();
  const {register, loading} = useUserStore();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    // form validation check
    const result = userSignupSchema.safeParse(inputs);
    if(!result.success){
      const fieldError = result.error.formErrors.fieldErrors;
      setError(fieldError as Partial<SignUpInputState>);
      return;
    }
    await register(inputs).then(() => {
      navigate('/verify-email')
    }).catch((error) => {
      toast.error(error.message)
    });
    
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form className="md:border border-gray-200 rounded-lg md:p-8 w-full max-w-md mx-4" onSubmit={handleRegister}>
      <div className="mb-4 flex flex-col items-center justify-center">
          <img loading="lazy" src="/logo.png" className="w-32 " alt="logo" />
          <h1 className="text-2xl mt-4 mb-4 font-semibold text-gray-900 dark:text-gray-100">Create Your Account</h1>
        </div>
        <div className="relative mb-4">
          <Input
            onChange={handleInputChange}
            value={inputs.name}
            type="text"
            name="name"
            placeholder="Your Full Name"
            className="pl-10 focus-visible:ring-1"
          />
          <User className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {error && <span className="text-xs text-red-500">{error.name}</span>}
        </div>
        <div className="relative mb-4">
          <Input
            onChange={handleInputChange}
            value={inputs.email}
            type="email"
            name="email"
            placeholder="name@company.com"
            className="pl-10 focus-visible:ring-1"
          />
          <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {error && <span className="text-xs text-red-500">{error.email}</span>}
        </div>
        <div className="relative mb-4">
          <Input
            onChange={handleInputChange}
            value={inputs.password}
            type="password"
            name="password"
            placeholder="********"
            className="pl-10 focus-visible:ring-1"
          />
          <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {error && <span className="text-xs text-red-500">{error.password}</span>}
        </div>
        <div className="relative mb-4">
          <Input
            onChange={handleInputChange}
            value={inputs.contact}
            type="text"
            name="contact"
            placeholder="9999988888"
            className="pl-10 focus-visible:ring-1"
          />
          <Phone className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {error && <span className="text-xs text-red-500">{error.contact}</span>}
        </div>
        <div className="mb-10">
          {loading ? (
            <Button disabled className="w-full bg-orange hover:bg-hoverOrange">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-orange hover:bg-hoverOrange"
            >
              Sign Up
            </Button>
          )}
        </div>
        <Separator />
        <p className="mt-2">
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
