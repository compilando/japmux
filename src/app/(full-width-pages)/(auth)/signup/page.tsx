import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "japm.app SignUp Page",
  description: "This is Nextjapm.app SignUp Page",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
