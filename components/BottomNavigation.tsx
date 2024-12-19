"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BottomNavProps {
  className?: string;
}

const MAX_RECENT_ROUTES = 5;

export function BottomNavigation({ className }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [recentRoutes, setRecentRoutes] = useState<string[]>([]);

  useEffect(() => {
    if (pathname) {
      setRecentRoutes((prevRoutes) => {
        const newRoutes = [
          pathname,
          ...prevRoutes.filter((route) => route !== pathname),
        ];
        return newRoutes.slice(0, MAX_RECENT_ROUTES);
      });
    }
  }, [pathname]);

  const handleBack = () => {
    router.back();
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <nav
      className={`lunar-new-year:hover:bg-red-800 border-t border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      <div className="flex items-center justify-evenly">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="lg">
              <Menu className="size-6" />
              <span className="sr-only">Recent routes</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {recentRoutes.map((route, index) => (
              <DropdownMenuItem key={index} onClick={() => router.push(route)}>
                {route}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="lg" onClick={handleHome}>
          <Home className="size-6" />
          <span className="sr-only">Home</span>
        </Button>

        <Button variant="ghost" size="lg" onClick={handleBack}>
          <ArrowLeft className="size-6" />
          <span className="sr-only">Back</span>
        </Button>
      </div>
    </nav>
  );
}
