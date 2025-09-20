import { Flex, TextField, Dialog, Button, Text } from "@radix-ui/themes";
import type { User } from "../../types/userTypes";
import Menu from "./Menu";
import { useState } from "react";

function DialogComponent({ user }: { user: User }) {
  const [role, setRole] = useState<string | null>(user.role);
  const LABELES = [
    {
      label: "First Name",
      defaultValue: user.firstName,
      placeholder: "Enter first name",
    },
    {
      label: "Last Name",
      defaultValue: user.lastName,
      placeholder: "Enter last name",
    },
    {
      label: "Email",
      defaultValue: user.email,
      placeholder: "Enter email",
    },
  ];

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="outline">Edit</Button>
      </Dialog.Trigger>

      <Dialog.Content
        maxWidth="450px"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "fixed",
          animation: "fadeIn 0.3s ease",
        }}
      >
        <Dialog.Title>Edit User</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Make changes to this user’s profile.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          {LABELES.map(({ label, defaultValue, placeholder }) => (
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                {label}
              </Text>
              <TextField.Root
                defaultValue={defaultValue}
                placeholder={placeholder}
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
              items={["user", "admin", "supervisor"]}
              selected={role || "user"}
              setSelected={setRole}
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default DialogComponent;
