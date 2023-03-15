interface UserLogin {
  email: string;
  password: string;
}

interface UserSignup extends UserLogin {
  firstName: string;
  lastName: string;
}

interface User extends UserSignup {
  id: number;
}

export { UserLogin, UserSignup, User };
