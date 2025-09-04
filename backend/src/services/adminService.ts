import userModel from "../models/userModel";
import { Roles } from "../types/userTypes";

export const editRole = async (userId: string, newRole: Roles) => {
  const user = await userModel.findById(userId);
  if (!user) {
    return { statusCode: 404, data: { message: "User not found" } };
  }

  // Send to simulator
  const response = await fetch("http://localhost:5000/api/admin/edit-role", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, newRole }),
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
