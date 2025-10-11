import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { useTitle } from "../hooks/useTitle";
import { useTranslation } from "react-i18next";

function Setting() {
  const { t } = useTranslation();
  useTitle(`${t("settings.title")} - JUST Events`);

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="border-muted w-[420px] border shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold tracking-tight">
            ⚙️ {t("settings.title")}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-5">
          {/* Toggle Dark/Light */}
          <Button
            variant="outline"
            className="hover:bg-accent hover:text-accent-foreground flex h-12 w-60 items-center gap-2 rounded-full text-lg transition-all"
          >
            <span>{t("settings.toggleTheme")}</span>
          </Button>

          {/* Switch Language */}
          <Button
            variant="outline"
            className="hover:bg-accent hover:text-accent-foreground flex h-12 w-60 items-center gap-2 rounded-full text-lg transition-all"
          >
            <span>{t("settings.switchLanguage")}</span>
          </Button>

          {/* Logout */}
          <Button
            variant="destructive"
            className="flex h-12 w-60 items-center gap-2 rounded-full text-lg shadow-md transition-all hover:shadow-lg"
          >
            🚪 <span>{t("settings.logout")}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Setting;
