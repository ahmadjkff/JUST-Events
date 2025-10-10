import { useTitle } from "../hooks/useTitle";
import StudentDashboardCards from "../components/DashboardCards";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();

  useTitle(`${t("sidebar.home")} - ${t("app.name")}`);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-border border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              {t("home.welcomeBack", { name: user?.firstName || t("home.guest") })}
            </h1>
            <p className="text-muted-foreground">
              {t("home.subtitle")}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          {/* Welcome Message */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="mb-2 text-xl font-semibold">
                    {t("home.welcomeTitle")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("home.welcomeDescription")}
                  </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/browse-events">{t("browseEvents.title")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Cards */}
          <StudentDashboardCards />
        </div>
      </main>
    </div>
  );
}

export default Home;
