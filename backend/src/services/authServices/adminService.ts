import userModel from "../../models/userModel";
import IResponseStructure from "../../types/responseStructure";
import { Roles } from "../../types/userTypes";

export const editRole = async (
  userId: string,
  newRole: Roles
): Promise<IResponseStructure> => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return { statusCode: 404, success: false, message: "User not found" };
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
        success: false,
        message: `Error from simulator: ${errorText}`,
      };
    }

    user.role = newRole;
    await user.save();

    return {
      statusCode: 200,
      success: true,
      message: "User role updated successfully",
      data: { user },
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      success: false,
      message: `Server error ${error.message}`,
    };
  }
};
