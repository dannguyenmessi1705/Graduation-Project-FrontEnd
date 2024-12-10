"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <Button
      onClick={() => signIn("keycloak")}
      variant="ghost"
      className="border-white text-white hover:bg-blue-700 hover:text-white"
    >
      Đăng nhập
    </Button>
  );
}
