"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoginModal } from "@/components/modal/LoginModal";
import { RegisterModal } from "@/components/modal/RegisterModal";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Navigation() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  return (
    <nav className="bg-[#1e3c5f] p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
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
          <div className="flex gap-2">
            {isLoggedIn ? (
              <Button
                variant="ghost"
                className="border-white text-white hover:bg-blue-700 hover:text-white"
                onClick={logout}
              >
                Đăng xuất
              </Button>
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
      {isMobileMenuOpen && (
        <div className="mt-4 md:hidden">
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
            <Button
              variant="ghost"
              className="w-full border-white text-white hover:bg-blue-700 hover:text-white"
              onClick={logout}
            >
              Đăng xuất
            </Button>
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
