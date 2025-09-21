import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Input } from "../../../components/ui/input";
import type { User } from "../../../types/userTypes";
import { getAllUsers } from "../services/APIRequests";
import toast from "react-hot-toast";
import EditDialog from "../../../components/ui/EditDialog";
import Menu from "../../../components/ui/Menu";

function ManageRoles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { success, users, message } = await getAllUsers();
      if (success) setUsers(users);
      else {
        console.error("Failed to fetch users:", message);
        toast.error(message || "Failed to fetch users");
      }
    };
    fetchUsers();
    return () => setUsers([]);
  }, []);

  const itemsPerPage = 3;
  const paginate = (data: any[]) =>
    data
      .filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
      .slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const lastPage = Math.ceil(
    users.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ).length / itemsPerPage
  );

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>All Users</CardTitle>
          <Input
            placeholder="🔍 Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-60"
          />
        </CardHeader>
        <CardContent>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginate(users).map((user) => (
                <tr key={user._id}>
                  <td className="border p-2">{user._id}</td>
                  <td className="border p-2">{user.firstName}</td>
                  <td className="border p-2">{user.role}</td>
                  <td className="flex gap-5 border p-2 space-x-2">
                    <EditDialog<User>
                      title="Edit User"
                      description="Make changes to this user’s profile."
                      initialData={user}
                      fields={[
                        {
                          key: "firstName",
                          label: "First Name",
                          placeholder: "Enter first name",
                        },
                        {
                          key: "lastName",
                          label: "Last Name",
                          placeholder: "Enter last name",
                        },
                        {
                          key: "email",
                          label: "Email",
                          placeholder: "Enter email",
                          type: "email",
                        },
                      ]}
                      extraContent={
                        <label>
                          <span className="font-bold text-sm">Role</span>
                          <Menu
                            className="w-full"
                            title="Select Role"
                            items={["student", "supervisor", "admin"]}
                            selected={role || user.role}
                            setSelected={(role) => setRole(role)}
                            nullItem={false}
                          />
                        </label>
                      }
                      onSave={async (updatedUser) => {
                        // Exclude _id field from the update payload to avoid MongoDB error
                        const { _id, ...updateData } = updatedUser;

                        const response = await fetch(
                          `${import.meta.env.VITE_BASE_URL}/admin/${user._id}`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                            body: JSON.stringify({
                              ...updateData,
                              role: role || user.role,
                            }),
                          }
                        );
                        const data = await response.json();
                        if (response.ok) {
                          toast.success("User updated successfully");
                        } else {
                          toast.error(data.message || "Failed to update user");
                        }
                      }}
                    />

                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex justify-end mt-4 space-x-2">
            <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Prev
            </Button>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page === lastPage}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ManageRoles;
