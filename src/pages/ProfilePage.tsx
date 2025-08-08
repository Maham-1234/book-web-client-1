import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "@/contexts/authContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ProfileFormValues = {
  firstName: string;
  lastName: string;
};

export default function ProfilePage() {
  const {
    user,
    isLoading: isAuthLoading,
    error: authError,
    updateProfile,
    uploadAvatar,
    clearError,
  } = useAuth();

  const avatarFileRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>();

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  }, [user, reset]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const onProfileUpdate: SubmitHandler<ProfileFormValues> = async (data) => {
    clearError();
    setSuccessMessage(null);
    try {
      await updateProfile(data);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
      reset({}, { keepValues: true });
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      clearError();
      setSuccessMessage(null);
      try {
        await uploadAvatar(file);
        setSuccessMessage("Avatar updated successfully!");
        setTimeout(() => setSuccessMessage(null), 4000);
      } catch (err) {
        console.error("Avatar upload failed:", err);
      }
    }
  };

  if (isAuthLoading && !user) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto text-center py-20">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            Please log in to view your profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground mb-8">
          Manage your profile information and account settings.
        </p>

        {/* --- Global Alerts --- */}
        {authError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>An Error Occurred</AlertTitle>
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert
            variant="default"
            className="mb-6 bg-green-100 border-green-400 text-green-800"
          >
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Left Column: Avatar --- */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="w-40 h-40 border-4 border-background shadow-md">
                  <AvatarImage
                    src={`http://localhost:3000/uploads/avatars/${user.avatar}`}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <AvatarFallback className="text-4xl bg-muted">
                    {user.firstName?.[0] ?? ""}
                    {user.lastName?.[0] ?? ""}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={avatarFileRef}
                  onChange={handleAvatarUpload}
                  className="hidden"
                  accept="image/png, image/jpeg"
                />
                <Button
                  onClick={() => avatarFileRef.current?.click()}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Change Avatar
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* --- Right Column: Forms --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* --- Personal Info Form --- */}
            <form onSubmit={handleSubmit(onProfileUpdate)}>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your first and last name here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register("firstName", {
                          required: "First name is required",
                        })}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register("lastName", {
                          required: "Last name is required",
                        })}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="cursor-not-allowed"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting || !isDirty}>
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </form>

            {/* --- Change Password Form --- */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  This functionality is not yet available.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 opacity-50 cursor-not-allowed">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" disabled />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button disabled>Update Password</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
