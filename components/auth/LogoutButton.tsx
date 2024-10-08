"use client";
import { useKeycloak } from "@/auth/provider/KeycloakProvider";
import { useEffect, useState, useRef } from "react";

const LogoutButton = () => {
  const { logout, user } = useKeycloak();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left">
      <button onClick={toggleDropdown} className="button">
        {user?.username?.charAt(0).toUpperCase() || "U"}
      </button>
      {showDropdown && (
        <div ref={dropdownRef} className="dropdown">
          <div className="dropdown-content">
            <p>{user?.username || "Unknown User"}</p>
            <p>{user?.email || "Unknown User"}</p>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoutButton;
