import Header from "@/components/basic/header";
import { SignInForm } from "@/components/form/auth/login/sign-in-form";
import BaseAuthLayout from "@/components/layout/base-auth-layout";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  const session = getServerSession();

  return (
    <>
      <Header />
      <BaseAuthLayout
        title="Sign In"
        subtitle="Enter your email and password to sign in"
        form={<SignInForm />}
      ></BaseAuthLayout>
    </>
  );
}
