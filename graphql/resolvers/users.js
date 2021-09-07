import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserInputError } from "apollo-server";

import User from "./../../models/User.js";

import { validateRegistrationInput, validateLoginInput } from "./../../utils/validators.js";

const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      userLogin: user.userLogin,
    },
    process.env.SECRET_TOKEN,
    { expiresIn: "1h" }
  );

export const userResolvers = {
  async login(_, { userLogin, password }) {
    const { errors, valid } = validateLoginInput(userLogin, password);

    if (!valid) throw new UserInputError("Errors", { errors });

    const user = await User.findOne({ userLogin });
    if (!user) {
      errors.general = "Пользователь не найден.";
      throw new UserInputError("Пользователь не найден.", { errors });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      errors.general = "Ошибка авторизации.";
      throw new UserInputError("Ошибка авторизации.", { errors });
    }

    const token = generateToken(user);

    return {
      ...user._doc,
      id: user._id,
      token,
    };
  },

  async registration(_, { registrationInput: { userLogin, password, confirmPassword } }) {
    const { valid, errors } = validateRegistrationInput(userLogin, password, confirmPassword);

    if (!valid) throw new UserInputError("Errors", { errors });

    const user = await User.findOne({ userLogin });
    if (user) {
      throw new UserInputError("Этот логин уже занят.", {
        errors: {
          userLogin: "Этот логин уже занят.",
        },
      });
    }

    password = await bcrypt.hash(password, 12);

    const newUser = new User({
      userLogin,
      password,
      createdAt: new Date().toISOString(),
    });

    const res = await newUser.save();

    const token = generateToken(res);

    return {
      ...res._doc,
      id: res._id,
      token,
    };
  },
};
