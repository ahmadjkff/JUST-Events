import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Roles } from "../types/userTypes";
import userModel from "../models/userModel";

interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterParams) => {
  const findUser = await userModel.findOne({ email: email });

  if (findUser) {
    return { data: "User already exists", statusCode: 400 };
  }

  let assignedRole: Roles.ADMIN | Roles.STUDENT;

  if (email.endsWith("@cit.just.edu.jo")) {
    assignedRole = Roles.STUDENT;
  } else if (email.endsWith("@just.edu.jo")) {
    assignedRole = Roles.ADMIN;
  } else {
    return {
      data: "Invalid email domain. Registration not allowed.",
      statusCode: 400,
    };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: assignedRole,
  });

  await newUser.save();
  return { data: generateJWT({ firstName, lastName, email }), statusCode: 200 };
};

interface LoginParams {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginParams) => {
  const findUser = await userModel.findOne({ email });

  if (!findUser) {
    return { data: "Incorrect email or password", statusCode: 400 };
  }

  const passwordMatch = await bcrypt.compare(password, findUser.password);

  if (!passwordMatch) {
    return { data: "Wrong Password", statusCode: 400 };
  }

  return {
    data: generateJWT({
      email,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      role: findUser.role,
    }),
    statusCode: 200,
  };
};

interface CreateAdminParams {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
}

export const createAdmin = async ({
  firstName,
  lastName,
  email,
  role = Roles.ADMIN,
  password,
}: CreateAdminParams) => {
  const findUser = await userModel.findOne({ email }); // same as email : params.email
  if (findUser) return { data: "User already exists!", statusCode: 400 };
  const newAdmin = new userModel({
    firstName,
    lastName,
    email,
    role,
    password,
  });
  await newAdmin.save();
  return {
    statusCode: 200,
    data: {
      token: generateJWT({ firstName, lastName, email, role }),
      message: "Admin created successfully",
    },
  };
};

const generateJWT = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "7d" });
};
