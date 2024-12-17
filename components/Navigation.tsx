"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/modal/LoginModal";
import { RegisterModal } from "@/components/modal/RegisterModal";
import { NotificationsDropdown } from "@/components/notification/NotificationsDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navigation() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, logout, userDetails } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="bg-[#1e3c5f] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Z&#39;Forum
          </Link>
          <div className="hidden items-center gap-6 md:flex">
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
            <div className="flex items-center gap-2">
              {isLoggedIn && <NotificationsDropdown />}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative size-8 rounded-full"
                    >
                      <Avatar className="size-8">
                        <AvatarImage
                          src={userDetails?.picture}
                          alt={userDetails?.username}
                        />
                        <AvatarFallback>
                          {userDetails?.firstName?.[0]?.toUpperCase() ||
                            userDetails?.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem className="flex flex-col items-start">
                      <div className="font-medium">{userDetails?.username}</div>
                      <div className="text-xs text-muted-foreground">
                        {userDetails?.email}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="border-white text-white hover:bg-blue-700 hover:text-white"
                    onClick={() => setIsRegisterModalOpen(true)}
                  >
                    Đăng ký
                  </Button>
                  <Button
                    variant="ghost"
                    className="border-white text-white hover:bg-blue-700 hover:text-white"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    Đăng nhập
                  </Button>
                </>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="container mx-auto px-4 pb-4 sm:px-6 md:hidden lg:px-8">
          <Button
            variant="ghost"
            className="mb-2 w-full text-white hover:bg-blue-700 hover:text-white"
          >
            Forums
          </Button>
          <Button
            variant="ghost"
            className="mb-2 w-full text-white hover:bg-blue-700 hover:text-white"
          >
            Latests
          </Button>
          {isLoggedIn ? (
            <>
              <div className="mb-2 flex justify-center">
                <NotificationsDropdown />
              </div>
              <div className="mb-2 flex items-center justify-center gap-2">
                <Avatar className="size-8">
                  <AvatarImage
                    src={userDetails?.picture}
                    alt={userDetails?.username}
                  />
                  <AvatarFallback>
                    {userDetails?.firstName?.[0]?.toUpperCase() ||
                      userDetails?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{userDetails?.username}</span>
              </div>
              <Button
                variant="ghost"
                className="w-full border-white text-white hover:bg-blue-700 hover:text-white"
                onClick={logout}
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="mb-2 w-full border-white text-white hover:bg-blue-700 hover:text-white"
                onClick={() => setIsRegisterModalOpen(true)}
              >
                Đăng ký
              </Button>
              <Button
                variant="ghost"
                className="w-full border-white text-white hover:bg-blue-700 hover:text-white"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Đăng nhập
              </Button>
            </>
          )}
        </div>
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </nav>
  );
}
