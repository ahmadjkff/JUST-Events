import jwt from "jsonwebtoken";
import userModel from "../../models/userModel";
import AppError from "../../types/AppError";

export const login = async (email: string, password: string) => {
  const response = await fetch(
    "https://just-events-2.onrender.com/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  const contentType = response.headers.get("content-type");

  // If it's not JSON, log the raw text so you can debug
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new AppError(
      `Expected JSON but got: ${text.substring(0, 100)}...`,
      response.status
    );
  }

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = await response.json();
    throw new AppError(`${errorMessage.message}`, 401);
  }

  if (data.status === "error") {
    throw new AppError(data.message, 401);
  }

  // Find user in local DB
  let user = await userModel.findOne({ email });

  // create/update user in local DB
  if (user) {
    user.firstName = data.user.firstName;
    user.lastName = data.user.lastName;
    user.role = data.user.role;
    user.faculty = data.user.faculty;
    user.universityId = data.user.universityId;
    await user.save();
  } else {
    user = await userModel.create({
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      email,
      role: data.user.role,
      faculty: data.user.faculty,
      universityId: data.user.universityId,
    });
  }

  const token = generateJWT({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    faculty: user.faculty,
    universityId: user.universityId,
  });

  return {
    token: token,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      faculty: user.faculty,
      universityId: user.universityId,
    },
  };
};

const generateJWT = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "1d" });
};
