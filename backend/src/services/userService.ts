import IResponseStructure from "./../types/responseStructure";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";

export const login = async (
  email: string,
  password: string
): Promise<IResponseStructure> => {
  try {
    // Call the simulator API to validate credentials
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        success: false,
        message: `Auth service failed`,
      };
    }

    const data = await response.json();

    if (data.status === "error") {
      return {
        statusCode: 400,
        success: false,
        message: data.message,
      };
    }

    // Find user in local DB
    let user = await userModel.findOne({ email });

    // create/update user in local DB
    if (user) {
      user.firstName = data.user.firstName;
      user.lastName = data.user.lastName;
      user.role = data.user.role;
      user.faculty = data.user.faculty;
      await user.save();
    } else {
      user = await userModel.create({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email,
        role: data.user.role,
        faculty: data.user.faculty,
      });
    }

    const token = generateJWT({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      faculty: user.faculty,
    });

    return {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: {
        token: token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          faculty: user.faculty,
        },
      },
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      success: false,
      message: `Server error: ${error.message}`,
    };
  }
};

const generateJWT = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "1d" });
};
