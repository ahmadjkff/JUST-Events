import { useTitle } from "../hooks/useTitle";
import { Card, CardContent } from "../components/ui/Card";
import { useTranslation } from "react-i18next";

function Notifications() {
  const { t } = useTranslation();
  useTitle(`${t("notifications.title")} - JUST Events`);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="bg-card border-border border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              {t("notifications.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("notifications.description")}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          <Card className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="mb-2 text-xl font-semibold">
                    {t("notifications.headerTitle")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("notifications.headerDescription")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-4">
            {/* Example Notification Item */}
            <Card className="border border-gray-300 dark:border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {t("notifications.exampleTitle")}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("notifications.exampleDescription")}
                </p>
                <span className="text-xs text-gray-500">
                  {t("notifications.exampleTime")}
                </span>
              </CardContent>
            </Card>
            {/* Add more notification items as needed */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Notifications;
