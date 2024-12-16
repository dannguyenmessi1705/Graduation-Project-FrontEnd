import { ResponseStatus } from "@/model/ResponseStatus";

export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  birthDay: string;
  country: string;
  phoneNumber: string;
  gender: string;
  city: string;
  postalCode: string;
  picture: string;
  verified: boolean;
}

export interface UserResponse {
  status: ResponseStatus;
  data: UserDetails;
}
