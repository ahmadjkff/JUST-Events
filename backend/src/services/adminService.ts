import userModel from "../models/userModel";
import { Roles } from "../types/userTypes";

interface IResponse {
  statusCode: number;
  data: { message: string; user?: any };
}

export const editRole = async (
  email: string,
  newRole: Roles
): Promise<IResponse> => {
  if (!email || !newRole) {
    return {
      statusCode: 400,
      data: { message: "Email and newRole are required" },
    };
  }

  if (!Object.values(Roles).includes(newRole)) {
    return { statusCode: 400, data: { message: "Invalid role specified" } };
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return { statusCode: 404, data: { message: "User not found" } };
  }

  // Send to simulator
  const response = await fetch("http://localhost:5000/api/admin/edit-role", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newRole }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    return {
      statusCode: response.status,
      data: { message: `Error from simulator: ${errorText}` },
    };
  }

  user.role = newRole;
  await user.save();

  return {
    statusCode: 200,
    data: { message: "User role updated successfully", user },
  };
};
