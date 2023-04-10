import bcrypt from "bcrypt";
import { UserSignup } from "../types/user";

import db from "../utils/db";
import { hashPassword } from "../utils/hash";

export const findUserByEmail = (email: string) => {
  return db.user.findUnique({ where: { email } });
};

export const findUserById = (id: number) => {
  return db.user.findUnique({ where: { id } });
};

export const createUser = (newUser: UserSignup) => {
  return db.user.create({
    data: { ...newUser, password: hashPassword(newUser.password) },
  });
};

export const checkUserPassword = (
  inputPassword: string,
  userPassword: string
) => {
  return bcrypt.compare(inputPassword, userPassword);
};

export const changePassword = (password: string, userId: number) => {
  return db.user.update({
    where: { id: userId },
    data: { password: hashPassword(password) },
  });
};
