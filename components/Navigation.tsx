import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/AuthButton";

export function Navigation() {
  return (
    <nav className="bg-[#1e3c5f] p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold">
            Z&#39;Forum
          </Link>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-blue-700 hover:text-white"
            >
              Forums
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-blue-700 hover:text-white"
            >
              Latests
            </Button>
          </div>
        </div>
        <AuthButton />
      </div>
    </nav>
  );
}
