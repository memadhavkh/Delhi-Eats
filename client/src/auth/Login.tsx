import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState<Partial<LoginInputState>>({});
  const [inputs, setInputs] = useState<LoginInputState>({
    email: "",
    password: "",
  });
  const {login, loading} = useUserStore();
  const navigate = useNavigate();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const result = userLoginSchema.safeParse(inputs);
    if(!result.success){
      const fieldErrors = result.error.formErrors.fieldErrors;
      setError(fieldErrors as Partial<LoginInputState>);
      return;
    }
    await login(inputs);
    navigate("/");
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form className="md:border border-gray-200 rounded-lg md:p-8 w-full max-w-md mx-4" onSubmit={handleLogin}>
        <div className="mb-4 flex flex-col items-center justify-center">
          <img loading="lazy" src="/logo.png" className="w-32 " alt="logo" />
          <h1 className="text-2xl mt-4 mb-4 font-semibold text-gray-900 dark:text-gray-100">Login To Your Account</h1>
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
        <div className="my-4 text-center">
          <Link className="text-blue-500" to={'/forgot-password'}>Forgot Password?</Link>
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
              Login
            </Button>
          )}
         
        </div>
        <Separator />
        <p className="mt-2">
          Don't have an account?{" "}
          <Link to={"/register"} className="text-blue-500 hover:underline">
            Register Here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
