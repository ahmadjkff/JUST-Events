import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/input";
import type { User } from "../../../types/userTypes";
import { getAllUsers } from "../services/APIRequests";
import toast from "react-hot-toast";
import EditDialog from "../../../components/ui/EditDialog";
import Menu from "../../../components/ui/Menu";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Search, Trash2, Users } from "lucide-react";

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

  const itemsPerPage = 10;
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

  const filteredUsers = users.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      className={`bg-muted/30 min-h-screen p-6 md:p-8 ${isRTL ? "text-right" : "text-left"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        {/* ===== Header Card ===== */}
        <header className="border-border bg-card rounded-xl border p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                <Users className="text-primary h-6 w-6" />
              </div>
              <div>
                <h1 className="text-foreground text-2xl font-bold tracking-tight">
                  {t("manageRoles.title")}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {t("manageRoles.subtitle")}
                </p>
              </div>
            </div>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder={t("manageRoles.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 md:w-72"
              />
            </div>
          </div>
        </header>

        {/* ===== Table Card ===== */}
        <main className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-border bg-muted/50 border-b">
                  <th className="text-muted-foreground px-6 py-4 text-xs font-semibold tracking-wider uppercase">
                    {t("manageRoles.id")}
                  </th>
                  <th className="text-muted-foreground px-6 py-4 text-xs font-semibold tracking-wider uppercase">
                    {t("manageRoles.name")}
                  </th>
                  <th className="text-muted-foreground px-6 py-4 text-xs font-semibold tracking-wider uppercase">
                    {t("manageRoles.role")}
                  </th>
                  <th className="text-muted-foreground px-6 py-4 text-xs font-semibold tracking-wider uppercase">
                    {t("manageRoles.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {paginate(filteredUsers).length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-muted-foreground px-6 py-12 text-center"
                    >
                      <Users className="mx-auto mb-3 h-10 w-10 opacity-40" />
                      <p className="font-medium">No users found</p>
                      <p className="text-sm">Try adjusting your search</p>
                    </td>
                  </tr>
                ) : (
                  paginate(filteredUsers).map((user: User) => (
                    <tr
                      key={user._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-muted text-foreground rounded-md px-2.5 py-1 font-mono text-sm">
                          {user.universityId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-foreground font-medium">
                          {user.firstName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : user.role === "supervisor"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          }`}
                        >
                          {t(`roles.${user.role}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`flex items-center gap-2 ${
                            isRTL
                              ? "flex-row-reverse justify-end"
                              : "justify-start"
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
                                placeholder: t(
                                  "manageRoles.firstNamePlaceholder",
                                ),
                              },
                              {
                                key: "lastName",
                                label: t("manageRoles.lastName"),
                                placeholder: t(
                                  "manageRoles.lastNamePlaceholder",
                                ),
                              },
                              {
                                key: "email",
                                label: t("manageRoles.email"),
                                placeholder: t("manageRoles.emailPlaceholder"),
                                type: "email",
                              },
                            ]}
                            extraContent={
                              <label className="block space-y-2">
                                <span className="text-foreground text-sm font-medium">
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
                                toast.success(t("manageRoles.updateSuccess"));
                              } else {
                                toast.error(
                                  data.message || t("manageRoles.updateError"),
                                );
                              }
                            }}
                          />

                          {/* ===== Delete Button ===== */}
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1.5"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {t("manageRoles.delete")}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ===== Pagination ===== */}
          <div className="border-border bg-muted/30 flex items-center justify-between border-t px-6 py-4">
            <p className="text-muted-foreground text-sm">
              Showing{" "}
              <span className="text-foreground font-medium">
                {Math.min((page - 1) * itemsPerPage + 1, filteredUsers.length)}
              </span>{" "}
              to{" "}
              <span className="text-foreground font-medium">
                {Math.min(page * itemsPerPage, filteredUsers.length)}
              </span>{" "}
              of{" "}
              <span className="text-foreground font-medium">
                {filteredUsers.length}
              </span>{" "}
              results
            </p>
            <div
              className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                {t("manageRoles.prev")}
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setPage(p)}
                    className="h-8 w-8 p-0"
                  >
                    {p}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === lastPage}
                className="gap-1"
              >
                {t("manageRoles.next")}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ManageRoles;
