"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/modal/LoginModal";
import { RegisterModal } from "@/components/modal/RegisterModal";
import { NotificationsDropdown } from "@/components/notification/NotificationsDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, Home, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/ThemeToggle";
import { motion } from "framer-motion";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, logout, userDetails } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`lunar-new-year:bg-red-700 fixed inset-x-0 top-0 z-50 text-white transition-all duration-300 dark:bg-gray-800 ${
        isScrolled
          ? "bg-background/70 shadow-md backdrop-blur-md"
          : "bg-transparent"
      } ${className}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-primary transition-colors duration-200 hover:text-primary/80"
          >
            Z&#39;Forum
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="lunar-new-year:hover:bg-red-800 text-foreground hover:bg-primary/10 hover:text-primary dark:hover:bg-gray-700"
              >
                <Home className="mr-2 size-4" />
                <Link href="/">Forums</Link>
              </Button>
              <Button
                variant="ghost"
                className="lunar-new-year:hover:bg-red-800 text-foreground hover:bg-primary/10 hover:text-primary dark:hover:bg-gray-700"
              >
                <Clock className="mr-2 size-4" />
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
                    variant="outline"
                    className="lunar-new-year:hover:bg-red-800 border-primary text-foreground hover:bg-primary hover:text-primary-foreground dark:hover:bg-gray-700"
                    onClick={() => setIsRegisterModalOpen(true)}
                  >
                    Đăng ký
                  </Button>
                  <Button
                    variant="ghost"
                    className="lunar-new-year:hover:bg-red-800 border-primary text-foreground hover:bg-primary hover:text-primary-foreground dark:hover:bg-gray-700"
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
        <motion.div
          className="container mx-auto px-4 pb-4 sm:px-6 md:hidden lg:px-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            className="lunar-new-year:hover:bg-red-800 mb-2 w-full text-foreground hover:bg-primary/10 hover:text-primary dark:hover:bg-gray-700"
          >
            <Home className="mr-2 size-4" />
            <Link href="/">Forums</Link>
          </Button>
          <Button
            variant="ghost"
            className="lunar-new-year:hover:bg-red-800 mb-2 w-full text-foreground hover:bg-primary/10 hover:text-primary dark:hover:bg-gray-700"
          >
            <Clock className="mr-2 size-4" />
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
                <span className="font-medium text-foreground">
                  {userDetails?.username}
                </span>
              </div>
              <Button
                variant="outline"
                className="lunar-new-year:hover:bg-red-800 mb-2 w-full border-primary text-foreground hover:bg-primary hover:text-primary-foreground dark:hover:bg-gray-700"
                asChild
              >
                <Link href={`/user/${userDetails?.id}`}>View Profile</Link>
              </Button>
              <Button
                variant="outline"
                className="lunar-new-year:hover:bg-red-800 mb-2 w-full border-primary text-foreground hover:bg-primary hover:text-primary-foreground dark:hover:bg-gray-700"
                asChild
              >
                <Link href="/profile/edit">Edit Profile</Link>
              </Button>
              <Button
                variant="outline"
                className="lunar-new-year:hover:bg-red-800 w-full border-primary text-foreground hover:bg-primary hover:text-primary-foreground dark:hover:bg-gray-700"
                onClick={logout}
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="lunar-new-year:hover:bg-red-800 mb-2 w-full border-primary text-foreground hover:bg-primary hover:text-primary-foreground dark:hover:bg-gray-700"
                onClick={() => setIsRegisterModalOpen(true)}
              >
                Đăng ký
              </Button>
              <Button
                variant="outline"
                className="lunar-new-year:hover:bg-red-800 w-full border-primary text-foreground hover:bg-primary hover:text-primary-foreground dark:hover:bg-gray-700"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Đăng nhập
              </Button>
            </>
          )}
        </motion.div>
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </motion.nav>
  );
}
