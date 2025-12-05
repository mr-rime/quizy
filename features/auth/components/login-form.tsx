'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from "../utils/validations";
import z from "zod";
import { useTransition } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { redirect } from "next/navigation";



export function LoginForm() {
    const [isPending, startTransition] = useTransition();
    const { register, formState: { errors, }, handleSubmit } = useForm({
        resolver: zodResolver(loginSchema)
    });


    const onSubmit = async (data: z.output<typeof loginSchema>) => {
        startTransition(async () => {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include"
            });

            const result = await res.json();
            if (!result.success) {
                toast.error(result.error);
            }

            if (result.success) {
                toast.success(result.message);
                redirect("/latest");
            }
        })
    };

    return (
        <Card className="w-[500px]">
            <CardHeader>
                <CardTitle className="text-3xl">Login</CardTitle>
                <CardDescription>Enter your email and password to login</CardDescription>
            </CardHeader>
            <CardContent>
                <form id="login" className="w-full  space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Label htmlFor="email" className="mb-3">Email address</Label>
                        <Input {...register("email")}
                            arria-invalid={errors.email ? "true" : "false"}
                            id="email" type="email" placeholder="Enter your email address" className={`mb-2 ${errors.email && "border-red-500 ring-red-500!"}`} />
                        <p className={`transition-all ${errors.email ? "h-4" : "h-0  overflow-hidden"}`}>
                            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="password" className="mb-3">Password</Label>
                        <Input {...register("password")}
                            arria-invalid={errors.password ? "true" : "false"}
                            id="password" type="password" placeholder="Enter your password" className={`mb-2 ${errors.password && "border-red-500 ring-red-500!"}`} />
                        <p className={`transition-all ${errors.password ? "h-4" : "h-0  overflow-hidden"}`}>
                            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                        </p>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col">
                {isPending ? <Button className="w-full" disabled><Loader className="animate-spin" /></Button> : <Button className="w-full" form="login" type="submit">Login</Button>}
                <div className="flex items-center justify-center mt-4 space-x-1">
                    <span className="text-muted-foreground">Already have an account? </span>  <Link href={"/signup"}>Signup</Link>
                </div>
            </CardFooter>
        </Card>
    )
}
