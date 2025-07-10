"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth.context";
import { AuthService } from "@/services/auth.service";
import { useForm } from "react-hook-form";
import Image from "next/image";
import logoImg from "/public/images/logo-friendsure-lsh.webp";
import { useState } from "react";
import { Eye, EyeOff } from "react-feather";
import { useLoading } from "@/context/loading.context";
import { DASHBOARD_TRANSACTION } from "@/constants/routes";

export default function LoginPage() {
  const authService = new AuthService();
  const { login } = useAuth();
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const { setLoading } = useLoading();
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const token = await authService.login(data);
      login(token.access_token);
    } catch (error) {
      console.error(error);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-96 max-w-full">
          <div className="px-6 pt-4 pb-6 bg-white rounded-lg shadow-lg">
            <div className="sm:px-16 px-12 mb-5">
              <Image alt="Logo" src={logoImg} />
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mb-4 relative">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="pt-3">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
}
