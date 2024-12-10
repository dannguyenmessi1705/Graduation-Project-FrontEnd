"use client";
import federatedLogout from "@/utils/federatedLogout";
import { Button } from "@/components/ui/button";

export default function Logout() {
  return (
    <Button
      onClick={() => federatedLogout()}
      variant="ghost"
      className="border-white text-white hover:bg-blue-700 hover:text-white"
    >
      Đăng xuất
    </Button>
  );
}
