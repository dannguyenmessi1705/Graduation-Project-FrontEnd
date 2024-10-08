"use client";
import withAuth from "@/auth/middleware/withAuth";
import LogoutButton from "@/components/auth/LogoutButton";
const Page = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <LogoutButton />
    </div>
  );
};
export default Page;
