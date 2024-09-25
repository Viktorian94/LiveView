"use client";

import * as React from "react";

import { Icons } from "@/components/icons";

import { auth } from "@/lib/firebaseConfig";
import { cn } from "@/lib/utils";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignInForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: any) {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/");
    } catch (error) {
      console.error("Problem while sign in", error);
      alert("Incorrect email or password");
    }
    setIsLoading(false);
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      console.error("Problem while sign in with google", error);
      alert("Something went wrong");
    }
    setIsLoading(false);
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              {...register("email", { required: true })}
            />
            {errors.email && <p className="text-red-500">Email is required</p>}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-red-500">Password is required</p>
            )}
          </div>
          <button disabled={isLoading} type="submit">
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Sign In with Email
          </button>
          <button
            onClick={handleGoogleSignIn}
            className="w-full rounded bg-white px-4 py-2 text-black hover:bg-slate-300"
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Sign In with Google
          </button>

          <p className="px-8 pt-3 text-center text-sm text-muted-foreground">
            Don`t have an account?{" "}
            <Link className="underline hover:text-gray-600" href="/sign-up">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
