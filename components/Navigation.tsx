"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/modal/LoginModal";
import { RegisterModal } from "@/components/modal/RegisterModal";
import { NotificationsDropdown } from "@/components/notification/NotificationsDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/ThemeToggle";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, logout, userDetails } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav
      className={`lunar-new-year:bg-red-700 bg-[#1e3c5f] text-white dark:bg-gray-800 ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Z&#39;Forum
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="lunar-new-year:hover:bg-red-800 text-white hover:bg-blue-700 hover:text-white dark:hover:bg-gray-700"
              >
                <Link href="/">Forums</Link>
              </Button>
              <Button
                variant="ghost"
                className="lunar-new-year:hover:bg-red-800 text-white hover:bg-blue-700 hover:text-white dark:hover:bg-gray-700"
              >
                <Link href="/latest">Latest</Link>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
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
                    <DropdownMenuItem asChild>
                      <Link href={`/user/${userDetails?.id}`}>
                        <User className="mr-2 size-4" />
                        <span>View Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/profile/edit`}>
                        <User className="mr-2 size-4" />
                        <span>Edit Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="lunar-new-year:hover:bg-red-800 border-white text-white hover:bg-blue-700 hover:text-white dark:hover:bg-gray-700"
                    onClick={() => setIsRegisterModalOpen(true)}
                  >
                    Đăng ký
                  </Button>
                  <Button
                    variant="ghost"
                    className="lunar-new-year:hover:bg-red-800 border-white text-white hover:bg-blue-700 hover:text-white dark:hover:bg-gray-700"
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
            className="lunar-new-year:hover:bg-red-800 mb-2 w-full text-white hover:bg-blue-700 hover:text-white dark:hover:bg-gray-700"
          >
            <Link href="/">Forums</Link>
          </Button>
          <Button
            variant="ghost"
            className="lunar-new-year:hover:bg-red-800 mb-2 w-full text-white hover:bg-blue-700 hover:text-white dark:hover:bg-gray-700"
          >
            <Link href="/latest">Latests</Link>
          </Button>
          <div className="mb-2 flex justify-center">
            <ThemeToggle />
          </div>
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
                className="lunar-new-year:hover:bg-red-800 w-full border-white text-white hover:bg-blue-700 hover:text-white dark:hover:bg-gray-700"
                asChild
              >
                <Link href={`/user/${userDetails?.id}`}>View Profile</Link>
              </Button>
              <Button
                variant="ghost"
                className="lunar-new-year:hover:bg-red-800 w-full border-white text-white hover:bg-blue-700 hover:text-white dark:hover:bg-gray-700"
                asChild
              >
                <Link href="/profile/edit">Edit Profile</Link>
              </Button>
              <Button
                variant="ghost"
                className="lunar-new-year:hover:bg-red-800 w-full border-white text-white hover:bg-blue-700 hover:text-white dark:hover:bg-gray-700"
                onClick={logout}
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="lunar-new-year:hover:bg-red-800 w-full border-white text-white hover:bg-blue-700 hover:text-white dark:hover:bg-gray-700"
                onClick={() => setIsRegisterModalOpen(true)}
              >
                Đăng ký
              </Button>
              <Button
                variant="ghost"
                className="lunar-new-year:hover:bg-red-800 w-full border-white text-white hover:bg-blue-700 hover:text-white dark:hover:bg-gray-700"
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
