import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JAPM SignIn Page",
  description: "This is JAPM Signin Page",
};

export default function SignIn() {
  return <SignInForm />;
}
