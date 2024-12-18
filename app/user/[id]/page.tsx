"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserDetails } from "@/lib/api";
import { UserDetails } from "@/model/UserData";

export default function Page() {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserDetails(id as string);
        setUserDetails(profile.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (!userDetails) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="flex flex-col items-center gap-4 sm:flex-row">
          <Avatar className="size-24">
            <AvatarImage src={userDetails.picture} alt={userDetails.username} />
            <AvatarFallback>
              {userDetails.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl">{userDetails.username}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-medium">Full Name</dt>
              <dd>
                {userDetails.firstName} {userDetails.lastName}
              </dd>
            </div>
            <div>
              <dt className="font-medium">Email</dt>
              <dd>{userDetails.email}</dd>
            </div>
            <div>
              <dt className="font-medium">Gender</dt>
              <dd>{userDetails.gender}</dd>
            </div>
            <div>
              <dt className="font-medium">Birthday</dt>
              <dd>{new Date(userDetails.birthDay).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="font-medium">Country</dt>
              <dd>{userDetails.country}</dd>
            </div>
            <div>
              <dt className="font-medium">City</dt>
              <dd>{userDetails.city}</dd>
            </div>
            <div>
              <dt className="font-medium">Phone Number</dt>
              <dd>{userDetails.phoneNumber}</dd>
            </div>
            <div>
              <dt className="font-medium">Postal Code</dt>
              <dd>{userDetails.postalCode}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
