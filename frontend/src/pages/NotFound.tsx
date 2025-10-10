import { Button } from "../components/ui/Button";
import { useAuth } from "../context/auth/AuthContext";
import { useTranslation } from "react-i18next";

function NotFound() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="bg-background flex h-screen flex-col items-center justify-center px-4 text-center">
      {/* Number 404 */}
      <h1 className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-[8rem] font-extrabold text-transparent">
        404
      </h1>

      {/* the title */}
      <h2 className="text-foreground mb-2 text-3xl font-bold">
        {t("notFound.title")}
      </h2>

      {/* Description */}
      <p className="text-muted-foreground mb-6 max-w-md">
        {t("notFound.description")}
      </p>

      {user?.role === "admin" ? (
        <Button
          variant="default"
          size="lg"
          className="rounded-full px-8 text-lg shadow-md transition-all hover:shadow-lg"
          onClick={() => (window.location.href = "/admin/dashboard")}
        >
          ⬅ {t("notFound.backDashboard")}
        </Button>
      ) : (
        <Button
          variant="default"
          size="lg"
          className="rounded-full px-8 text-lg shadow-md transition-all hover:shadow-lg"
          onClick={() => (window.location.href = "/")}
        >
          ⬅ {t("notFound.backHome")}
        </Button>
      )}
    </div>
  );
}

export default NotFound;
