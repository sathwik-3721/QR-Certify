import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {jwtDecode} from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";


import hubbleService from "@/services/hubble.service";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export default function LoginForm({ setAuthenticated }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await hubbleService.post.authHubbleLogin(data);
      console.log(response);

      if (
        response.status === 200 &&
        response.data.message === "Successfully logged in!"
      ) {
        const decodedToken = jwtDecode(response.data.token);
        const firstName = decodedToken.firstName || data.username;
        localStorage.setItem(
          "userData",
          JSON.stringify({ username: firstName,token : response.data.token})
        );
        setAuthenticated(true);
        navigate("/scanner");
      } else {
        toast.error("Please check your username and password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Please try again later..");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-[url('./assets/login.jpeg')] bg-center bg-cover">
          <div className="absolute bg-black opacity-30 inset-0"></div>
          
    <div className="relative bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-[90%] sm:max-w-md">
        <ToastContainer /> 
      <div className="flex justify-center mb-4">
        <span className="text-4xl font-bold text-miracle-darkBlue">
          <span className="text-miracle-lightBlue">Digital </span>Submit
        </span>
      </div>
      <hr className="border-b border-[#B7B2B3] mb-6 sm:mb-8" />

      <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4">
        SIGN IN
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        <div className="space-y-2 relative">
          <Label htmlFor="username" className="text-sm sm:text-base">
            Username
          </Label>
          <div className="relative">
            <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              id="username"
              placeholder="Username"
              className="pl-10 text-sm sm:text-base"
              {...register("username")}
            />
          </div>
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-2 relative">
          <Label htmlFor="password" className="text-sm sm:text-base">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pl-10 pr-10 text-sm sm:text-base"
              {...register("password")}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-[#2368A0] hover:bg-[#2368A0]/90 text-sm sm:text-base py-2 sm:py-3"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <div className="mt-6 sm:mt-8 text-center text-[10px] xs:text-xs sm:text-sm text-gray-600">
        © 2024 Miracle Software Systems, Inc.
      </div>
    </div>
    </div>
  );
}