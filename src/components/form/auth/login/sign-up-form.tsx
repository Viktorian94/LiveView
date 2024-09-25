"use client";

import * as React from "react";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

import { auth, firestore } from "@/lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const signUpSchema = z
  .object({
    email: z.string().email("Enter correct email"),
    nickname: z.string().min(1, "Nickname is required"),
    password: z.string().min(6, "Minimum six symbols"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password don`t match",
    path: ["passwordConfirm"],
  });

export function SignUpForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      nickname: "",
      passwordConfirm: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(data: any) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await setDoc(doc(firestore, "users", userCredential.user.uid), {
        nickname: data.nickname,
        email: data.email,
        createAt: serverTimestamp(),
      });

      router.push("/");
    } catch (error) {
      console.error("Error while registration", error);
      alert("Error while registration");
    }
    setIsLoading(false);
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);

      const userRef = doc(firestore, "users", userCredential.user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          nickname: userCredential.user.displayName || "No nickname",
          email: userCredential.user.email,
          createAt: serverTimestamp(),
        });
      }

      router.push("/");
    } catch (error) {
      console.error("Problem while sign in with google", error);
      alert("Something went wrong");
    }
    setIsLoading(false);
  };

  return (
    <div className={cn("mt-5 grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid gap-6">
        <div className="grid gap-2">
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="nickname">Nickname</label>
            <input
              id="nickname"
              type="text"
              placeholder="Nickname"
              autoComplete="nickname"
              {...register("nickname")}
            />
            {errors.nickname && (
              <p className="text-red-500">{errors.nickname.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="passwordConfirm">Confirm password</label>
            <input
              id="passwordConfirm"
              type="password"
              placeholder="Confirm password"
              autoComplete="new-password"
              {...register("passwordConfirm")}
            />
            {errors.passwordConfirm && (
              <p className="text-red-500">{errors.passwordConfirm.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {isLoading ? "Loading..." : "Sign Up"}
          </button>
          <span>
            <p className="text-center text-base">ИЛИ</p>
          </span>
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full rounded bg-white px-4 py-2 text-black hover:bg-slate-400"
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="m-auto size-5 animate-spin" />
            ) : (
              "Sign Up with Google"
            )}
          </button>

          <p className="px-8 pt-3 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="underline hover:text-gray-600" href="/sign-in">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
