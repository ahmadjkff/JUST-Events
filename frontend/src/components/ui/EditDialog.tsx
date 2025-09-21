import { TextField, Dialog as RadixDialog, Text } from "@radix-ui/themes";
import { useState } from "react";
import { Button } from "./Button";

export type FieldConfig<T> = {
  key: keyof T;
  label: string;
  placeholder?: string;
  type?:
    | "date"
    | "datetime-local"
    | "email"
    | "hidden"
    | "month"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
};

type EditDialogProps<T> = {
  title: string;
  description?: string;
  initialData: T;
  fields: FieldConfig<T>[];
  extraContent?: React.ReactNode; // e.g. dropdowns
  onSave: (values: T) => Promise<void> | void;
  triggerLabel?: string;
};

function EditDialog<T extends Record<string, any>>({
  title,
  description,
  initialData,
  fields,
  extraContent,
  onSave,
  triggerLabel = "Edit",
}: EditDialogProps<T>) {
  const [form, setForm] = useState<T>(initialData);

  const handleChange = (key: keyof T, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (isSave: boolean) => {
    if (!isSave) {
      setForm(initialData); // reset
      return;
    }

    await onSave(form);
  };

  return (
    <RadixDialog.Root>
      <RadixDialog.Trigger>
        <Button size="sm" variant="outline" className="border border-black">
          {triggerLabel}
        </Button>
      </RadixDialog.Trigger>

      <RadixDialog.Content
        maxWidth="450px"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "fixed",
          animation: "fadeIn 0.3s ease",
        }}
      >
        <RadixDialog.Title>{title}</RadixDialog.Title>
        {description && (
          <RadixDialog.Description size="2" mb="4">
            {description}
          </RadixDialog.Description>
        )}

        <div className="grid gap-2">
          {fields.map(({ key, label, placeholder, type }) => (
            <label key={String(key)}>
              <Text as="div" size="2" mb="1" weight="bold">
                {label}
              </Text>
              <TextField.Root
                type={type || "text"}
                value={form[key] as string}
                placeholder={placeholder}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </label>
          ))}
          {extraContent}
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <RadixDialog.Close>
            <Button
              variant="destructive"
              color="gray"
              onClick={() => handleSave(false)}
            >
              Cancel
            </Button>
          </RadixDialog.Close>
          <RadixDialog.Close>
            <Button onClick={() => handleSave(true)}>Save</Button>
          </RadixDialog.Close>
        </div>
      </RadixDialog.Content>
    </RadixDialog.Root>
  );
}

export default EditDialog;
