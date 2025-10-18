import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/input";
import type { User } from "../../../types/userTypes";
import { getAllUsers } from "../services/APIRequests";
import toast from "react-hot-toast";
import EditDialog from "../../../components/ui/EditDialog";
import Menu from "../../../components/ui/Menu";
import { useTranslation } from "react-i18next";

function ManageRoles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    const fetchUsers = async () => {
      const { success, users, message } = await getAllUsers();
      if (success) setUsers(users);
      else {
        console.error("Failed to fetch users:", message);
        toast.error(message || t("manageRoles.fetchError"));
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
    <div
      className={`flex flex-col space-y-6 p-6 ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      {/* ===== Header ===== */}
      <header className="bg-card border-border flex items-center justify-between border-b p-4">
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-foreground text-2xl font-bold">
            {t("manageRoles.title")}
          </h1>
          <p className="text-muted-foreground">{t("manageRoles.subtitle")}</p>
        </div>
        <Input
          placeholder={t("manageRoles.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-60"
        />
      </header>

      {/* ===== Main ===== */}
      <main>
        <table
          className={`w-full border ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          <thead>
            <tr>
              <th className="border p-2">{t("manageRoles.id")}</th>
              <th className="border p-2">{t("manageRoles.name")}</th>
              <th className="border p-2">{t("manageRoles.role")}</th>
              <th className="border p-2">{t("manageRoles.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {paginate(users).map((user: User) => (
              <tr key={user._id}>
                <td className="border p-2">{user.universityId}</td>
                <td className="border p-2">{user.firstName}</td>
                <td className="border p-2">{t(`roles.${user.role}`)}</td>

                <td
                  className={`border p-2 ${
                    isRTL
                      ? "flex flex-row-reverse gap-5 justify-end"
                      : "flex flex-row gap-5 justify-start"
                  }`}
                >
                  {/* ===== Edit Dialog ===== */}
                  <EditDialog<User>
                    title={t("manageRoles.editTitle")}
                    description={t("manageRoles.editDescription")}
                    initialData={user}
                    fields={[
                      {
                        key: "firstName",
                        label: t("manageRoles.firstName"),
                        placeholder: t("manageRoles.firstNamePlaceholder"),
                      },
                      {
                        key: "lastName",
                        label: t("manageRoles.lastName"),
                        placeholder: t("manageRoles.lastNamePlaceholder"),
                      },
                      {
                        key: "email",
                        label: t("manageRoles.email"),
                        placeholder: t("manageRoles.emailPlaceholder"),
                        type: "email",
                      },
                    ]}
                    extraContent={
                      <label>
                        <span className="text-sm font-bold">
                          {t("manageRoles.role")}
                        </span>
                        <Menu
                          className="w-full"
                          title={t("manageRoles.selectRole")}
                          items={["student", "supervisor", "admin"]}
                          selected={role || user.role}
                          setSelected={(role) => setRole(role)}
                          nullItem={false}
                        />
                      </label>
                    }
                    onSave={async (updatedUser) => {
                      const { _id, ...updateData } = updatedUser;

                      const response = await fetch(
                        `${import.meta.env.VITE_BASE_URL}/admin/${user._id}`,
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                              "token",
                            )}`,
                          },
                          body: JSON.stringify({
                            ...updateData,
                            role: role || user.role,
                          }),
                        },
                      );
                      const data = await response.json();
                      if (response.ok) {
                        toast.success(t("manageRoles.updateSuccess"));
                      } else {
                        toast.error(
                          data.message || t("manageRoles.updateError"),
                        );
                      }
                    }}
                  />

                  {/* ===== Delete Button ===== */}
                  <Button size="sm" variant="destructive">
                    {t("manageRoles.delete")}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ===== Pagination ===== */}
        <div
          className={`mt-4 flex justify-end space-x-2 ${
            isRTL ? "flex-row-reverse space-x-reverse" : ""
          }`}
        >
          <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
            {t("manageRoles.prev")}
          </Button>
          <Button
            onClick={() => setPage(page + 1)}
            disabled={page === lastPage}
          >
            {t("manageRoles.next")}
          </Button>
        </div>
      </main>
    </div>
  );
}

export default ManageRoles;
