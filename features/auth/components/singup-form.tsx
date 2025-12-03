'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signupSchema } from "../utils/validations";
import z from "zod";
import { authClient } from "@/lib/auth-client";
export function SingupForm() {
    const { register, formState: { errors }, handleSubmit } = useForm({
        resolver: zodResolver(signupSchema)
    });

    // TODO: Implement signup logic
    const onSubmit = async (data: z.output<typeof signupSchema>) => {
        const { data: user } = await authClient.signUp.email({
            name: data.username,
            email: data.email,
            password: data.password,
        }, {
            onRequest: (ctx) => {

            },
            onSuccess: (ctx) => {

            },

            onError: (ctx) => {

            }
        })
    };

    return (
        <Card className="w-[500px]">
            <CardHeader>
                <CardTitle className="text-3xl">Create your account</CardTitle>
                <CardDescription>Enter your username and password to create your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form id="signup" className="w-full  space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Label htmlFor="username" className="mb-3">Username</Label>
                        <Input {...register("username")} id="username" type="text" placeholder="Enter your username" className={`mb-2 ${errors.username && "border-red-500 ring-red-500!"}`} />
                        <p className={`transition-all ${errors.username ? "h-4" : "h-0  overflow-hidden"}`}>
                            {errors.username && <span className="text-red-500">{errors.username.message}</span>}
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="email" className="mb-3">Email address</Label>
                        <Input {...register("email")} id="email" type="email" placeholder="Enter your email address" className={`mb-2 ${errors.email && "border-red-500 ring-red-500!"}`} />
                        <p className={`transition-all ${errors.email ? "h-4" : "h-0  overflow-hidden"}`}>
                            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="password" className="mb-3">Password</Label>
                        <Input  {...register("password")} id="password" type="password" placeholder="Enter your password" className={`mb-2 ${errors.password && "border-red-500 ring-red-500!"}`} />
                    </div>

                    <div>
                        <Label htmlFor="confirm-password" className="mb-3">Confirm Password</Label>
                        <Input {...register("confirmPassword")} id="confirm-password" type="password" placeholder="Enter your password" className={`mb-2 ${errors.confirmPassword && "border-red-500 ring-red-500!"}`} />
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col">
                <Button form="signup" className="w-full">Create an account</Button>
                <div className="flex items-center justify-center mt-4 space-x-1">
                    <span className="text-muted-foreground">Already have an account? </span>  <Link href={"/login"}>Login</Link>
                </div>
            </CardFooter>
        </Card>
    )
}
