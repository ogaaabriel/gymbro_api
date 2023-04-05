import bcrypt from "bcrypt";
import { UserSignup } from "../types/user";

import db from "../utils/db";
import { hashPassword } from "../utils/hash";

const findUserByEmail = (email: string) => {
  return db.user.findUnique({ where: { email } });
};

const findUserById = (id: number) => {
  return db.user.findUnique({ where: { id } });
};

const createUser = (newUser: UserSignup) => {
  return db.user.create({
    data: { ...newUser, password: hashPassword(newUser.password) },
  });
};

const checkUserPassword = (inputPassword: string, userPassword: string) => {
  return bcrypt.compare(inputPassword, userPassword);
};

const changePassword = (password: string, userId: number) => {
  return db.user.update({
    where: { id: userId },
    data: { password: hashPassword(password) },
  });
};

export {
  findUserByEmail,
  findUserById,
  createUser,
  checkUserPassword,
  changePassword,
};
