import { getServerSession } from "next-auth";
import { authOptions } from "@/app//api/auth/[...nextauth]/route";
import Logout from "@/components/Logout";
import Login from "@/components/Login";
import { Button } from "@/components/ui/button";

export default async function AuthButton() {
  const session = await getServerSession(authOptions);
  if (session) {
    return (
      <div className="flex gap-2">
        <Logout />
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        className="border-white text-white hover:bg-blue-700 hover:text-white"
      >
        Đăng ký
      </Button>
      <Login />
    </div>
  );
}
