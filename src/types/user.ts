interface UserLogin {
  email: string;
  password: string;
}

interface UserSignup extends UserLogin {
  firstName: string;
  lastName: string;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  profilePicturePath: string | null;
  isAdmin: boolean;
}

export { UserLogin, UserSignup, User };
