"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { updateUserEmail, updateUsername, updatePassword } from "../services/update-user";
import { updateEmailSchema, updateUsernameSchema, updatePasswordSchema, UpdateEmailSchema, UpdateUsernameSchema, UpdatePasswordSchema } from "../utils/validations";
import { User, Mail, Lock } from "lucide-react";

interface ProfileFormProps {
    user: {
        email: string;
        username: string;
    };
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isLoadingEmail, setIsLoadingEmail] = useState(false);
    const [isLoadingUsername, setIsLoadingUsername] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);

    const emailForm = useForm<UpdateEmailSchema>({
        resolver: zodResolver(updateEmailSchema),
        defaultValues: {
            email: user.email,
        },
    });

    const usernameForm = useForm<UpdateUsernameSchema>({
        resolver: zodResolver(updateUsernameSchema),
        defaultValues: {
            username: user.username,
        },
    });

    const passwordForm = useForm<UpdatePasswordSchema>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onEmailSubmit = async (data: UpdateEmailSchema) => {
        setIsLoadingEmail(true);
        try {
            const result = await updateUserEmail(data.email);
            if (result.success) {
                toast.success("Email updated successfully");
            } else {
                toast.error(result.error || "Failed to update email");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoadingEmail(false);
        }
    };

    const onUsernameSubmit = async (data: UpdateUsernameSchema) => {
        setIsLoadingUsername(true);
        try {
            const result = await updateUsername(data.username);
            if (result.success) {
                toast.success("Username updated successfully");
            } else {
                toast.error(result.error || "Failed to update username");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoadingUsername(false);
        }
    };

    const onPasswordSubmit = async (data: UpdatePasswordSchema) => {
        setIsLoadingPassword(true);
        try {
            const result = await updatePassword(data.currentPassword, data.newPassword, data.confirmPassword);
            if (result.success) {
                toast.success("Password updated successfully");
                passwordForm.reset();
            } else {
                toast.error(result.error || "Failed to update password");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoadingPassword(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Profile Info</TabsTrigger>
                    <TabsTrigger value="password">Change Password</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 mt-6">
                    {/* Email Form */}
                    <Card className="p-6">
                        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">Email Address</h3>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...emailForm.register("email")}
                                    placeholder="your@email.com"
                                />
                                {emailForm.formState.errors.email && (
                                    <p className="text-sm text-red-500">
                                        {emailForm.formState.errors.email.message}
                                    </p>
                                )}
                            </div>
                            <Button type="submit" disabled={isLoadingEmail}>
                                {isLoadingEmail ? "Updating..." : "Update Email"}
                            </Button>
                        </form>
                    </Card>

                    {/* Username Form */}
                    <Card className="p-6">
                        <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">Username</h3>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    {...usernameForm.register("username")}
                                    placeholder="username"
                                />
                                {usernameForm.formState.errors.username && (
                                    <p className="text-sm text-red-500">
                                        {usernameForm.formState.errors.username.message}
                                    </p>
                                )}
                            </div>
                            <Button type="submit" disabled={isLoadingUsername}>
                                {isLoadingUsername ? "Updating..." : "Update Username"}
                            </Button>
                        </form>
                    </Card>
                </TabsContent>

                <TabsContent value="password" className="mt-6">
                    <Card className="p-6">
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Lock className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">Change Password</h3>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    {...passwordForm.register("currentPassword")}
                                    placeholder="Enter current password"
                                />
                                {passwordForm.formState.errors.currentPassword && (
                                    <p className="text-sm text-red-500">
                                        {passwordForm.formState.errors.currentPassword.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    {...passwordForm.register("newPassword")}
                                    placeholder="Enter new password"
                                />
                                {passwordForm.formState.errors.newPassword && (
                                    <p className="text-sm text-red-500">
                                        {passwordForm.formState.errors.newPassword.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    {...passwordForm.register("confirmPassword")}
                                    placeholder="Confirm new password"
                                />
                                {passwordForm.formState.errors.confirmPassword && (
                                    <p className="text-sm text-red-500">
                                        {passwordForm.formState.errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                            <Button type="submit" disabled={isLoadingPassword}>
                                {isLoadingPassword ? "Updating..." : "Change Password"}
                            </Button>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
