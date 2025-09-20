import { TextField, Dialog as Dialog2, Button, Text } from "@radix-ui/themes";
import type { User } from "../../types/userTypes";
import Menu from "./Menu";
import { useState } from "react";
import toast from "react-hot-toast";

function Dialog({ user }: { user: User }) {
  const [form, setForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: string | null;
  }>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  });

  const LABELES = [
    {
      key: "firstName",
      label: "First Name",
      defaultValue: user.firstName,
      placeholder: "Enter first name",
    },
    {
      key: "lastName",
      label: "Last Name",
      defaultValue: user.lastName,
      placeholder: "Enter last name",
    },
    {
      key: "email",
      label: "Email",
      defaultValue: user.email,
      placeholder: "Enter email",
    },
  ];

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (isSave: boolean) => {
    if (!isSave) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/admin/edit-role/${user._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ newRole: form.role }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      toast.success("User role updated successfully");
    } else {
      toast.error(data.message || "Failed to update user role");
    }
  };

  console.log(form);

  return (
    <Dialog2.Root>
      <Dialog2.Trigger>
        <Button variant="outline">Edit</Button>
      </Dialog2.Trigger>

      <Dialog2.Content
        maxWidth="450px"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "fixed",
          animation: "fadeIn 0.3s ease",
        }}
      >
        <Dialog2.Title>Edit User</Dialog2.Title>
        <Dialog2.Description size="2" mb="4">
          Make changes to this user’s profile.
        </Dialog2.Description>

        <div className="grid gap-2 grid-rows-5">
          {LABELES.map(({ label, defaultValue, placeholder, key }) => (
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                {label}
              </Text>
              <TextField.Root
                defaultValue={defaultValue}
                placeholder={placeholder}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </label>
          ))}
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Role
            </Text>
            <Menu
              className="w-full"
              title="Select Role"
              items={["student", "supervisor", "admin"]}
              selected={form.role || user.role}
              setSelected={(role) => setForm((prev) => ({ ...prev, role }))}
              nullItem={false}
            />
          </label>
        </div>

        <div className="flex gap-3 mt-4 justify-end">
          <Dialog2.Close>
            <Button
              variant="soft"
              color="gray"
              onClick={() => handleSave(false)}
            >
              Cancel
            </Button>
          </Dialog2.Close>
          <Dialog2.Close>
            <Button onClick={() => handleSave(true)}>Save</Button>
          </Dialog2.Close>
        </div>
      </Dialog2.Content>
    </Dialog2.Root>
  );
}

export default Dialog;
