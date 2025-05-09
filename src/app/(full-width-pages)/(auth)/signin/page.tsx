import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "japm.app SignIn Page",
  description: "This is japm.app Signin Page",
};

export default function SignIn() {
  return <SignInForm />;
}
