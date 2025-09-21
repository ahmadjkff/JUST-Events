import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
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
          .includes(searchQuery.toLowerCase()),
      )
      .slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const lastPage = Math.ceil(
    users.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    ).length / itemsPerPage,
  );

  return (
    <div className="flex flex-col space-y-6 p-6">
      <header className="bg-card border-border flex items-center justify-between border-b p-4">
        <div>
          <h1 className="text-foreground text-2xl font-bold">All Users</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
        <Input
          placeholder="🔍 Search users"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-60"
        />
      </header>

      <main>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginate(users).map((user: User) => (
              <tr key={user._id}>
                <td className="border p-2">{user.universityId}</td>
                <td className="border p-2">{user.firstName}</td>
                <td className="border p-2">{user.role}</td>
                <td className="flex gap-5 space-x-2 border p-2">
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
                        <span className="text-sm font-bold">Role</span>
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
                        },
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
        <div className="mt-4 flex justify-end space-x-2">
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
      </main>
    </div>
  );
}

export default ManageRoles;
