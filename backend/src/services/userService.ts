import jwt from "jsonwebtoken";
import { Roles } from "../types/userTypes";
import userModel from "../models/userModel";

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
