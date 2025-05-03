import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JAPM SignUp Page",
  description: "This is NextJAPM SignUp Page",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
