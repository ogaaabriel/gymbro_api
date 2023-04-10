export interface UserLogin {
  email: string;
  password: string;
}

export interface UserSignup extends UserLogin {
  firstName: string;
  lastName: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  profilePicturePath: string | null;
  isAdmin: boolean;
}
